"use client";

import { useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import dynamic from "next/dynamic";
import InfoModal from "../shared/InfoModal";
import { useDashboardStats } from "@/hooks/useDashboard";
import StrugglingUsersCard from "./StrugglingUsersCard";
import TopStuckModulesCard from "./TopStuckModulesCard";
import RecentStrugglingUsers from "./RecentStrugglingUsers";

// Dynamic import untuk charts (client-side only)
const DashboardCharts = dynamic(() => import("./DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="animate-pulse space-y-3 md:space-y-4">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-48 md:h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] md:shadow-[6px_6px_0px_rgba(0,0,0,0.1)] animate-pulse">
    <div className="flex items-center justify-between mb-2 md:mb-4">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-white/30 rounded-lg md:rounded-xl"></div>
      <div className="h-4 md:h-6 w-16 md:w-20 bg-white/30 rounded-full"></div>
    </div>
    <div className="h-8 md:h-10 w-20 md:w-24 bg-white/30 rounded mb-1 md:mb-2"></div>
    <div className="h-3 md:h-4 w-24 md:w-32 bg-white/30 rounded"></div>
  </div>
);

interface QuizPerformance {
  modules: Array<{
    module_id: string;
    module_title: string;
    total_quizzes: number;
    summary: {
      total_attempts: number;
      total_passed: number;
      total_failed: number;
      average_pass_rate: number;
    };
    quizzes: Array<{
      quiz_id: string;
      quiz_title: string;
      total_attempts: number;
      passed_count: number;
      failed_count: number;
      pass_rate: number;
      unique_users: number;
      user_results: Array<{
        user_id: string;
        user_name: string;
        user_profil_url?: string;
        best_score: number;
        passed: boolean;
        total_attempts: number;
        attempts: Array<{
          attempt_id: string;
          score: number;
          passed: boolean;
          total_questions: number;
          correct_answers: number;
          completed_at: string;
        }>;
      }>;
    }>;
  }>;
}

export default function AdminDashboardPageNew() {
  // React Query hooks
  const {
    data: statsData,
    isLoading: loadingStats,
    error: statsError,
  } = useDashboardStats();

  // Local state
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Transform data with proper typing
  const stats = (statsData as {
    total_users: number;
    active_users_today: number;
    new_users_this_week: number;
    total_modules: number;
    total_materials: number;
    total_quizzes: number;
    completed_quizzes_total: number;
    passed_quizzes_total: number;
    average_completion_rate: number;
    module_completion_stats: Array<{
      module_id: string | number;
      module_title: string;
      total_users_started: number;
      total_users_completed: number;
      completion_rate: number;
    }>;
    recent_activities: Array<{
      id: string | number;
      user: string;
      action: string;
      category: string;
      score?: number;
      passed?: boolean;
      time: string;
      relative_time: string;
    }>;
  }) || {
    total_users: 0,
    active_users_today: 0,
    new_users_this_week: 0,
    total_modules: 0,
    total_materials: 0,
    total_quizzes: 0,
    completed_quizzes_total: 0,
    passed_quizzes_total: 0,
    average_completion_rate: 0,
    module_completion_stats: [],
    recent_activities: [],
  };

  // Debug log
  console.log("[Dashboard] Stats Data:", {
    total_users: stats.total_users,
    total_modules: stats.total_modules,
    total_quizzes: stats.total_quizzes,
    raw_data: statsData,
  });

  const loading = loadingStats;
  const error = statsError
    ? statsError instanceof Error
      ? statsError.message
      : "Gagal memuat data dashboard"
    : null;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8 pb-4 md:pb-6 w-full">
      {/* Header - Responsive */}
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <div className="p-2 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg md:rounded-2xl shadow-lg">
          <BarChart3 className="w-5 h-5 md:w-8 md:h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-3xl font-bold md:font-semibold text-[#27548A]">
            Dasbor Analitik
          </h1>
          <p className="text-slate-600 text-[10px] md:text-sm truncate">
            Pemantauan sistem edukasi Posyandu secara real-time
          </p>
        </div>
      </div>

      {/* Main Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Total Users */}
            <div
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full"
              style={{
                boxShadow:
                  "3px 3px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg md:rounded-xl">
                    <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-blue-100 text-blue-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Pengguna
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-[#27548A] mb-0.5 md:mb-1">
                  {stats.total_users}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Total Pengguna
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center text-[9px] md:text-xs text-slate-600">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600 flex-shrink-0" />
                    <span className="font-medium">
                      +{stats.new_users_this_week} minggu ini
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Modules */}
            <div
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{
                boxShadow:
                  "3px 3px 0px rgba(89, 172, 119, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#59AC77]/10 to-[#3d8a59]/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-[#59AC77] to-[#3d8a59] rounded-lg md:rounded-xl">
                    <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Pembelajaran
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-[#59AC77] mb-0.5 md:mb-1">
                  {stats.total_modules}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Modul Edukasi
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center text-[9px] md:text-xs text-slate-600">
                    <FileText className="w-3 h-3 mr-1 text-[#59AC77] flex-shrink-0" />
                    <span className="font-medium">
                      {stats.total_materials} materi total
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Quizzes */}
            <div
              onClick={() => setShowQuizModal(true)}
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-xl"
              style={{
                boxShadow:
                  "3px 3px 0px rgba(59, 130, 246, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg md:rounded-xl">
                    <FileText className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-blue-100 text-blue-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Penilaian
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-[#578FCA] mb-0.5 md:mb-1">
                  {stats.total_quizzes}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Kuis Tersedia
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-[9px] md:text-xs">
                    <div className="flex items-center text-slate-600">
                      <Award className="w-3 h-3 mr-1 text-[#578FCA]" />
                      <span className="font-medium">
                        {stats.completed_quizzes_total} diselesaikan
                      </span>
                    </div>
                    <span className="text-[#27548A] font-semibold hover:underline">
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      {!loading && (
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border border-gray-200 w-full">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg md:rounded-xl">
              <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-semibold text-slate-800">
                Grafik Analytics
              </h2>
              <p className="text-xs md:text-sm text-slate-600 truncate">
                Visualisasi data performa sistem
              </p>
            </div>
          </div>
          <DashboardCharts
            recentActivities={stats.recent_activities}
            stats={{
              total_users: stats.total_users,
              active_users_today: stats.active_users_today,
              new_users_this_week: stats.new_users_this_week,
            }}
          />
        </div>
      )}

      {/* Kader Perlu Tindakan Section */}
      <div className="w-full space-y-4 md:space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-orange-200 shadow-md">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl md:rounded-2xl shadow-lg">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                Kader Perlu Tindakan
              </h1>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5 md:mt-1 line-clamp-2 md:line-clamp-none">
                Monitoring dan pendampingan kader yang memerlukan perhatian
                khusus
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Cards - Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
          {/* Kader Bermasalah Card */}
          <StrugglingUsersCard />

          {/* Top Stuck Modules Card */}
          <TopStuckModulesCard />
        </div>

        {/* Recent Struggling Users List */}
        <RecentStrugglingUsers />
      </div>

      {/* Quiz Info Modal */}
      <InfoModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        title="Detail Kuis per Modul"
      >
        <div className="space-y-4 md:space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-[#27548A]/20">
              <div className="text-[10px] md:text-xs text-[#27548A] font-semibold mb-1">
                Total Kuis
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-[#27548A]">
                {stats.total_quizzes}
              </div>
              <div className="text-[10px] md:text-xs text-slate-600 mt-1">
                Kuis tersedia di sistem
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-200">
              <div className="text-[10px] md:text-xs text-blue-700 font-semibold mb-1">
                Kuis Diselesaikan
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-blue-600">
                {stats.completed_quizzes_total}
              </div>
              <div className="text-[10px] md:text-xs text-blue-600 mt-1">
                Total percobaan penyelesaian
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-[#27548A]/5 to-[#578FCA]/5 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-[#27548A]/20">
            <h5 className="text-sm md:text-base font-semibold text-[#27548A] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              Informasi
            </h5>
            <p className="text-xs md:text-sm text-slate-700">
              Sistem memiliki total <strong>{stats.total_quizzes}</strong> kuis
              yang tersebar di <strong>{stats.total_modules}</strong> modul
              pembelajaran. Untuk melihat detail performa kuis per modul,
              silakan kunjungi halaman <strong>Progress</strong>.
            </p>
          </div>
        </div>
      </InfoModal>
    </div>
  );
}
