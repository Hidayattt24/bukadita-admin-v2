"use client";

import { Monitor, AlertTriangle } from "lucide-react";

export default function MobileWarning() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-y-auto z-50">
      <div className="min-h-screen flex items-center justify-center p-6 py-12">
        <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
              <AlertTriangle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Kawasan Admin
          </h1>

          {/* Main Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              Ini adalah kawasan admin dimana kami melakukan monitoring sistem.
            </p>
          </div>

          {/* Instruction */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Monitor className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Gunakan Laptop atau Komputer
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Untuk mengakses panel admin dan fitur monitoring, silakan buka halaman ini menggunakan laptop atau komputer Anda.
            </p>
          </div>

          {/* Why Desktop */}
          <div className="text-left space-y-3 mb-6 bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 text-center mb-4">Mengapa Perlu Desktop?</h3>
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Dashboard dengan grafik dan visualisasi data yang kompleks</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Monitoring progress pengguna secara real-time</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Manajemen data yang memerlukan layar lebih luas</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Analisis dan laporan yang detail</span>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-blue-600 text-white rounded-xl p-4">
            <p className="text-sm font-semibold">
              💻 Resolusi Minimal: 1024px (Tablet Landscape / Desktop)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 mb-6 text-center">
          <p className="text-white text-sm font-medium drop-shadow-lg">
            Terima kasih atas pengertiannya 🙏
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
