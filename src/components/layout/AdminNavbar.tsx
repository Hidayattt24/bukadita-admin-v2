"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  ChartPie,
  Users,
  Folder,
  TrendingUp,
  BookOpen,
  ListChecks,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { modulesAPI } from "@/lib/api";
import { AdminHeader } from "./AdminHeader";

type ModuleItem = {
  id: string | number;
  title: string;
  materiCount?: number;
  quizCount?: number;
};

export function AdminNavbar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAuth();
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [openUsers, setOpenUsers] = useState(false);
  const MODULES_STORAGE_KEY = "admin_modules";

  const normalize = (p?: string) => (p || "").replace(/\/+$/, "");
  const isActive = (href: string) => {
    const current = normalize(pathname);
    const target = normalize(href);
    if (target === "/") return current === "/";
    return current.startsWith(target);
  };

  // Load modules from backend with fallback to localStorage
  useEffect(() => {
    const load = async () => {
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
        // fallback
      }

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

  const mainLinks = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <ChartPie className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Kelola Modul",
      href: "/admin/kelola-modul",
      icon: <Folder className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Progress & Attempts",
      href: "/admin/progress",
      icon: (
        <TrendingUp className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
  ];

  const userManagementLinks = [
    ...(profile?.role === "superadmin"
      ? [
          {
            label: "Ketua Posyandu / Admin",
            href: "/admin/kelola-pengguna?role=admin",
            icon: <Users className="h-4 w-4 shrink-0 text-neutral-200" />,
          },
        ]
      : []),
    {
      label: "Pengguna",
      href: "/admin/kelola-pengguna?role=pengguna",
      icon: <Users className="h-4 w-4 shrink-0 text-neutral-200" />,
    },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed Full Height */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto modern-scrollbar">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {/* Dashboard Link */}
              <SidebarLink link={mainLinks[0]} />

              {/* User Management Section - Only for Admin/Superadmin */}
              {(profile?.role === "admin" || profile?.role === "superadmin") && (
                <div className="space-y-1">
                  <button
                    onClick={() => setOpenUsers(!openUsers)}
                    className={cn(
                      "group/sidebar flex w-full items-center justify-between gap-2 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 shrink-0 text-neutral-200" />
                      <motion.span
                        animate={{
                          display: open ? "inline-block" : "none",
                          opacity: open ? 1 : 0,
                        }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        Kelola Pengguna
                      </motion.span>
                    </div>
                    <motion.div
                      animate={{
                        display: open ? "block" : "none",
                        opacity: open ? 1 : 0,
                        rotate: openUsers ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-neutral-200" />
                    </motion.div>
                  </button>

                  {/* Submenu for User Management */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: openUsers && open ? "auto" : 0,
                      opacity: openUsers && open ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pl-4 pt-1">
                      {userManagementLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors",
                            isActive(link.href)
                              ? "bg-white/20 text-white font-semibold"
                              : "text-neutral-300 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Other Main Links (Kelola Modul, Progress & Attempts) */}
              {mainLinks.slice(1).map((link, idx) => (
                <SidebarLink key={idx + 1} link={link} />
              ))}

              {/* Divider for Modules */}
              <div className="pt-6 pb-2">
                <motion.div
                  animate={{
                    display: open ? "flex" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="flex items-center gap-2 px-2"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Modul Edukasi
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </motion.div>
              </div>

              {/* Dynamic Modules */}
              {modules.map((m) => {
                const moduleOpen = openModules[m.id] ?? false;
                return (
                  <div key={m.id} className="space-y-1">
                    <button
                      onClick={() =>
                        setOpenModules((prev) => ({ ...prev, [m.id]: !moduleOpen }))
                      }
                      title={m.title}
                      className={cn(
                        "group/sidebar flex w-full items-center justify-between gap-2 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Folder className="h-5 w-5 shrink-0 text-neutral-200" />
                        <motion.span
                          animate={{
                            display: open ? "inline-block" : "none",
                            opacity: open ? 1 : 0,
                          }}
                          className="text-sm truncate"
                          title={m.title}
                        >
                          {m.title}
                        </motion.span>
                      </div>
                      <motion.div
                        animate={{
                          display: open ? "block" : "none",
                          opacity: open ? 1 : 0,
                          rotate: moduleOpen ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="h-4 w-4 text-neutral-200" />
                      </motion.div>
                    </button>

                    {moduleOpen && open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 pl-4 border-l-2 border-white/20 space-y-1"
                      >
                        <Link
                          href={`/admin/modul/${encodeURIComponent(m.id)}/materi`}
                          className={cn(
                            "flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors",
                            isActive(`/admin/modul/${m.id}/materi`)
                              ? "bg-white/20 text-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Materi</span>
                        </Link>
                        <Link
                          href={`/admin/modul/${encodeURIComponent(m.id)}/kuis`}
                          className={cn(
                            "flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors",
                            isActive(`/admin/modul/${m.id}/kuis`)
                              ? "bg-white/20 text-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <ListChecks className="h-4 w-4" />
                          <span>Kuis</span>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* <div className="space-y-2 pb-4">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 shrink-0 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                  {(profile?.full_name || profile?.email || "A")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <motion.div
                  animate={{
                    display: open ? "block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="flex flex-col min-w-0"
                >
                  <span className="text-sm font-semibold text-white truncate">
                    {profile?.full_name || profile?.email || "Admin"}
                  </span>
                  {profile?.role && (
                    <span className="text-xs text-white/60">
                      {profile.role === "superadmin" ? "Superadmin" : "Admin"}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div> */}
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden w-full md:w-auto">
        <motion.div
          animate={{
            marginLeft: open ? "300px" : "80px",
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="hidden md:flex md:flex-1 md:flex-col md:h-screen md:overflow-hidden"
        >
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-8 bg-gray-50 modern-scrollbar">
            {children}
          </main>
        </motion.div>
        
        {/* Mobile Layout - No margin */}
        <div className="flex md:hidden flex-1 flex-col h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-3 pt-16 bg-gray-50 modern-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
        <Image
          src="/logo-putih.svg"
          alt="Bukadita Logo"
          width={50}
          height={25}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col"
      >
        <span className="font-bold text-white text-base whitespace-pre">
          BUKADITA
        </span>
        <span className="text-xs text-white/80">Admin Panel</span>
      </motion.div>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="relative z-20 flex items-center justify-center py-1"
    >
      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
        <Image
          src="/logo-putih.svg"
          alt="Bukadita Logo"
          width={40}
          height={20}
        />
      </div>
    </Link>
  );
};
