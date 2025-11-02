"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingComponent from "./LoadingComponent";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
      } else if (requireAdmin && profile && profile.role !== 'admin' && profile.role !== 'superadmin') {
        // Authenticated but not admin
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, profile, requireAdmin, router, pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <LoadingComponent />;
  }

  // Authenticated but not admin
  if (requireAdmin && profile && profile.role !== 'admin' && profile.role !== 'superadmin') {
    return <LoadingComponent />;
  }

  // Authenticated and authorized
  return <>{children}</>;
}
