import { useState } from "react";
import { BookOpen, CheckCircle, XCircle, ChevronDown, ChevronUp, Search, AlertCircle, FileText } from "lucide-react";
import type { ModuleProgressDetail } from "@/lib/api";
import type { ModuleProgress } from "./types";

interface ModuleReadingProgressProps {
  modules: ModuleProgressDetail[] | ModuleProgress[];
}

export default function ModuleReadingProgress({ modules }: ModuleReadingProgressProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Filter modules based on search query
  const filteredModules = modules.filter((module) =>
    module.module_title.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Group quiz attempts by sub-materi to determine reading status
  const getSubMateriReadingStatus = (module: ModuleProgressDetail | ModuleProgress) => {
    // Group by quiz title (which represents sub-materi)
    const subMateriMap = new Map<string, { read: boolean; quizTitle: string }>();
    
    module.quiz_attempts.forEach((attempt: { quiz_title?: string; is_attempted?: boolean }) => {
      const quizTitle = attempt.quiz_title || "Sub Materi";
      const isRead = attempt.is_attempted !== false;
      
      // If already marked as read, keep it read
      if (subMateriMap.has(quizTitle)) {
        const existing = subMateriMap.get(quizTitle)!;
        subMateriMap.set(quizTitle, {
          quizTitle,
          read: existing.read || isRead,
        });
      } else {
        subMateriMap.set(quizTitle, {
          quizTitle,
          read: isRead,
        });
      }
    });

    return Array.from(subMateriMap.values());
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-lg border-2 border-slate-200 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg">
            <Search className="w-4 h-4 text-white" />
          </div>
          <input
            type="text"
            placeholder="Cari modul..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[#578FCA] focus:border-[#578FCA] transition-all"
          />
          {localSearchQuery && (
            <button
              onClick={() => setLocalSearchQuery("")}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Module List */}
      {filteredModules.map((module) => {
        const isExpanded = expandedModule === module.module_id;
        const subMateris = getSubMateriReadingStatus(module);
        const readCount = subMateris.filter(sm => sm.read).length;
        const totalCount = subMateris.length;
        const readPercentage = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;
        
        return (
          <div
            key={module.module_id}
            className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module.module_id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                    {module.module_title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                    {totalCount > 0 ? (
                      <>
                        <span className="font-medium">
                          {readCount}/{totalCount} sub-materi dibaca
                        </span>
                        <span className={`font-semibold ${
                          readPercentage >= 80 ? "text-green-600" :
                          readPercentage >= 50 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {readPercentage}% selesai
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-slate-500 italic">
                        Belum ada data bacaan
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                  {isExpanded ? "Tutup" : "Lihat Detail"}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </button>

            {/* Sub-Materi List */}
            {isExpanded && (
              <div className="border-t-2 border-slate-200 bg-slate-50/30 p-3">
                {subMateris.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">Belum Ada Data Bacaan</p>
                    <p className="text-xs italic mt-1">Kader belum membaca materi di modul ini</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h5 className="text-xs md:text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#578FCA]" />
                      Daftar Sub-Materi & Status Bacaan
                    </h5>
                    {subMateris.map((subMateri, idx) => (
                      <div
                        key={idx}
                        className={`bg-white rounded-lg p-3 border-l-4 ${
                          subMateri.read 
                            ? "border-green-500 bg-green-50/30" 
                            : "border-red-500 bg-red-50/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className="font-semibold text-slate-800 text-sm truncate">
                                {subMateri.quizTitle}
                              </h6>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {subMateri.read ? "Sudah dibaca oleh kader" : "Belum dibaca"}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {subMateri.read ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                  Sudah Baca
                                </span>
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                                  Belum Baca
                                </span>
                                <XCircle className="w-6 h-6 text-red-600" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress Summary */}
                {subMateris.length > 0 && (
                  <div className="mt-4 bg-white rounded-lg border-2 border-slate-200 p-4">
                    <h5 className="text-xs md:text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#578FCA]" />
                      Ringkasan Progress Bacaan
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Total Sub-Materi:</span>
                        <span className="font-bold text-slate-800">{totalCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Sudah Dibaca:</span>
                        <span className="font-bold text-green-600">{readCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Belum Dibaca:</span>
                        <span className="font-bold text-red-600">{totalCount - readCount}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                          <span>Progress Bacaan</span>
                          <span className="font-semibold">{readPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              readPercentage >= 80 ? "bg-gradient-to-r from-green-500 to-green-600" :
                              readPercentage >= 50 ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
                              "bg-gradient-to-r from-red-500 to-red-600"
                            }`}
                            style={{ width: `${readPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* No Results */}
      {filteredModules.length === 0 && localSearchQuery && (
        <div className="text-center py-12 text-slate-500">
          <Search className="w-16 h-16 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium">Tidak ada modul ditemukan</p>
          <p className="text-xs italic mt-1">Coba kata kunci lain</p>
        </div>
      )}

      {modules.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-3 text-slate-300" />
          <p className="text-sm italic">Belum ada progress bacaan</p>
        </div>
      )}
    </div>
  );
}
