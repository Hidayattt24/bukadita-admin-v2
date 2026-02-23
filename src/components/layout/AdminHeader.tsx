"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps = {}) {
  const { profile, isLoading, logout } = useAuth();
  const router = useRouter();

  const displayName = profile?.full_name || profile?.email || "Admin";
  const roleLabel =
    profile?.role === "superadmin"
      ? "Superadmin"
      : profile?.role === "admin"
        ? "Admin"
        : null;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Keluar dari Admin?",
      text: "Anda yakin ingin logout dari aplikasi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      focusCancel: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await logout();
        } catch (e) {
          Swal.showValidationMessage("Gagal logout. Coba lagi.");
          throw e;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "Logout berhasil",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
      router.push("/login");
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex h-20 bg-[#27548A] shadow-lg border-b border-[#1e4068] flex-shrink-0">
        <div className="h-full px-8 flex items-center justify-between w-full">
          {/* Left Section - Title */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-white/80 font-medium">
                Bukadita - Buku Kader Digital Posyandu
              </p>
            </div>
          </div>

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* User Info Card */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  {isLoading ? "Memuat..." : displayName}
                </span>
                {roleLabel && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    {roleLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex md:hidden fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-[#578FCA] to-[#27548A] shadow-lg border-b border-[#1e4068] z-50">
        <div className="h-full px-4 flex items-center justify-between w-full">
          {/* Left - Menu Button */}
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Right - Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/90 backdrop-blur-sm border border-red-400/30 text-white hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-semibold">Logout</span>
          </button>
        </div>
      </header>
    </>
  );
}
