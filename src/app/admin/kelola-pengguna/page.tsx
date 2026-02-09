"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/layout/AdminLayout";
import UserManagement from "@/components/users/UserManagementPage";

export default function KelolaPenggunaPage() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams?.get("role") || "";

  // Redirect jika bukan admin atau superadmin
  useEffect(() => {
    if (!isLoading && profile) {
      // Jika bukan admin atau superadmin, redirect ke dashboard
      if (profile.role !== 'admin' && profile.role !== 'superadmin') {
        router.push('/admin/dashboard');
        return;
      }

      // Jika admin (bukan superadmin) mencoba akses role=admin, redirect ke pengguna
      if (profile.role === 'admin' && roleFilter === 'admin') {
        router.push('/admin/kelola-pengguna?role=pengguna');
        return;
      }
    }
  }, [profile, isLoading, roleFilter, router]);

  // Show loading or access denied
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  );
}