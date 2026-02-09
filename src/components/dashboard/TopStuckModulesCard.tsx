"use client";

import { Target, ArrowRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModuleCompletionStats } from "@/hooks/useProgressMonitoring";

export default function TopStuckModulesCard() {
  const router = useRouter();
  const { data: moduleStats = [], isLoading } = useModuleCompletionStats();

  // Get top 3 stuck modules
  const topStuckModules = [...moduleStats]
    .sort((a, b) => b.total_stuck - a.total_stuck)
    .slice(0, 3)
    .filter(m => m.total_stuck > 0);

  const handleViewProgress = () => {
    router.push("/admin/progress");
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-red-200 animate-pulse">
        <div className="h-6 bg-red-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-red-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800">Modul Tersulit</h3>
          <p className="text-xs text-slate-600">Top 3 modul dengan stuck tertinggi</p>
        </div>
      </div>

      {topStuckModules.length > 0 ? (
        <div className="space-y-3 mb-4">
          {topStuckModules.map((module, idx) => {
            const percentage = module.total_started > 0 
              ? (module.total_stuck / module.total_started) * 100 
              : 0;

            return (
              <div
                key={module.module_id}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-red-200 hover:border-red-300 transition-all"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                    idx === 0 ? 'bg-gradient-to-br from-red-600 to-red-500' :
                    idx === 1 ? 'bg-gradient-to-br from-orange-600 to-orange-500' :
                    'bg-gradient-to-br from-yellow-600 to-yellow-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                      {module.module_title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            percentage >= 50 ? 'bg-gradient-to-r from-red-600 to-red-500' :
                            percentage >= 25 ? 'bg-gradient-to-r from-orange-600 to-orange-500' :
                            'bg-gradient-to-r from-yellow-600 to-yellow-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-red-600 min-w-[50px] text-right">
                        {module.total_stuck} kader
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {percentage.toFixed(1)}% dari {module.total_started} kader
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-xs">Belum ada modul dengan kader stuck</p>
        </div>
      )}

      <button
        onClick={handleViewProgress}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg group"
      >
        <span>Lihat Semua Modul</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
