"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Profile } from '@/types/profile';
import { apiLogin, apiLogout, type BackendProfile } from '@/lib/api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Initial hydration: check cookie-based session info for quick guard
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const resp = await fetch('/api/auth/session', { method: 'GET' });
        const json = await resp.json().catch(() => null);
        if (!active) return;

        // If cookies say authed admin, restore session
        if (json?.authed && (json?.role === 'admin' || json?.role === 'superadmin')) {
          setIsAuthenticated(true);

          // Also try to restore profile from sessionStorage (for displaying correct name/role)
          if (typeof window !== 'undefined') {
            try {
              const storedProfile = sessionStorage.getItem('admin_profile');
              const storedAccessToken = sessionStorage.getItem('admin_access_token');
              const storedRefreshToken = sessionStorage.getItem('admin_refresh_token');

              if (storedProfile) {
                const prof = JSON.parse(storedProfile) as Profile;
                setProfile(prof);
                setUserId(prof.id);
                if (storedAccessToken) setAccessToken(storedAccessToken);
                if (storedRefreshToken) setRefreshToken(storedRefreshToken);
              }
            } catch (e) {
              console.warn('Failed to restore profile from sessionStorage:', e);
            }
          }
        }
      } catch { }
      if (active) setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Local tokens (kept in memory only; BE should set httpOnly cookies)
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [refreshToken, setRefreshToken] = useState<string | undefined>();

  function mapBackendToProfile(p: BackendProfile | null | undefined): Profile | null {
    if (!p || !p.id) return null;
    return {
      id: p.id,
      email: p.email || '',
      full_name: p.full_name || '',
      phone: p.phone || '',
      role: (p.role === 'admin' || p.role === 'superadmin' ? (p.role as 'admin' | 'superadmin') : 'pengguna'),
      created_at: new Date().toISOString(),
      email_confirmed_at: undefined,
      last_sign_in_at: undefined,
    } satisfies Profile;
  }

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      console.log('🔐 Attempting login (backend) for:', email);

      const res = await apiLogin(email, password);
      if (!res.ok) {
        if (res.status === 401) {
          setIsLoading(false);
          return { ok: false, error: 'Email atau password salah.' };
        }
        setIsLoading(false);
        return { ok: false, error: res.error };
      }

      const { access_token, refresh_token, profile: beProfile, userId: beUserId, userEmail: beEmail, role: beRole } = res.data;

      // Handle 202: profile provisioning flow
      if (res.status === 202) {
        // store any tokens in memory briefly
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setIsAuthenticated(false);
        setUserId(null);
        setProfile(null);

        // Auto-retry up to 2 times with small delay
        for (let attempt = 1; attempt <= 2; attempt++) {
          await new Promise((r) => setTimeout(r, 1500));
          const retry = await apiLogin(email, password);
          if (retry.ok && retry.status === 200 && (retry.data.profile?.role === 'admin' || retry.data.profile?.role === 'superadmin')) {
            const retryProf = mapBackendToProfile(retry.data.profile);
            if (retryProf) {
              setAccessToken(retry.data.access_token);
              setRefreshToken(retry.data.refresh_token);
              setProfile(retryProf);
              setUserId(retryProf.id);
              await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: retryProf.id, role: retry.data.profile?.role }),
              });
              setIsAuthenticated(true);
              setIsLoading(false);
              return { ok: true };
            }
          }
        }
        setIsLoading(false);
        return { ok: false, error: 'Profile provisioning in progress — retry in a few seconds' };
      }

      // Build profile from BE data (profile or fallback from user fields)
      const prof = mapBackendToProfile(
        beProfile ?? (beUserId ? { id: beUserId, email: beEmail || undefined, role: beRole || undefined } : null)
      );

      if (!prof) {
        // No profile returned by BE
        setAccessToken(undefined);
        setRefreshToken(undefined);
        setIsAuthenticated(false);
        setUserId(null);
        setProfile(null);
        setIsLoading(false);
        return { ok: false, error: 'Profile tidak ditemukan. Silakan coba lagi atau hubungi admin.' };
      }

      if (prof.role !== 'admin' && prof.role !== 'superadmin') {
        // Not admin, revoke on server (best-effort)
        void apiLogout(access_token, refresh_token);
        setAccessToken(undefined);
        setRefreshToken(undefined);
        setIsAuthenticated(false);
        setUserId(null);
        setProfile(null);
        setIsLoading(false);
        return { ok: false, error: 'Akses ditolak. Hanya admin.' };
      }

      // Persist in memory; assume BE sets httpOnly cookies for session
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_access_token', access_token || '');
          if (refresh_token) sessionStorage.setItem('admin_refresh_token', refresh_token);
          // IMPORTANT: Also persist profile for session restore on refresh
          sessionStorage.setItem('admin_profile', JSON.stringify(prof));
        }
      } catch { }
      setProfile(prof);
      setUserId(prof.id);

      // Set cookies used by Next middleware for /admin/**
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: prof.id, role: prof.role }),
      });

      setIsAuthenticated(true);
      setIsLoading(false);
      return { ok: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      return { ok: false, error: 'Terjadi kesalahan' };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');

      // Ask backend to invalidate session
      await apiLogout(accessToken, refreshToken);

      // Clear admin cookies used by middleware
      await fetch('/api/auth/logout', { method: 'POST' });

      // Clear local storage
      setIsAuthenticated(false);
      setUserId(null);
      setProfile(null);
      setAccessToken(undefined);
      setRefreshToken(undefined);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_access_token');
          sessionStorage.removeItem('admin_refresh_token');
          sessionStorage.removeItem('admin_profile'); // Also clear profile
        }
      } catch { }
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local state even if backend logout fails
      setIsAuthenticated(false);
      setUserId(null);
      setProfile(null);
      setAccessToken(undefined);
      setRefreshToken(undefined);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_access_token');
          sessionStorage.removeItem('admin_refresh_token');
          sessionStorage.removeItem('admin_profile');
        }
      } catch { }
    }
  };

  const value = {
    isAuthenticated,
    userId,
    profile,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
