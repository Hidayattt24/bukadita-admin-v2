"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Activity,
  Award,
  BarChart3,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Search,
  Eye,
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
import { adminAPI } from "@/lib/api";
import dynamic from "next/dynamic";
import InfoModal from "./InfoModal";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { AnimatePresence, motion } from "framer-motion";

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
  const [stats, setStats] = useState({
    total_users: 0,
    active_users_today: 0,
    new_users_this_week: 0,
    total_modules: 0,
    total_materials: 0,
    total_quizzes: 0,
    completed_quizzes_total: 0,
    passed_quizzes_total: 0,
    average_completion_rate: 0,
    module_completion_stats: [] as Array<{
      module_id: string | number;
      module_title: string;
      total_users_started: number;
      total_users_completed: number;
      completion_rate: number;
    }>,
    recent_activities: [] as Array<{
      id: string | number;
      user: string;
      action: string;
      category: string;
      score?: number;
      passed?: boolean;
      time: string;
      relative_time: string;
    }>,
  });

  const [quizPerformance, setQuizPerformance] = useState<QuizPerformance | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedQuiz, setSelectedQuiz] = useState<QuizPerformance["modules"][0]["quizzes"][0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedModuleDetail, setSelectedModuleDetail] = useState<QuizPerformance["modules"][0] | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Load dashboard stats
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load basic stats
        const statsRes = await adminAPI.dashboardStats();
        if (statsRes.ok && statsRes.data) {
          setStats(statsRes.data as typeof stats);
        }

        // Load quiz performance detailed
        setLoadingPerformance(true);
        const perfRes = await adminAPI.quizPerformanceDetailed();
        if (perfRes.ok && perfRes.data) {
          setQuizPerformance(perfRes.data as QuizPerformance);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
        setLoadingPerformance(false);
      }
    };

    loadData();
  }, []);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-2xl shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[#27548A]">Dasbor Analitik</h1>
          <p className="text-slate-600 text-sm mt-1">
            Pemantauan sistem edukasi Posyandu secara real-time
          </p>
        </div>
      </div>

      {/* Main Stats Cards - Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{
                boxShadow:
                  "6px 6px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                    Pengguna
                  </span>
                </div>
                <div className="text-4xl font-semibold text-[#27548A] mb-1">
                  {stats.total_users}
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-3">
                  Total Pengguna
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center text-xs text-slate-600">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    <span className="font-medium">+{stats.new_users_this_week} minggu ini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Modules */}
            <div
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{
                boxShadow:
                  "6px 6px 0px rgba(89, 172, 119, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#59AC77]/10 to-[#3d8a59]/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#59AC77] to-[#3d8a59] rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    Pembelajaran
                  </span>
                </div>
                <div className="text-4xl font-semibold text-[#59AC77] mb-1">
                  {stats.total_modules}
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-3">
                  Modul Edukasi
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center text-xs text-slate-600">
                    <FileText className="w-3 h-3 mr-1 text-[#59AC77]" />
                    <span className="font-medium">{stats.total_materials} materi total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Quizzes */}
            <div
              onClick={() => setShowQuizModal(true)}
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-xl"
              style={{
                boxShadow:
                  "6px 6px 0px rgba(168, 85, 247, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-700/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                    Penilaian
                  </span>
                </div>
                <div className="text-4xl font-semibold text-purple-600 mb-1">
                  {stats.total_quizzes}
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-3">
                  Kuis Tersedia
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
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
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Grafik Analytics</h2>
              <p className="text-sm text-slate-600">Visualisasi data performa sistem</p>
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

      {/* Quiz Performance Section - Modular View */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Performa Kuis per Modul</h2>
              <p className="text-sm text-slate-600">Visualisasi performa kuis dan detail per modul</p>
            </div>
          </div>
        </div>

        {loadingPerformance ? (
          <div className="space-y-6">
            {/* Chart skeleton */}
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-6 border-2 border-white shadow-md animate-pulse">
              <div className="h-64 bg-white/30 rounded"></div>
            </div>
            {/* Cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            {/* Visual Chart - Pass Rate per Module */}
            <div className="bg-gradient-to-br from-[#27548A]/5 to-[#578FCA]/5 rounded-2xl p-6 border-2 border-[#27548A]/20">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[#27548A]" />
                <h3 className="text-lg font-semibold text-slate-800">Grafik Tingkat Kelulusan per Modul</h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={quizPerformance.modules.map((module) => ({
                    name: module.module_title.length > 15
                      ? module.module_title.substring(0, 15) + "..."
                      : module.module_title,
                    fullName: module.module_title,
                    passRate: module.summary.average_pass_rate,
                    passed: module.summary.total_passed,
                    failed: module.summary.total_failed,
                    total: module.summary.total_attempts,
                  }))}
                  margin={{ top: 20, right: 30, left: 80, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    width={70}
                    label={{
                      value: "Tingkat Kelulusan (%)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 0,
                      style: { fill: "#27548A", fontWeight: 700, fontSize: 14, textAnchor: "middle" }
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white/95 backdrop-blur-sm border-2 border-[#27548A]/30 rounded-xl shadow-2xl p-4">
                            <p className="font-semibold text-slate-900 mb-2 text-sm">{data.fullName}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Tingkat Kelulusan:</span>
                                <span className="font-semibold text-[#27548A]">{data.passRate}%</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Lulus:</span>
                                <span className="font-semibold text-green-600">{data.passed}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Gagal:</span>
                                <span className="font-semibold text-red-600">{data.failed}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-slate-600">Total Percobaan:</span>
                                <span className="font-semibold text-slate-900">{data.total}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="passRate" radius={[8, 8, 0, 0]}>
                    {quizPerformance.modules.map((module, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          module.summary.average_pass_rate >= 80
                            ? "#10b981" // Green
                            : module.summary.average_pass_rate >= 60
                            ? "#f59e0b" // Amber
                            : "#ef4444" // Red
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-slate-700">&gt;=80% (Excellent)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-semibold text-slate-700">60-79% (Good)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-xs font-semibold text-slate-700">&lt;60% (Needs Improvement)</span>
                </div>
              </div>
            </div>

            {/* Module Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Detail per Modul</h3>
                <div className="text-sm text-slate-600">
                  {quizPerformance.modules.length} modul tersedia
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-lg">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-800">Cari Modul</h4>
                      <p className="text-xs text-slate-600">Temukan modul berdasarkan nama</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizPerformance.modules
                  .filter((module) =>
                    module.module_title.toLowerCase().includes(moduleSearchQuery.toLowerCase())
                  )
                  .map((module) => (
                    <div
                      key={module.module_id}
                      className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl p-5 border-2 border-slate-200 hover:border-[#27548A]/40 transition-all duration-300 hover:shadow-lg group"
                    >
                      {/* Module Header */}
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 min-h-[3rem]">
                          {module.module_title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <FileText className="w-4 h-4" />
                          <span>{module.total_quizzes} kuis</span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {module.summary.total_passed}
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium">Lulus</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-semibold text-red-600">
                            {module.summary.total_failed}
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium">Gagal</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg p-2 text-center">
                          <div className="text-lg font-semibold text-[#27548A]">
                            {module.summary.average_pass_rate}%
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium">Tingkat</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{module.summary.total_attempts} percobaan</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#27548A] to-[#578FCA] h-2 rounded-full transition-all"
                            style={{ width: `${module.summary.average_pass_rate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* View Detail Button */}
                      <button
                        onClick={() => setSelectedModuleDetail(module)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all group-hover:scale-[1.02]"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Detail
                      </button>
                    </div>
                  ))}
              </div>

              {/* No Results */}
              {quizPerformance.modules.filter((module) =>
                module.module_title.toLowerCase().includes(moduleSearchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Tidak ada modul yang ditemukan</p>
                  <p className="text-sm text-slate-400 mt-1">Coba kata kunci lain</p>
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

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedQuiz(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800">
                  {selectedQuiz.quiz_title}
                </h3>
                <p className="text-sm text-slate-600">
                  Detail hasil dan pengguna
                </p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {selectedQuiz.total_attempts}
                </div>
                <div className="text-xs text-slate-600">Total Percobaan</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {selectedQuiz.passed_count}
                </div>
                <div className="text-xs text-slate-600">Lulus</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-semibold text-red-600">
                  {selectedQuiz.failed_count}
                </div>
                <div className="text-xs text-slate-600">Gagal</div>
              </div>
              <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-xl p-4 text-center border border-[#27548A]/20">
                <div className="text-2xl font-semibold text-[#27548A]">
                  {selectedQuiz.pass_rate}%
                </div>
                <div className="text-xs text-slate-600">Tingkat Kelulusan</div>
              </div>
            </div>

            {/* User Results with All Attempts */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">
                Hasil Pengguna ({selectedQuiz.unique_users})
              </h4>
              <div className="space-y-4 max-h-[500px] overflow-y-auto modern-scrollbar pr-2">
                {selectedQuiz.user_results.map((result, idx: number) => {
                  // Generate user avatar with profile photo or fallback
                  const userAvatarElement = result.user_profil_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.user_profil_url}
                        alt={result.user_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to avatar if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center text-white font-semibold text-lg"
                        style={{ display: "none" }}
                      >
                        {result.user_name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {result.user_name.charAt(0).toUpperCase()}
                    </div>
                  );

                  return (
                    <div
                      key={`${result.user_id}-${idx}`}
                      className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 hover:border-[#27548A]/40 transition-colors"
                    >
                      {/* User Header */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          {userAvatarElement}
                          <div>
                            <div className="font-semibold text-slate-800 text-lg">
                              {result.user_name}
                            </div>
                            <div className="text-sm text-slate-600">
                              {result.total_attempts} percobaan total
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-600 mb-1">Skor Terbaik</div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-[#27548A]">
                              {result.best_score}
                            </span>
                            {result.passed ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>

                    {/* All Attempts Table */}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-slate-700 mb-2">
                        Riwayat Percobaan:
                      </div>
                      {result.attempts && result.attempts.length > 0 ? (
                        <div className="space-y-2">
                          {result.attempts.map((attempt, attemptIdx: number) => {
                            const attemptDate = new Date(attempt.completed_at);
                            const formattedDate = attemptDate.toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            });
                            const formattedTime = attemptDate.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });

                            return (
                              <div
                                key={`attempt-${attempt.attempt_id || attemptIdx}`}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#27548A]/20 to-[#578FCA]/20 text-[#27548A] font-semibold text-sm border border-[#27548A]/30">
                                    #{attemptIdx + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-slate-800">
                                        Skor: {attempt.score}
                                      </span>
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                          attempt.passed
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {attempt.passed ? "LULUS" : "GAGAL"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600">
                                      <span>
                                        {attempt.correct_answers}/{attempt.total_questions} benar
                                      </span>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formattedDate} {formattedTime}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {attempt.score === result.best_score && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                      Terbaik
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-500 text-sm">
                          Tidak ada riwayat percobaan
                        </div>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Detail Modal */}
      <AnimatePresence mode="wait">
        {selectedModuleDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedModuleDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#27548A] to-[#578FCA] p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {selectedModuleDetail.module_title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{selectedModuleDetail.total_quizzes} kuis</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedModuleDetail.summary.total_attempts} percobaan</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModuleDetail(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] modern-scrollbar">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200"
                  >
                    <div className="text-3xl font-semibold text-green-600">
                      {selectedModuleDetail.summary.total_passed}
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Total Lulus</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200"
                  >
                    <div className="text-3xl font-semibold text-red-600">
                      {selectedModuleDetail.summary.total_failed}
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Total Gagal</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-xl p-4 text-center border-2 border-[#27548A]/20"
                  >
                    <div className="text-3xl font-semibold text-[#27548A]">
                      {selectedModuleDetail.summary.average_pass_rate}%
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Tingkat Kelulusan</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200"
                  >
                    <div className="text-3xl font-semibold text-blue-600">
                      {selectedModuleDetail.summary.total_attempts}
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Total Percobaan</div>
                  </motion.div>
                </div>

                {/* Quiz List */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#27548A]" />
                    Daftar Kuis ({selectedModuleDetail.total_quizzes})
                  </h4>
                  <div className="space-y-3">
                    {selectedModuleDetail.quizzes.map((quiz, idx) => (
                      <motion.div
                        key={quiz.quiz_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 hover:border-[#27548A]/40 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Quiz Number */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#27548A] to-[#578FCA] text-white font-semibold flex-shrink-0">
                            {idx + 1}
                          </div>

                          {/* Quiz Info */}
                          <div className="flex-1">
                            <h5 className="font-semibold text-slate-800 mb-2">{quiz.quiz_title}</h5>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{quiz.unique_users} pengguna</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="w-4 h-4" />
                                <span>{quiz.total_attempts} percobaan</span>
                              </div>
                            </div>

                            {/* Quiz Stats */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-white rounded-lg p-3 text-center border border-green-200">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-xl font-semibold text-green-600">
                                    {quiz.passed_count}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600">Lulus</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 text-center border border-red-200">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <span className="text-xl font-semibold text-red-600">
                                    {quiz.failed_count}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600">Gagal</div>
                              </div>
                              <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg p-3 text-center border border-[#27548A]/20">
                                <div className="text-xl font-semibold text-[#27548A] mb-1">
                                  {quiz.pass_rate}%
                                </div>
                                <div className="text-xs text-slate-600">Tingkat</div>
                              </div>
                            </div>

                            {/* View User Results Button */}
                            <button
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setSelectedModuleDetail(null);
                              }}
                              className="mt-3 w-full flex items-center justify-center gap-2 bg-white border-2 border-[#27548A] text-[#27548A] py-2 rounded-lg font-semibold hover:bg-[#27548A] hover:text-white transition-all"
                            >
                              <Eye className="w-4 h-4" />
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

