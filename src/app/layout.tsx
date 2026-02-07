import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AdminShell from "@/components/layout/AdminShell";
import { ToastProvider } from "@/components/ui/toast";
import QueryProvider from "@/providers/QueryProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "BUKADITA Admin | Buku Digital Kader Posyandu",
    template: "%s | BUKADITA Admin",
  },
  description: "Portal administrator BUKADITA (Buku Digital Kader). Sistem monitoring pembelajaran kader posyandu berbasis digital untuk meningkatkan kualitas pelayanan kesehatan masyarakat. Platform penelitian Universitas Syiah Kuala.",
  keywords: [
    "bukadita",
    "buku digital kader",
    "admin posyandu",
    "kader posyandu",
    "pembelajaran digital",
    "monitoring kader",
    "sistem posyandu",
    "kesehatan masyarakat",
    "universitas syiah kuala",
    "penelitian kesehatan",
    "manajemen posyandu",
    "platform edukasi",
  ],
  authors: [{ name: "Tim Penelitian Universitas Syiah Kuala" }],
  creator: "Universitas Syiah Kuala",
  publisher: "BUKADITA",
  metadataBase: new URL("https://admin.bukadita.id"),
  openGraph: {
    title: "BUKADITA Admin | Buku Digital Kader Posyandu",
    description: "Sistem monitoring pembelajaran kader posyandu berbasis digital untuk meningkatkan kualitas pelayanan kesehatan masyarakat",
    url: "https://admin.bukadita.id",
    siteName: "BUKADITA Admin",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Logo BUKADITA - Buku Digital Kader Posyandu",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUKADITA Admin | Buku Digital Kader Posyandu",
    description: "Sistem monitoring pembelajaran kader posyandu berbasis digital",
    images: ["/icons/icon-512x512.png"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <QueryProvider>
          <ToastProvider>
            <AdminShell>
              <div>{children}</div>
            </AdminShell>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
