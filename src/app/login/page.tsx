import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin - Portal Pembina dan Ketua Posyandu",
  description: "Portal login administrator BUKADITA (Buku Digital Kader). Sistem monitoring pembelajaran kader posyandu berbasis digital untuk meningkatkan kualitas pelayanan kesehatan masyarakat. Platform penelitian Universitas Syiah Kuala.",
  keywords: [
    "login admin",
    "bukadita login",
    "admin posyandu",
    "pembina posyandu",
    "ketua posyandu",
  ],
  openGraph: {
    title: "Login Admin - BUKADITA | Buku Digital Kader Posyandu",
    description: "Portal login untuk pembina dan ketua posyandu. Sistem monitoring pembelajaran kader posyandu berbasis digital.",
    url: "https://admin.bukadita.id/login",
  },
  twitter: {
    title: "Login Admin - BUKADITA | Buku Digital Kader Posyandu",
    description: "Portal login untuk pembina dan ketua posyandu",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://admin.bukadita.id/login",
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Memuat form...</div>}>
      <LoginForm />
    </Suspense>
  );
}