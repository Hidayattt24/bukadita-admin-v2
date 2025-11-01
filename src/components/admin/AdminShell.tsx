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
  ChevronRight,
  LogOut,
  User,
  Folder,
  TrendingUp
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
  const roleLabel = profile?.role === "superadmin" ? "Superadmin" : profile?.role === "admin" ? "Admin" : null;

  const router = useRouter();
  return (
    <header className="fixed top-0 left-80 right-0 h-20 bg-gradient-to-l from-[#27548A] to-[#1C3C6D] shadow-sm z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Dashboard Admin</h1>
          <p className="text-xs text-slate-300">Bukadita - Buku Kader Digital Posyandu Kopelma Darussalam</p>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <span className="text-sm text-slate-300">{isLoading ? "Memuat.." : displayName}</span>
            {roleLabel && (
              <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                {roleLabel}
                <User className="inline-block w-5 h-5 text-slate-300 ml-2" />
              </span>
            )}
          </div>
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: 'Keluar dari Admin?',
                text: 'Anda yakin ingin logout dari aplikasi?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal',
                reverseButtons: true,
                focusCancel: true,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                  try {
                    await logout();
                  } catch (e) {
                    Swal.showValidationMessage('Gagal logout. Coba lagi.');
                    throw e;
                  }
                },
                allowOutsideClick: () => !Swal.isLoading(),
              });

              if (result.isConfirmed) {
                await Swal.fire({
                  title: 'Logout berhasil',
                  icon: 'success',
                  timer: 1000,
                  showConfirmButton: false,
                });
                router.push('/login');
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  // Dynamic modules loaded from localStorage (UI only for now)
  type ModuleItem = { id: string | number; title: string; materiCount?: number; quizCount?: number };
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const MODULES_STORAGE_KEY = 'admin_modules';

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
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150";
  const itemActive = "bg-white/10 text-white";
  const itemHover = "hover:bg-white/6";

  // Load modules from backend (preferred) with fallback to localStorage; subscribe to changes
  useEffect(() => {
    const load = async () => {
      // Try backend first
      try {
        const res = await modulesAPI.list();
        if (res.ok) {
          const dataAny = res.data as unknown as ModuleItem[] | { items?: ModuleItem[]; data?: ModuleItem[] };
          const items = Array.isArray(dataAny) ? dataAny : ((dataAny.items || dataAny.data || []) as ModuleItem[]);
          if (items && Array.isArray(items)) {
            setModules(items);
            try {
              localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(items));
            } catch { /* ignore */ }
            return;
          }
        }
      } catch {
        // ignore and fallback
      }

      // Fallback to localStorage
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem(MODULES_STORAGE_KEY) : null;
        if (raw) {
          const parsed = JSON.parse(raw) as ModuleItem[];
          setModules(parsed);
          return;
        }
      } catch { /* ignore */ }

      // Seed when nothing available
      const seed: ModuleItem[] = [
        { id: "bayi-balita", title: "Bayi & Balita", materiCount: 12, quizCount: 6 },
        { id: "remaja-sekolah", title: "Usia Sekolah & Remaja", materiCount: 9, quizCount: 4 },
        { id: "hamil-menyusui", title: "Ibu Hamil & Menyusui", materiCount: 8, quizCount: 5 },
        { id: "dewasa-lansia", title: "Dewasa & Lansia", materiCount: 10, quizCount: 7 }
      ];
      setModules(seed);
    };

    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === MODULES_STORAGE_KEY) load();
    };
    const onCustom = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('modules:updated', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('modules:updated', onCustom as EventListener);
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 w-80 bg-gradient-to-t from-[#27548A] to-[#1C3C6D] text-slate-100 shadow-lg min-h-screen flex flex-col z-40">
      <div className="h-20 flex items-center justify-center bg-gradient-to-r from-[#27548A] to-[#1C3C6D] border-b border-white/10">
        <Image
          src="/logo-putih.svg"
          alt="Bukadita Logo"
          width={60}
          height={30}
        />
      </div>

      <div className="p-4 pt-6 flex-1 overflow-auto">
        <nav className="space-y-3">
          <Link
            href="/admin/dashboard"
            className={`${itemBase} ${isActive("/admin/dashboard") ? itemActive : itemHover
              }`}
          >
            <ChartPie className="w-5 h-5 opacity-90" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/admin/kelola-pengguna"
            className={`${itemBase} ${isActive("/admin/kelola-pengguna") ? itemActive : itemHover
              }`}
          >
            <Users className="w-5 h-5 opacity-90" />
            <span className="font-medium">Kelola Pengguna</span>
          </Link>

          <Link
            href="/admin/kelola-modul"
            className={`${itemBase} ${isActive("/admin/kelola-modul") ? itemActive : itemHover}`}
          >
            <Folder className="w-5 h-5 opacity-90" />
            <span className="font-medium">Kelola Modul</span>
          </Link>

          <Link
            href="/admin/progress"
            className={`${itemBase} ${isActive("/admin/progress") ? itemActive : itemHover}`}
          >
            <TrendingUp className="w-5 h-5 opacity-90" />
            <span className="font-medium">Progress & Attempts</span>
          </Link>

          {/* Dynamic Modules Section */}
          <div className="pt-4">
            <div className="flex items-start px-3 py-2">
              <p className="text-md font-semibold text-slate-100">MODUL</p>
            </div>

            <div className="mt-1">
              {modules.map((m) => {
                const open = openModules[m.id] ?? false;
                return (
                  <div key={m.id} className="mb-1">
                    <button
                      onClick={() => setOpenModules((prev) => ({ ...prev, [m.id]: !open }))}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/6"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br grid place-items-center`}>
                          <Folder className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-slate-100 truncate" title={m.title}>{m.title}</span>
                      </div>
                      <span className="ml-2 flex items-center gap-2 text-xs text-slate-300">
                        {/* {typeof m.materiCount === 'number' && <span className="bg-white/10 px-2 py-0.5 rounded-full">{m.materiCount} Materi</span>} */}
                        {/* {typeof m.quizCount === 'number' && <span className="bg-white/10 px-2 py-0.5 rounded-full">{m.quizCount} Kuis</span>} */}
                        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </span>
                    </button>

                    {open && (
                      <div className="mt-1 pl-6 flex flex-col gap-1">
                        <Link
                          href={`/admin/modul/${encodeURIComponent(m.id)}/materi`}
                          className={`${itemBase} text-slate-100 text-sm ${isActive(`/admin/modul/${m.id}/materi`) ? itemActive : itemHover}`}
                        >
                          <BookOpen className="w-4 h-4 opacity-80" />
                          <span>Materi</span>
                        </Link>
                        <Link
                          href={`/admin/modul/${encodeURIComponent(m.id)}/kuis`}
                          className={`${itemBase} text-slate-100 text-sm ${isActive(`/admin/modul/${m.id}/kuis`) ? itemActive : itemHover}`}
                        >
                          <ListChecks className="w-4 h-4 opacity-80" />
                          <span>Kuis</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
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
    const onAdmin = pathname.startsWith('/admin');
    if (onAdmin && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [pathname, isAuthenticated, isLoading, router]);

  // Redirect known non-admin away from /admin/**
  useEffect(() => {
    if (
      pathname?.startsWith('/admin') &&
      isAuthenticated &&
      profile &&
      !(profile.role === 'admin' || profile.role === 'superadmin')
    ) {
      router.push('/login');
    }
  }, [pathname, isAuthenticated, profile, router]);

  // If on login or register page, render children without admin chrome
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // While auth state is loading, avoid rendering admin chrome to prevent flicker
  if (isLoading && pathname?.startsWith('/admin')) {
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