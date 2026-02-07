"use client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Sidebar baru sudah responsive untuk mobile, tidak perlu warning lagi
  return <>{children}</>;
}
