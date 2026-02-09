"use client";

import { Users, ArrowRight, AlertTriangle, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserProgressList } from "@/hooks/useProgressMonitoring";

export default function RecentStrugglingUsers() {
  const router = useRouter();
  const { data: userListData, isLoading } = useUserProgressList({
    status: "struggling",
    limit: 5,
  });

  const strugglingUsers = userListData?.items || [];

  const handleViewAll = () => {
    router.push("/admin/progress?filter=struggling");
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/progress?userId=${userId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Kader Bermasalah Terbaru</h3>
            <p className="text-xs text-slate-600">5 kader yang perlu perhatian</p>
          </div>
        </div>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#27548A] hover:text-[#578FCA] transition-colors flex items-center gap-1"
        >
          Lihat Semua
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {strugglingUsers.length > 0 ? (
        <div className="space-y-2">
          {strugglingUsers.map((user) => (
            <div
              key={user.user_id}
              onClick={() => handleViewUser(user.user_id)}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg border border-orange-200 hover:border-orange-300 transition-all cursor-pointer group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                {user.user_profil_url ? (
                  <Image
                    src={user.user_profil_url}
                    alt={user.user_name}
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.user_name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    {user.user_name}
                  </h4>
                  <span className="flex-shrink-0 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    Struggling
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-orange-600" />
                    {user.total_quiz_failed} gagal
                  </span>
                  <span>•</span>
                  <span>Pass rate: {user.pass_rate}%</span>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">Tidak ada kader bermasalah</p>
          <p className="text-xs text-slate-400 mt-1">Semua kader dalam kondisi baik</p>
        </div>
      )}

      {strugglingUsers.length > 0 && (
        <button
          onClick={handleViewAll}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg group"
        >
          <Users className="w-4 h-4" />
          <span>Lihat Semua Kader Bermasalah</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
