'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full">
        {/* Animated 404 Illustration */}
        <div className="relative mb-8 sm:mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-[#578FCA]/20 to-[#27548A]/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative text-center">
            <h1 className="text-[120px] sm:text-[180px] font-black leading-none">
              <span className="bg-gradient-to-br from-[#578FCA] to-[#27548A] bg-clip-text text-transparent drop-shadow-2xl">
                404
              </span>
            </h1>
            
            {/* Floating Search Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-80"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-[#578FCA]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-6 sm:p-10 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#27548A] to-[#578FCA] bg-clip-text text-transparent">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau URL salah.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              onClick={() => router.back()}
              className="flex-1 group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-200 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali</span>
            </button>

            <Link
              href="/user/beranda"
              className="flex-1 group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Beranda</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t-2 border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">
              Butuh bantuan?{' '}
              <Link
                href="/user/beranda"
                className="text-[#578FCA] hover:text-[#27548A] font-semibold underline underline-offset-2 transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#578FCA] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-[#578FCA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[#578FCA] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
