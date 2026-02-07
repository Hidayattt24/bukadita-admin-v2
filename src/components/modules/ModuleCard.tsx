import Link from "next/link";
import { Folder, BookOpen, ListChecks, Edit, Trash2, Check, X, Clock, Tag } from "lucide-react";

interface ModuleCardProps {
  module: {
    id: string | number;
    title: string;
    description?: string;
    published?: boolean;
    duration_label?: string | null;
    duration_minutes?: number | null;
    category?: string | null;
  };
  materialsCount: number;
  quizCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ModuleCard({
  module,
  materialsCount,
  quizCount,
  onEdit,
  onDelete,
}: ModuleCardProps) {
  return (
    <div
      className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      style={{
        boxShadow:
          "6px 6px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>

      {/* Header Section */}
      <div className="relative flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800 mb-1 sm:mb-2 truncate">
              {module.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2 sm:mb-3">
              {module.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex-shrink-0 ml-2 ${
            module.published
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}
        >
          {module.published ? (
            <>
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Terbit</span>
            </>
          ) : (
            <>
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Draft</span>
            </>
          )}
        </div>
      </div>

      {/* Module Info Tags */}
      <div className="relative flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {module.category && (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-medium">
            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            {module.category}
          </span>
        )}
        {(module.duration_minutes || module.duration_label) && (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] sm:text-xs font-medium">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            {module.duration_label || `${module.duration_minutes} menit`}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative flex items-center gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-slate-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-50 text-green-700 rounded-lg sm:rounded-xl hover:bg-green-100 transition-all font-semibold text-xs sm:text-sm"
        >
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-700 rounded-lg sm:rounded-xl hover:bg-red-100 transition-all font-semibold text-xs sm:text-sm"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Hapus</span>
        </button>
      </div>

      {/* Content Navigation Cards */}
      <div className="relative grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <Link
          href={`/admin/modul/${encodeURIComponent(module.id)}/materi`}
          className="group/link relative rounded-lg sm:rounded-xl border-2 border-[#27548A]/20 bg-gradient-to-br from-[#27548A]/5 to-[#578FCA]/10 p-2 sm:p-3 md:p-4 hover:border-[#27548A]/40 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-gradient-to-br from-[#27548A] to-[#578FCA] grid place-items-center text-white shadow-md group-hover/link:shadow-lg transition-all">
                <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-[#27548A] group-hover/link:text-[#578FCA] truncate">
                  Materi
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-600 truncate">Kelola konten</div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#27548A] group-hover/link:text-[#578FCA]">
                  {materialsCount}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500">Materi</div>
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#27548A] font-semibold group-hover/link:text-[#578FCA]">
                <span className="hidden sm:inline">Lihat Detail</span>
                <span className="sm:hidden">Detail</span>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={`/admin/modul/${encodeURIComponent(module.id)}/kuis`}
          className="group/link relative rounded-lg sm:rounded-xl border-2 border-[#578FCA]/20 bg-gradient-to-br from-[#578FCA]/5 to-[#27548A]/10 p-2 sm:p-3 md:p-4 hover:border-[#578FCA]/40 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] grid place-items-center text-white shadow-md group-hover/link:shadow-lg transition-all">
                <ListChecks className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-[#578FCA] group-hover/link:text-[#27548A] truncate">
                  Kuis
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-600 truncate">Evaluasi</div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#578FCA] group-hover/link:text-[#27548A]">
                  {quizCount}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500">Kuis</div>
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#578FCA] font-semibold group-hover/link:text-[#27548A]">
                <span className="hidden sm:inline">Lihat Detail</span>
                <span className="sm:hidden">Detail</span>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
