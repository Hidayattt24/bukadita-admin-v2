"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Simple loading component for protected routes
function LoadingIndicator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#27548A] via-[#1C3C6D] to-[#0F2C4C] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading Bukadita Admin...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requireAdmin = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
      } else if (
        requireAdmin &&
        profile &&
        profile.role !== "admin" &&
        profile.role !== "superadmin"
      ) {
        // Authenticated but not admin
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, profile, requireAdmin, router, pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <LoadingIndicator />;
  }

  // Authenticated but not admin
  if (
    requireAdmin &&
    profile &&
    profile.role !== "admin" &&
    profile.role !== "superadmin"
  ) {
    return <LoadingIndicator />;
  }

  // Authenticated and authorized
  return <>{children}</>;
}
