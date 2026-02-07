"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
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

  // If on login or register page, render children without admin chrome
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  // While auth state is loading, avoid rendering admin chrome to prevent flicker
  if (isLoading && pathname?.startsWith("/admin")) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="text-slate-500 text-sm">Memuat sesi...</div>
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
