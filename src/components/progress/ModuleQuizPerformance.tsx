"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Eye,
  XCircle,
  CheckCircle,
  Users,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { useQuizPerformance } from "@/hooks/useDashboard";

interface QuizPerformance {
  modules: Array<{
    module_id: string;
    module_title: string;
    total_quizzes: number;
    summary: {
      total_attempts: number;
      total_passed: number;
      total_failed: number;
      total_unique_users?: number;
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

export default function ModuleQuizPerformance() {
  const { data: quizPerformanceData, isLoading: loadingPerformance } =
    useQuizPerformance();
  const [selectedQuiz, setSelectedQuiz] = useState<
    QuizPerformance["modules"][0]["quizzes"][0] | null
  >(null);
  const [selectedModuleDetail, setSelectedModuleDetail] = useState<
    QuizPerformance["modules"][0] | null
  >(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");

  const quizPerformance = quizPerformanceData as QuizPerformance | null;

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border border-gray-200 w-full">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-1.5 md:p-2 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-lg md:rounded-xl">
          <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-xl font-semibold text-slate-800">
            Performa Kuis per Modul
          </h2>
          <p className="text-xs md:text-sm text-slate-600 truncate">
            Visualisasi performa kuis dan detail per modul
          </p>
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
              <div
                key={i}
                className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-6 border-2 border-white shadow-[6px_6px_0px_rgba(0,0,0,0.1)] animate-pulse"
              >
                <div className="h-6 bg-white/30 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-white/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : quizPerformance && quizPerformance.modules.length > 0 ? (
        <div className="space-y-6">
          {/* Visual Chart - Pass Rate per Module */}
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
                    <div className="text-lg font-bold text-[#27548A]">
                      {quizPerformance.modules.length}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600">Rata-rata</div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(
                        quizPerformance.modules.reduce(
                          (sum, m) => sum + m.summary.average_pass_rate,
                          0,
                        ) / quizPerformance.modules.length,
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="bg-gradient-to-br from-slate-50/50 to-white rounded-xl p-3 md:p-4 border border-slate-200">
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="min-w-[600px] lg:min-w-0">
                    <ResponsiveContainer
                      width="100%"
                      height={280}
                      className="md:h-[420px]"
                    >
                      <BarChart
                        data={quizPerformance.modules.map((module) => ({
                          name:
                            module.module_title.length > 20
                              ? module.module_title.substring(0, 20) + "..."
                              : module.module_title,
                          fullName: module.module_title,
                          passRate: module.summary.average_pass_rate,
                          passed: module.summary.total_passed,
                          failed: module.summary.total_failed,
                          totalUsers:
                            module.summary.total_unique_users ||
                            module.summary.total_passed +
                              module.summary.total_failed,
                          totalAttempts: module.summary.total_attempts,
                        }))}
                        margin={{ top: 20, right: 20, left: 20, bottom: 100 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: "#475569",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                          axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                          tickLine={{ stroke: "#cbd5e1" }}
                          angle={-45}
                          textAnchor="end"
                          height={90}
                          interval={0}
                        />
                        <YAxis
                          tick={{
                            fill: "#475569",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                          tickLine={{ stroke: "#cbd5e1" }}
                          width={50}
                          label={{
                            value: "Jumlah Pengguna",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            style: {
                              fill: "#27548A",
                              fontWeight: 700,
                              fontSize: 13,
                              textAnchor: "middle",
                            },
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(87, 143, 202, 0.1)" }}
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
                                      <span className="text-slate-600 font-medium">
                                        Tingkat Kelulusan:
                                      </span>
                                      <span className="font-bold text-[#27548A] text-base">
                                        {data.passRate}%
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 bg-green-50 rounded-lg px-2 py-1">
                                      <span className="text-slate-600 font-medium">
                                        ✓ Pengguna Lulus:
                                      </span>
                                      <span className="font-bold text-green-600">
                                        {data.passed} orang
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 bg-red-50 rounded-lg px-2 py-1">
                                      <span className="text-slate-600 font-medium">
                                        ✗ Pengguna Gagal:
                                      </span>
                                      <span className="font-bold text-red-600">
                                        {data.failed} orang
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-200">
                                      <span className="text-slate-600 font-medium">
                                        Total Pengguna:
                                      </span>
                                      <span className="font-bold text-slate-900">
                                        {data.totalUsers} orang
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 bg-blue-50 rounded-lg px-2 py-1">
                                      <span className="text-slate-600 font-medium">
                                        Total Percobaan:
                                      </span>
                                      <span className="font-bold text-blue-600">
                                        {data.totalAttempts}x
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="passed"
                          fill="#59AC77"
                          name="Lulus"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="failed"
                          fill="#ef4444"
                          name="Gagal"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-4 md:mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 md:p-4 border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-lg bg-[#59AC77] shadow-sm"></div>
                  <span className="text-xs md:text-sm font-semibold text-slate-700">
                    Lulus
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-lg bg-[#ef4444] shadow-sm"></div>
                  <span className="text-xs md:text-sm font-semibold text-slate-700">
                    Gagal
                  </span>
                </div>
              </div>

              {/* Mobile Scroll Hint */}
              <div className="lg:hidden flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <span>Geser untuk melihat semua modul</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Module Cards Grid */}
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-3 md:mb-4">
              <h3 className="text-sm md:text-lg font-semibold text-slate-800">
                Detail per Modul
              </h3>
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
                    <h4 className="text-xs md:text-base font-semibold text-slate-800">
                      Cari Modul
                    </h4>
                    <p className="text-[9px] md:text-xs text-slate-600 hidden md:block">
                      Temukan modul berdasarkan nama
                    </p>
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
                  module.module_title
                    .toLowerCase()
                    .includes(moduleSearchQuery.toLowerCase()),
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
                        <div className="text-[8px] md:text-[10px] text-slate-600 font-medium">
                          Lulus
                        </div>
                      </div>
                      <div className="bg-red-50 rounded-md md:rounded-lg p-1.5 md:p-2 text-center">
                        <div className="text-sm md:text-lg font-semibold text-red-600">
                          {module.summary.total_failed}
                        </div>
                        <div className="text-[8px] md:text-[10px] text-slate-600 font-medium">
                          Gagal
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2 md:mb-4">
                      <div className="flex items-center justify-between text-[9px] md:text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {module.summary.total_attempts} percobaan
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                        <div
                          className="bg-gradient-to-r from-[#27548A] to-[#578FCA] h-1.5 md:h-2 rounded-full transition-all"
                          style={{
                            width: `${module.summary.average_pass_rate}%`,
                          }}
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
              module.module_title
                .toLowerCase()
                .includes(moduleSearchQuery.toLowerCase()),
            ).length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-slate-500">
                  Tidak ada modul yang ditemukan
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Coba kata kunci lain
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          Belum ada data performa kuis
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
                        <span>
                          {selectedModuleDetail.summary.total_attempts}{" "}
                          percobaan
                        </span>
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
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                      Total Lulus
                    </div>
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
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                      Total Gagal
                    </div>
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
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                      Tingkat Kelulusan
                    </div>
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
                    <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                      Total Percobaan
                    </div>
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
                            <h5 className="text-sm md:text-base font-semibold text-slate-800 mb-2 line-clamp-2">
                              {quiz.quiz_title}
                            </h5>
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
                                <div className="text-[9px] md:text-xs text-slate-600">
                                  Lulus
                                </div>
                              </div>
                              <div className="bg-white rounded-md md:rounded-lg p-2 md:p-3 text-center border border-red-200">
                                <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                                  <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                                  <span className="text-base md:text-xl font-semibold text-red-600">
                                    {quiz.failed_count}
                                  </span>
                                </div>
                                <div className="text-[9px] md:text-xs text-slate-600">
                                  Gagal
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-md md:rounded-lg p-2 md:p-3 text-center border border-[#27548A]/20">
                                <div className="text-base md:text-xl font-semibold text-[#27548A] mb-0.5 md:mb-1">
                                  {quiz.pass_rate}%
                                </div>
                                <div className="text-[9px] md:text-xs text-slate-600">
                                  Tingkat
                                </div>
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
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">
                  Total Percobaan
                </div>
              </div>
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600">
                  {selectedQuiz.passed_count}
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">
                  Lulus
                </div>
              </div>
              <div className="bg-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-red-600">
                  {selectedQuiz.failed_count}
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">
                  Gagal
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center border border-[#27548A]/20">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-[#27548A]">
                  {selectedQuiz.pass_rate}%
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-600">
                  Tingkat Kelulusan
                </div>
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
    </div>
  );
}
