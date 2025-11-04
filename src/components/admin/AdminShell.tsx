"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, ReactNode, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Users,
  ChartPie,
  BookOpen,
  ListChecks,
  ChevronDown,
  LogOut,
  User,
  Folder,
  TrendingUp,
} from "lucide-react";
// Removed unused specific category icons due to dynamic modules
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { modulesAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AdminShellProps {
  children: ReactNode;
}

function AdminHeader() {
  const { profile, isLoading, logout } = useAuth();

  const displayName = profile?.full_name || profile?.email || "Admin";
  const roleLabel =
    profile?.role === "superadmin"
      ? "Superadmin"
      : profile?.role === "admin"
      ? "Admin"
      : null;

  const router = useRouter();
  return (
    <header className="fixed top-0 left-80 right-0 h-20 bg-[#27548A] shadow-lg z-30 border-b border-[#1e4068]">
      <div className="h-full px-8 flex items-center justify-between">
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
            <h1 className="text-xl font-bold text-white">
              Admin Panel
            </h1>
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
            onClick={async () => {
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
            }}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  // Dynamic modules loaded from localStorage (UI only for now)
  type ModuleItem = {
    id: string | number;
    title: string;
    materiCount?: number;
    quizCount?: number;
  };
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const MODULES_STORAGE_KEY = "admin_modules";

  // normalize path (remove trailing slash) and determine active state
  const normalize = (p?: string) => (p || "").replace(/\/+$/, "");
  const isActive = (href: string) => {
    const current = normalize(pathname);
    const target = normalize(href);
    // make the root admin link active only on exact '/'
    if (target === "/") return current === "/";
    return current.startsWith(target);
  };

  const itemBase =
    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium";
  const itemActive =
    "bg-white/20 text-white shadow-md";
  const itemHover = "hover:bg-white/10";

  // Load modules from backend (preferred) with fallback to localStorage; subscribe to changes
  useEffect(() => {
    const load = async () => {
      // Try backend first
      try {
        const res = await modulesAPI.list();
        if (res.ok) {
          const dataAny = res.data as unknown as
            | ModuleItem[]
            | { items?: ModuleItem[]; data?: ModuleItem[] };
          const items = Array.isArray(dataAny)
            ? dataAny
            : ((dataAny.items || dataAny.data || []) as ModuleItem[]);
          if (items && Array.isArray(items)) {
            setModules(items);
            try {
              localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(items));
            } catch {
              /* ignore */
            }
            return;
          }
        }
      } catch {
        // ignore and fallback
      }

      // Fallback to localStorage
      try {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem(MODULES_STORAGE_KEY)
            : null;
        if (raw) {
          const parsed = JSON.parse(raw) as ModuleItem[];
          setModules(parsed);
          return;
        }
      } catch {
        /* ignore */
      }

      // Seed when nothing available
      const seed: ModuleItem[] = [
        {
          id: "bayi-balita",
          title: "Bayi & Balita",
          materiCount: 12,
          quizCount: 6,
        },
        {
          id: "remaja-sekolah",
          title: "Usia Sekolah & Remaja",
          materiCount: 9,
          quizCount: 4,
        },
        {
          id: "hamil-menyusui",
          title: "Ibu Hamil & Menyusui",
          materiCount: 8,
          quizCount: 5,
        },
        {
          id: "dewasa-lansia",
          title: "Dewasa & Lansia",
          materiCount: 10,
          quizCount: 7,
        },
      ];
      setModules(seed);
    };

    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === MODULES_STORAGE_KEY) load();
    };
    const onCustom = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("modules:updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("modules:updated", onCustom as EventListener);
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 w-80 bg-[#27548A] text-white shadow-2xl h-screen flex flex-col z-40 border-r border-[#1e4068] overflow-hidden">
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center bg-[#1e4068] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <Image
              src="/logo-putih.svg"
              alt="Bukadita Logo"
              width={50}
              height={25}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">BUKADITA</h2>
            <p className="text-xs text-white/80">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-6 pt-8">
        <nav className="space-y-2"  >
          {/* Dashboard */}
          <Link
            href="/admin/dashboard"
            className={`${itemBase} ${
              isActive("/admin/dashboard") ? itemActive : itemHover
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isActive("/admin/dashboard") ? "bg-white/20" : "bg-white/10"
              }`}
            >
              <ChartPie className="w-5 h-5" />
            </div>
            <span>Dashboard</span>
            {isActive("/admin/dashboard") && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </Link>

          {/* Kelola Pengguna - Dropdown untuk admin dan superadmin */}
          {(profile?.role === "admin" || profile?.role === "superadmin") && (
            <div>
              <button
                onClick={() => setOpenUserManagement(!openUserManagement)}
                className={`${itemBase} w-full justify-between ${
                  isActive("/admin/kelola-pengguna") ? itemActive : itemHover
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive("/admin/kelola-pengguna")
                        ? "bg-white/20"
                        : "bg-white/10"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                  </div>
                  <span>Kelola Pengguna</span>
                </div>
                <div
                  className={`transition-transform duration-200 ${
                    openUserManagement ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {openUserManagement && (
                <div className="mt-2 ml-4 space-y-1 pl-4 border-l-2 border-white/20">
                  <Link
                    href="/admin/kelola-pengguna?role=pengguna"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                      pathname?.includes("/admin/kelola-pengguna") &&
                      pathname?.includes("role=pengguna")
                        ? "bg-white/20 text-white font-semibold shadow-sm"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Kelola Pengguna</span>
                  </Link>

                  {profile?.role === "superadmin" && (
                    <Link
                      href="/admin/kelola-pengguna?role=admin"
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                        pathname?.includes("/admin/kelola-pengguna") &&
                        pathname?.includes("role=admin")
                          ? "bg-white/20 text-white font-semibold shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Kelola Admin</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Kelola Modul */}
          <Link
            href="/admin/kelola-modul"
            className={`${itemBase} ${
              isActive("/admin/kelola-modul") ? itemActive : itemHover
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isActive("/admin/kelola-modul") ? "bg-white/20" : "bg-white/10"
              }`}
            >
              <Folder className="w-5 h-5" />
            </div>
            <span>Kelola Modul</span>
            {isActive("/admin/kelola-modul") && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </Link>

          {/* Progress */}
          <Link
            href="/admin/progress"
            className={`${itemBase} ${
              isActive("/admin/progress") ? itemActive : itemHover
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isActive("/admin/progress") ? "bg-white/20" : "bg-white/10"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <span>Progress & Attempts</span>
            {isActive("/admin/progress") && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </Link>

          {/* Divider */}
          <div className="pt-8 pb-4">
            <div className="flex items-center gap-2 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Modul Edukasi
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
          {/* Dynamic Modules */}
          <div className="space-y-3 mt-2">
            {modules.map((m) => {
              const open = openModules[m.id] ?? false;
              return (
                <div key={m.id} className="px-1">
                  <button
                    onClick={() =>
                      setOpenModules((prev) => ({ ...prev, [m.id]: !open }))
                    }
                    className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      open ? "bg-white/15 shadow-sm" : "hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg transition-all ${
                        open ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      <Folder className={`w-5 h-5 ${open ? "text-white" : "text-white/80"}`} />
                    </div>
                    <span
                      className={`flex-1 text-left font-semibold text-sm leading-relaxed ${
                        open ? "text-white" : "text-white/90"
                      }`}
                      title={m.title}
                    >
                      {m.title}
                    </span>
                    <div
                      className={`transition-transform duration-200 flex-shrink-0 ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className={`w-5 h-5 ${open ? "text-white" : "text-white/60"}`} />
                    </div>
                  </button>

                  {open && (
                    <div className="mt-2 ml-6 space-y-1.5 pl-6 border-l-2 border-white/20">
                      <Link
                        href={`/admin/modul/${encodeURIComponent(m.id)}/materi`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                          isActive(`/admin/modul/${m.id}/materi`)
                            ? "bg-white/20 text-white font-semibold shadow-sm"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium">Materi</span>
                      </Link>
                      <Link
                        href={`/admin/modul/${encodeURIComponent(m.id)}/kuis`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                          isActive(`/admin/modul/${m.id}/kuis`)
                            ? "bg-white/20 text-white font-semibold shadow-sm"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <ListChecks className="w-4 h-4" />
                        <span className="font-medium">Kuis</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer - Version Info */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>v2.0.0</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader />
      <main className="ml-80 pt-20 h-screen max-w-none overflow-y-auto overflow-x-hidden p-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
