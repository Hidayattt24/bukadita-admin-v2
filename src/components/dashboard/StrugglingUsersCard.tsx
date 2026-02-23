"use client";

import { AlertTriangle, ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProgressMonitoringStats } from "@/hooks/useProgressMonitoring";

export default function StrugglingUsersCard() {
  const router = useRouter();
  const { data: stats, isLoading } = useProgressMonitoringStats();

  const strugglingUsers = stats?.struggling_users || 0;
  const totalUsers = stats?.total_users || 0;
  const percentage =
    totalUsers > 0 ? ((strugglingUsers / totalUsers) * 100).toFixed(1) : 0;

  const handleViewDetails = () => {
    router.push("/admin/progress?filter=struggling");
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-orange-200 animate-pulse">
        <div className="h-6 bg-orange-200 rounded w-3/4 mb-3"></div>
        <div className="h-10 bg-orange-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-orange-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Kader Bermasalah
            </h3>
            <p className="text-xs text-slate-600">Perlu perhatian khusus</p>
          </div>
        </div>
        {strugglingUsers > 0 && (
          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse shadow-md">
            Alert!
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl md:text-5xl font-bold text-orange-600">
            {strugglingUsers}
          </span>
          <span className="text-sm text-slate-600">
            dari {totalUsers} kader
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="flex-1 bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(Number(percentage), 100)}%` }}
            />
          </div>
          <span className="font-bold text-orange-600 min-w-[50px] text-sm">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/60 rounded-lg p-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span>Gagal 5+ kali di modul yang sama</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/60 rounded-lg p-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Membutuhkan pendampingan intensif</span>
        </div>
      </div>

      <button
        onClick={handleViewDetails}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all hover:shadow-lg group"
      >
        <Users className="w-4 h-4" />
        <span>Lihat Detail Kader</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
