"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import GalleryShowcase from "./GalleryShowcase";
import { showAlert } from "@/components/ui/CustomAlert";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    // Basic validation to avoid malformed credentials
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      setLoading(false);
      setError("Format email tidak valid.");
      showAlert.error(
        "Email Tidak Valid",
        "Mohon masukkan alamat email yang valid."
      );
      return;
    }
    if (trimmedPassword.length < 6) {
      setLoading(false);
      setError("Password minimal 6 karakter.");
      showAlert.error(
        "Password Terlalu Pendek",
        "Password harus memiliki minimal 6 karakter."
      );
      return;
    }
    const res = await login(normalizedEmail, trimmedPassword);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Email atau password salah.");
      showAlert.error(
        "Login Gagal",
        res.error || "Email atau password yang Anda masukkan salah. Silakan coba lagi."
      );
      return;
    }

    // Show success alert
    await showAlert.success(
      "Login Berhasil!",
      "Anda akan diarahkan ke dashboard...",
      {
        timer: 1500,
        showConfirmButton: false,
      }
    );

    const redirect = params.get("redirect") || "/admin/dashboard";
    router.replace(redirect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#27548A] via-[#3d6ba8] to-[#578FCA] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#578FCA]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/logo/logo-putih.svg"
                alt="Logo BUKADITA"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">BUKADITA</h1>
              <p className="text-xs text-white/80">Buku Digital Kader</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-10 text-center text-white">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold mb-4">
                Portal Pembina dan Ketua Posyandu
              </div>
              <h2 className="text-4xl font-bold mb-3">Selamat Datang</h2>
              <p className="text-white/90 text-lg">
                Sistem Monitoring Pembelajaran Kader Posyandu
              </p>
            </div>

            {/* Unified Card - Form & Gallery Side by Side */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Left Side - Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Email
                      </label>
                      <input
                        className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@bukadita.id"
                        autoComplete="username"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 pr-12 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute inset-y-0 right-0 px-4 flex items-center text-white/70 hover:text-white"
                          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#27548A] py-3.5 font-semibold shadow-lg hover:shadow-xl hover:bg-white/95 disabled:opacity-60 disabled:cursor-not-allowed mt-8"
                    >
                      {loading && (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      )}
                      {loading ? "Memproses..." : "Masuk ke Dashboard"}
                    </button>

                    {/* WhatsApp Help Button */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/80 text-sm text-center mb-3">
                        Belum ada akun atau mengalami kendala?
                      </p>
                      <a
                        href="https://wa.me/6282165551234?text=Halo,%20saya%20ingin%20bertanya%20tentang%20akun%20BUKADITA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 font-semibold shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Hubungi Pembina Posyandu
                      </a>
                    </div>
                  </form>
                </div>

                {/* Right Side - Gallery Showcase */}
                <div className="hidden lg:block h-[500px] relative">
                  <GalleryShowcase />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-6">
          <p className="text-center text-sm text-white/60">
            © 2025 BUKADITA - Penelitian Universitas Syiah Kuala. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}