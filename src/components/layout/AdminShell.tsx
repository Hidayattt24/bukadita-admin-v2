"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "./AdminNavbar";

interface AdminShellProps {
  children: ReactNode;
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, profile, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Track if component has mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Client-side guard: redirect unauthenticated access to /admin/** to /login
  useEffect(() => {
    if (!pathname) return;
    const onAdmin = pathname.startsWith("/admin");
    if (onAdmin && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [pathname, isAuthenticated, isLoading, router]);

  // Redirect known non-admin away from /admin/**
  useEffect(() => {
    if (
      pathname?.startsWith("/admin") &&
      isAuthenticated &&
      profile &&
      !(profile.role === "admin" || profile.role === "superadmin")
    ) {
      router.push("/login");
    }
  }, [pathname, isAuthenticated, profile, router]);

  // If on login, register, or 404 page, render children without admin chrome
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/not-found"
  ) {
    return <>{children}</>;
  }

  // Show simple loading state before mount (SSR/initial render)
  if (!isMounted && isLoading && pathname?.startsWith("/admin")) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="text-slate-500 text-sm">Memuat...</div>
      </div>
    );
  }

  // While auth state is loading on client, show detailed skeleton
  if (isMounted && isLoading && pathname?.startsWith("/admin")) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex w-20 flex-col bg-gradient-to-b from-[#27548A] to-[#578FCA] border-r border-white/10">
          <div className="p-4">
            {/* Logo Skeleton */}
            <div className="w-12 h-12 bg-white/20 rounded-xl animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-3 px-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-10 bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Skeleton */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 overflow-auto p-8 space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-10 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Text with Animation */}
            <div className="flex justify-center items-center gap-3 pt-8">
              <div className="flex gap-1.5">
                <div
                  className="w-2 h-2 bg-[#578FCA] rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-[#578FCA] rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-[#578FCA] rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Memuat Dashboard...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AdminNavbar>{children}</AdminNavbar>;
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
