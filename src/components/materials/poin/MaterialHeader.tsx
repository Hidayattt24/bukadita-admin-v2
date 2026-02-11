"use client";

import {
  ArrowLeft,
  FileText,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Material } from "@/lib/api";

interface MaterialHeaderProps {
  material: Material;
  poinsCount: number;
}

export default function MaterialHeader({
  material,
  poinsCount,
}: MaterialHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-4 py-2.5 text-[#27548A] hover:text-white bg-white hover:bg-gradient-to-r hover:from-[#27548A] hover:to-[#578FCA] rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-transparent"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Kembali</span>
        </button>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/5 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#27548A] to-[#578FCA] flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#27548A] to-[#578FCA] bg-clip-text text-transparent">
                    {material.title}
                  </h1>
                </div>
              </div>
              {material.content && (
                <div className="text-gray-600 mb-4 max-h-24 overflow-hidden line-clamp-3">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: material.content.slice(0, 200) + "...",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="px-4 py-2 bg-gradient-to-r from-[#27548A]/10 to-[#578FCA]/10 text-[#27548A] rounded-xl font-semibold border border-[#27548A]/20 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {poinsCount} Poin Materi
            </div>
            {material.published ? (
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 rounded-xl font-semibold border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Terbit
              </div>
            ) : (
              <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 rounded-xl font-semibold border border-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Draft
              </div>
            )}
          </div>

          {/* Draft warning/info */}
          {!material.published && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Mode Draft
                  </p>
                  <p className="text-sm text-amber-700">
                    Materi ini belum dipublikasi, namun Anda tetap bisa
                    menambahkan dan mengelola poin-poin pembelajaran. Poin akan
                    tersimpan dan siap digunakan saat materi dipublikasikan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
