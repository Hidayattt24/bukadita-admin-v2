import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/ui/toast";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Bukadita Admin",
  description: "Manajemen kegiatan posyandu, materi dan kuis untuk platform pembelajaran mandiri Kader Posyandu Kopelma Darussalam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <ToastProvider>
          <AdminShell>
            <div>{children}</div>
          </AdminShell>
        </ToastProvider>
      </body>
    </html>
  );
}
