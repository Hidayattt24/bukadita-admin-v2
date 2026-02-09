"use client";

import { useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  BarChart3,
  Search,
  Eye,
  XCircle,
  CheckCircle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dynamic from "next/dynamic";
import InfoModal from "../shared/InfoModal";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboardStats, useQuizPerformance } from "@/hooks/useDashboard";
import StrugglingUsersCard from "./StrugglingUsersCard";
import TopStuckModulesCard from "./TopStuckModulesCard";
import RecentStrugglingUsers from "./RecentStrugglingUsers";

// Dynamic import untuk charts (client-side only)
const DashboardCharts = dynamic(() => import("./DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-6 border-2 border-white shadow-[6px_6px_0px_rgba(0,0,0,0.1)] animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
      <div className="h-6 w-20 bg-white/30 rounded-full"></div>
    </div>
    <div className="h-10 w-24 bg-white/30 rounded mb-2"></div>
    <div className="h-4 w-32 bg-white/30 rounded"></div>
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
  const { data: statsData, isLoading: loadingStats, error: statsError } = useDashboardStats();
  const { data: quizPerformanceData, isLoading: loadingPerformance } = useQuizPerformance();

  // Local state
  const [selectedQuiz, setSelectedQuiz] = useState<QuizPerformance["modules"][0]["quizzes"][0] | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedModuleDetail, setSelectedModuleDetail] = useState<QuizPerformance["modules"][0] | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");

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
  console.log('[Dashboard] Stats Data:', {
    total_users: stats.total_users,
    total_modules: stats.total_modules,
    total_quizzes: stats.total_quizzes,
    raw_data: statsData,
  });

  const quizPerformance = quizPerformanceData as QuizPerformance | null;
  const loading = loadingStats;
  const error = statsError ? (statsError instanceof Error ? statsError.message : "Gagal memuat data dashboard") : null;



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
          <h1 className="text-lg md:text-3xl font-bold md:font-semibold text-[#27548A]">Dasbor Analitik</h1>
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
                    <span className="font-medium">+{stats.new_users_this_week} minggu ini</span>
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
                    <span className="font-medium">{stats.total_materials} materi total</span>
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
                  "3px 3px 0px rgba(168, 85, 247, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/10 to-purple-700/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg md:rounded-xl">
                    <FileText className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-purple-100 text-purple-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Penilaian
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-purple-600 mb-0.5 md:mb-1">
                  {stats.total_quizzes}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Kuis Tersedia
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-[9px] md:text-xs">
                    <div className="flex items-center text-slate-600">
                      <Award className="w-3 h-3 mr-1 text-purple-600" />
                      <span className="font-medium">{stats.completed_quizzes_total} diselesaikan</span>
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
              <h2 className="text-base md:text-xl font-semibold text-slate-800">Grafik Analytics</h2>
              <p className="text-xs md:text-sm text-slate-600 truncate">Visualisasi data performa sistem</p>
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

      {/* Quick Action Cards - Monitoring Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* Kader Bermasalah Card */}
        <StrugglingUsersCard />

        {/* Top Stuck Modules Card */}
        <TopStuckModulesCard />
      </div>

      {/* Recent Struggling Users */}
      <RecentStrugglingUsers />

      {/* Quiz Performance Section - Modular View */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border border-gray-200 w-full">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-1.5 md:p-2 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-lg md:rounded-xl">
            <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-semibold text-slate-800">Performa Kuis per Modul</h2>
            <p className="text-xs md:text-sm text-slate-600 truncate">Visualisasi performa kuis dan detail per modul</p>
          </div>
        </div>

        {loadingPerformance ? (
          <div className="space-y-6">
            {/* Chart skeleton */}
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-6 border-2 border-white shadow-md animate-pulse">
              <div className="h-64 bg-white/30 rounded"></div>
            </div>
            {/* Cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-6 border-2 border-white shadow-[6px_6px_0px_rgba(0,0,0,0.1)] animate-pulse">
                  <div className="h-6 bg-white/30 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-white/30 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : quizPerformance && quizPerformance.modules.length > 0 ? (
          <div className="space-y-6">
            {/* Visual Chart - Pass Rate per Module - MODERN DESIGN */}
            <div className="relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-slate-100 overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-2.5 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl shadow-lg">
                      <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-xl font-bold text-slate-800">
                        Grafik Tingkat Kelulusan per Modul
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 hidden md:block">
                        Visualisasi performa kelulusan kuis
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats Summary */}
                  <div className="hidden lg:flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl px-4 py-2 border border-slate-200">
                    <div className="text-center">
                      <div className="text-xs text-slate-600">Total Modul</div>
                      <div className="text-lg font-bold text-[#27548A]">{quizPerformance.modules.length}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-300"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-600">Rata-rata</div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(
                          quizPerformance.modules.reduce((sum, m) => sum + m.summary.average_pass_rate, 0) / 
                          quizPerformance.modules.length
                        )}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Container */}
                <div className="bg-gradient-to-br from-slate-50/50 to-white rounded-xl p-3 md:p-4 border border-slate-200">
                  {/* Mobile: Horizontal Scroll */}
                  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    <div className="min-w-[600px] lg:min-w-0">
                      <ResponsiveContainer width="100%" height={280} className="md:h-[420px]">
                        <BarChart
                          data={quizPerformance.modules.map((module) => ({
                            name: module.module_title.length > 20
                              ? module.module_title.substring(0, 20) + "..."
                              : module.module_title,
                            fullName: module.module_title,
                            passRate: module.summary.average_pass_rate,
                            passed: module.summary.total_passed,
                            failed: module.summary.total_failed,
                            total: module.summary.total_attempts,
                          }))}
                          margin={{ top: 20, right: 20, left: 20, bottom: 100 }}
                        >
                          <defs>
                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                            </linearGradient>
                            <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            </linearGradient>
                            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                            axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                            tickLine={{ stroke: "#cbd5e1" }}
                            angle={-45}
                            textAnchor="end"
                            height={90}
                            interval={0}
                          />
                          <YAxis
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                            axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                            tickLine={{ stroke: "#cbd5e1" }}
                            width={50}
                            label={{
                              value: "Tingkat Kelulusan (%)",
                              angle: -90,
                              position: "insideLeft",
                              offset: 10,
                              style: { 
                                fill: "#27548A", 
                                fontWeight: 700, 
                                fontSize: 13,
                                textAnchor: "middle" 
                              },
                            }}
                          />
                          <Tooltip
                            cursor={{ fill: 'rgba(87, 143, 202, 0.1)' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white/98 backdrop-blur-md border-2 border-[#27548A]/20 rounded-2xl shadow-2xl p-4 min-w-[200px]">
                                    <p className="font-bold text-slate-900 mb-3 text-sm border-b border-slate-200 pb-2">
                                      {data.fullName}
                                    </p>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex items-center justify-between gap-6">
                                        <span className="text-slate-600 font-medium">Tingkat Kelulusan:</span>
                                        <span className="font-bold text-[#27548A] text-base">{data.passRate}%</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-6 bg-green-50 rounded-lg px-2 py-1">
                                        <span className="text-slate-600 font-medium">✓ Lulus:</span>
                                        <span className="font-bold text-green-600">{data.passed}</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-6 bg-red-50 rounded-lg px-2 py-1">
                                        <span className="text-slate-600 font-medium">✗ Gagal:</span>
                                        <span className="font-bold text-red-600">{data.failed}</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-200">
                                        <span className="text-slate-600 font-medium">Total Percobaan:</span>
                                        <span className="font-bold text-slate-900">{data.total}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="passRate" 
                            radius={[12, 12, 0, 0]}
                            maxBarSize={60}
                          >
                            {quizPerformance.modules.map((module, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  module.summary.average_pass_rate >= 80
                                    ? "url(#colorGreen)"
                                    : module.summary.average_pass_rate >= 60
                                    ? "url(#colorAmber)"
                                    : "url(#colorRed)"
                                }
                                stroke={
                                  module.summary.average_pass_rate >= 80
                                    ? "#10b981"
                                    : module.summary.average_pass_rate >= 60
                                    ? "#f59e0b"
                                    : "#ef4444"
                                }
                                strokeWidth={2}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Legend - Modern Style */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-4 md:mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 md:p-4 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-sm"></div>
                    <span className="text-xs md:text-sm font-semibold text-slate-700">
                      ≥80% <span className="hidden md:inline text-slate-500">(Excellent)</span>
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-300 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm"></div>
                    <span className="text-xs md:text-sm font-semibold text-slate-700">
                      60-79% <span className="hidden md:inline text-slate-500">(Good)</span>
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-300 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-sm"></div>
                    <span className="text-xs md:text-sm font-semibold text-slate-700">
                      &lt;60% <span className="hidden md:inline text-slate-500">(Needs Improvement)</span>
                    </span>
                  </div>
                </div>

                {/* Mobile Scroll Hint */}
                <div className="lg:hidden flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span>Geser untuk melihat semua modul</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Module Cards Grid */}
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-3 md:mb-4">
                <h3 className="text-sm md:text-lg font-semibold text-slate-800">Detail per Modul</h3>
                <div className="text-[10px] md:text-sm text-slate-600">
                  {quizPerformance.modules.length} modul tersedia
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4 md:mb-6">
                <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-slate-200 shadow-sm">
                  <div className="flex items-center gap-1.5 md:gap-3 mb-2 md:mb-4">
                    <div className="p-1.5 md:p-2 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-md md:rounded-lg">
                      <Search className="w-3 h-3 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs md:text-base font-semibold text-slate-800">Cari Modul</h4>
                      <p className="text-[9px] md:text-xs text-slate-600 hidden md:block">Temukan modul berdasarkan nama</p>
                    </div>
                  </div>
                  <PlaceholdersAndVanishInput
                    placeholders={[
                      "Cari modul pembelajaran...",
                      "Temukan modul berdasarkan nama...",
                      "Ketik nama modul yang ingin dicari...",
                      "Cari modul edukasi Posyandu...",
                    ]}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    onSubmit={(e) => e.preventDefault()}
                    value={moduleSearchQuery}
                  />
                </div>
              </div>

              {/* Module Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {quizPerformance.modules
                  .filter((module) =>
                    module.module_title.toLowerCase().includes(moduleSearchQuery.toLowerCase())
                  )
                  .map((module) => (
                    <div
                      key={module.module_id}
                      className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-xl p-3 md:p-5 border-2 border-slate-200 hover:border-[#27548A]/40 transition-all duration-300 hover:shadow-lg group"
                    >
                      {/* Module Header */}
                      <div className="mb-2 md:mb-4">
                        <h4 className="text-xs md:text-base font-semibold text-slate-800 mb-1 md:mb-2 line-clamp-2 min-h-[2rem] md:min-h-[3rem]">
                          {module.module_title}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-slate-600">
                          <FileText className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{module.total_quizzes} kuis</span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-2 md:mb-4">
                        <div className="bg-green-50 rounded-md md:rounded-lg p-1.5 md:p-2 text-center">
                          <div className="text-sm md:text-lg font-semibold text-green-600">
                            {module.summary.total_passed}
                          </div>
                          <div className="text-[8px] md:text-[10px] text-slate-600 font-medium">Lulus</div>
                        </div>
                        <div className="bg-red-50 rounded-md md:rounded-lg p-1.5 md:p-2 text-center">
                          <div className="text-sm md:text-lg font-semibold text-red-600">
                            {module.summary.total_failed}
                          </div>
                          <div className="text-[8px] md:text-[10px] text-slate-600 font-medium">Gagal</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2 md:mb-4">
                        <div className="flex items-center justify-between text-[9px] md:text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{module.summary.total_attempts} percobaan</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                          <div
                            className="bg-gradient-to-r from-[#27548A] to-[#578FCA] h-1.5 md:h-2 rounded-full transition-all"
                            style={{ width: `${module.summary.average_pass_rate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* View Detail Button */}
                      <button
                        onClick={() => setSelectedModuleDetail(module)}
                        className="w-full flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white py-1.5 md:py-2.5 rounded-md md:rounded-lg text-[10px] md:text-sm font-semibold hover:shadow-lg transition-all group-hover:scale-[1.02]"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        Lihat Detail
                      </button>
                    </div>
                  ))}
              </div>

              {/* No Results */}
              {quizPerformance.modules.filter((module) =>
                module.module_title.toLowerCase().includes(moduleSearchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-slate-500">Tidak ada modul yang ditemukan</p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Coba kata kunci lain</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            Belum ada data performa kuis
          </div>
        )}
      </div>

      {/* Module Detail Modal */}
      <AnimatePresence mode="wait">
        {selectedModuleDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4"
            onClick={() => setSelectedModuleDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#27548A] to-[#578FCA] p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-lg md:text-2xl font-semibold text-white mb-1 md:mb-2 line-clamp-2">
                      {selectedModuleDetail.module_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/90 text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{selectedModuleDetail.total_quizzes} kuis</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{selectedModuleDetail.summary.total_attempts} percobaan</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModuleDetail(null)}
                    className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <XCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(90vh-140px)]">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-green-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border-2 border-green-200"
                  >
                    <div className="text-2xl md:text-3xl font-semibold text-green-600">
                      {selectedModuleDetail.summary.total_passed}
                    </div>
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">Total Lulus</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-red-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border-2 border-red-200"
                  >
                    <div className="text-2xl md:text-3xl font-semibold text-red-600">
                      {selectedModuleDetail.summary.total_failed}
                    </div>
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">Total Gagal</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg md:rounded-xl p-3 md:p-4 text-center border-2 border-[#27548A]/20"
                  >
                    <div className="text-2xl md:text-3xl font-semibold text-[#27548A]">
                      {selectedModuleDetail.summary.average_pass_rate}%
                    </div>
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">Tingkat Kelulusan</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-blue-50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border-2 border-blue-200"
                  >
                    <div className="text-2xl md:text-3xl font-semibold text-blue-600">
                      {selectedModuleDetail.summary.total_attempts}
                    </div>
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">Total Percobaan</div>
                  </motion.div>
                </div>

                {/* Quiz List */}
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-[#27548A]" />
                    Daftar Kuis ({selectedModuleDetail.total_quizzes})
                  </h4>
                  <div className="space-y-2 md:space-y-3">
                    {selectedModuleDetail.quizzes.map((quiz, idx) => (
                      <motion.div
                        key={quiz.quiz_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="bg-slate-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-slate-200 hover:border-[#27548A]/40 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                          {/* Quiz Number */}
                          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#27548A] to-[#578FCA] text-white font-semibold flex-shrink-0 text-sm md:text-base">
                            {idx + 1}
                          </div>

                          {/* Quiz Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm md:text-base font-semibold text-slate-800 mb-2 line-clamp-2">{quiz.quiz_title}</h5>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 md:w-4 md:h-4" />
                                <span>{quiz.unique_users} pengguna</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="w-3 h-3 md:w-4 md:h-4" />
                                <span>{quiz.total_attempts} percobaan</span>
                              </div>
                            </div>

                            {/* Quiz Stats */}
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                              <div className="bg-white rounded-md md:rounded-lg p-2 md:p-3 text-center border border-green-200">
                                <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                                  <span className="text-base md:text-xl font-semibold text-green-600">
                                    {quiz.passed_count}
                                  </span>
                                </div>
                                <div className="text-[9px] md:text-xs text-slate-600">Lulus</div>
                              </div>
                              <div className="bg-white rounded-md md:rounded-lg p-2 md:p-3 text-center border border-red-200">
                                <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                                  <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                                  <span className="text-base md:text-xl font-semibold text-red-600">
                                    {quiz.failed_count}
                                  </span>
                                </div>
                                <div className="text-[9px] md:text-xs text-slate-600">Gagal</div>
                              </div>
                              <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-md md:rounded-lg p-2 md:p-3 text-center border border-[#27548A]/20">
                                <div className="text-base md:text-xl font-semibold text-[#27548A] mb-0.5 md:mb-1">
                                  {quiz.pass_rate}%
                                </div>
                                <div className="text-[9px] md:text-xs text-slate-600">Tingkat</div>
                              </div>
                            </div>

                            {/* View User Results Button */}
                            <button
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setSelectedModuleDetail(null);
                              }}
                              className="mt-3 w-full flex items-center justify-center gap-1.5 md:gap-2 bg-white border-2 border-[#27548A] text-[#27548A] py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#27548A] hover:text-white transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              Lihat Hasil Pengguna
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 md:p-4"
          onClick={() => setSelectedQuiz(null)}
        >
          <div
            className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-slate-800 truncate">
                  {selectedQuiz.quiz_title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">
                  Detail hasil dan pengguna
                </p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-1 sm:p-1.5 md:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              >
                <XCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-600" />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-600">
                  {selectedQuiz.total_attempts}
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">Total Percobaan</div>
              </div>
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600">
                  {selectedQuiz.passed_count}
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">Lulus</div>
              </div>
              <div className="bg-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-red-600">
                  {selectedQuiz.failed_count}
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">Gagal</div>
              </div>
              <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center border border-[#27548A]/20">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-[#27548A]">
                  {selectedQuiz.pass_rate}%
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">Tingkat Kelulusan</div>
              </div>
            </div>

            {/* User Results */}
            <div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 md:mb-4">
                Hasil Pengguna ({selectedQuiz.unique_users})
              </h4>
              <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-[400px] sm:max-h-[450px] md:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
                {selectedQuiz.user_results.map((result) => (
                  <div
                    key={result.user_id}
                    className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-slate-200 sm:border-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center text-white font-semibold text-xs sm:text-sm md:text-lg shadow-lg flex-shrink-0">
                          {result.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-800 text-sm sm:text-base md:text-lg truncate">
                            {result.user_name}
                          </div>
                          <div className="text-[10px] sm:text-xs md:text-sm text-slate-600">
                            {result.total_attempts} percobaan
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-xl md:text-2xl font-semibold text-[#27548A]">
                          {result.best_score}
                        </span>
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Info Modal */}
      <InfoModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        title="Detail Kuis per Modul"
      >
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-xl p-4 border-2 border-[#27548A]/20">
              <div className="text-xs text-[#27548A] font-semibold mb-1">Total Kuis</div>
              <div className="text-3xl font-semibold text-[#27548A]">{stats.total_quizzes}</div>
              <div className="text-xs text-slate-600 mt-1">Kuis tersedia di sistem</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-xs text-blue-700 font-semibold mb-1">Kuis Diselesaikan</div>
              <div className="text-3xl font-semibold text-blue-600">{stats.completed_quizzes_total}</div>
              <div className="text-xs text-blue-600 mt-1">Total percobaan penyelesaian</div>
            </div>
          </div>

          {/* Quiz per Module */}
          {quizPerformance && quizPerformance.modules.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Rincian Kuis per Modul</h4>
              <div className="space-y-3">
                {quizPerformance.modules.map((module) => (
                  <div
                    key={module.module_id}
                    className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 hover:border-[#27548A]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-800 mb-1">{module.module_title}</h5>
                        <p className="text-sm text-slate-600">
                          {module.total_quizzes} kuis tersedia
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-[#27548A]/20 to-[#578FCA]/20 text-[#27548A] px-3 py-1 rounded-full text-sm font-semibold border border-[#27548A]/30">
                        {module.total_quizzes} Kuis
                      </div>
                    </div>

                    {/* Quiz List */}
                    <div className="space-y-2 mt-3">
                      {module.quizzes.map((quiz, idx) => (
                        <div
                          key={quiz.quiz_id}
                          className="bg-white rounded-lg p-3 border border-slate-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#27548A]/20 to-[#578FCA]/20 text-[#27548A] font-semibold text-sm border border-[#27548A]/30">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-slate-800 text-sm">
                                  {quiz.quiz_title}
                                </div>
                                <div className="text-xs text-slate-600 mt-1">
                                  {quiz.unique_users} pengguna • {quiz.total_attempts} percobaan
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-xs text-slate-600">Lulus</div>
                                <div className="text-lg font-semibold text-green-600">
                                  {quiz.passed_count}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-slate-600">Gagal</div>
                                <div className="text-lg font-semibold text-red-600">
                                  {quiz.failed_count}
                                </div>
                              </div>
                              <div className="text-center bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg px-3 py-1 border border-[#27548A]/20">
                                <div className="text-xs text-slate-600">Tingkat</div>
                                <div className="text-lg font-semibold text-[#27548A]">
                                  {quiz.pass_rate}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Module Summary */}
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xs text-slate-600">Total Percobaan</div>
                          <div className="text-lg font-semibold text-slate-800">
                            {module.summary.total_attempts}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Total Lulus</div>
                          <div className="text-lg font-semibold text-green-600">
                            {module.summary.total_passed}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Tingkat Kelulusan</div>
                          <div className="text-lg font-semibold text-[#27548A]">
                            {module.summary.average_pass_rate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-gradient-to-br from-[#27548A]/5 to-[#578FCA]/5 rounded-xl p-4 border-2 border-[#27548A]/20">
            <h5 className="font-semibold text-[#27548A] mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informasi
            </h5>
            <p className="text-sm text-slate-700">
              Sistem memiliki total <strong>{stats.total_quizzes}</strong> kuis yang tersebar di{" "}
              <strong>{stats.total_modules}</strong> modul pembelajaran. Setiap modul memiliki kuis untuk
              menguji pemahaman pengguna terhadap materi yang telah dipelajari.
            </p>
          </div>
        </div>
      </InfoModal>
    </div>
  );
}

