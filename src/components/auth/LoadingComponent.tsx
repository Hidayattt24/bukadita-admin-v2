"use client";

import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./LoginForm";
import AdminShell from "@/components/layout/AdminShell";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function LoadingComponent({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#27548A] via-[#1C3C6D] to-[#0F2C4C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Bukadita Admin...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show admin dashboard if authenticated
  return <AdminShell>{children}</AdminShell>;
}