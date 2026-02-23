"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Search,
  BarChart3,
  Target,
  Info,
  TrendingUp,
  XCircle,
  Eye,
  PlayCircle,
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
import { AnimatePresence } from "framer-motion";
import UserListTable from "./UserListTable";
import UserListModal from "./UserListModal";
import InfoModal from "../shared/InfoModal";
import ReadingProgressModal from "./ReadingProgressModal";
import QuizHistoryModal from "./QuizHistoryModal";
import StuckUsersModal from "./StuckUsersModal";
import type { UserProgress, ModuleStats } from "./types";
import {
  useProgressMonitoringStats,
  useModuleCompletionStats,
  useUserProgressList,
} from "@/hooks/useProgressMonitoring";

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white shadow-[6px_6px_0px_rgba(0,0,0,0.1)] animate-pulse">
    <div className="flex items-center justify-between mb-2 md:mb-4">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-white/30 rounded-lg md:rounded-xl"></div>
      <div className="h-4 md:h-6 w-16 md:w-20 bg-white/30 rounded-full"></div>
    </div>
    <div className="h-8 md:h-10 w-20 md:w-24 bg-white/30 rounded mb-1 md:mb-2"></div>
    <div className="h-3 md:h-4 w-24 md:w-32 bg-white/30 rounded"></div>
  </div>
);

export default function UserProgressMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "struggling" | "inactive"
  >("all"); // Show all by default to see sorting
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);
  const [showReadingProgress, setShowReadingProgress] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [userListModalType, setUserListModalType] = useState<
    "active" | "struggling" | "inactive"
  >("active");
  const [showStuckInfoModal, setShowStuckInfoModal] = useState(false);
  const [showStuckUsersModal, setShowStuckUsersModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Fetch data from API using React Query
  const { data: statsData, isLoading: isLoadingStats } =
    useProgressMonitoringStats();
  const { data: moduleStatsData, isLoading: isLoadingModuleStats } =
    useModuleCompletionStats();
  const { data: userListData, isLoading: isLoadingUserList } =
    useUserProgressList({
      search: searchTerm,
      status: statusFilter,
      page: 1,
      limit: 100,
    });

  // Extract data from API responses
  const totalUsers = statsData?.total_users || 0;
  const activeUsers = statsData?.active_users || 0;
  const strugglingUsers = statsData?.struggling_users || 0;
  const inactiveUsers = statsData?.inactive_users || 0;

  const moduleStats: ModuleStats[] = moduleStatsData || [];
  const filteredUsers: UserProgress[] = (userListData?.items || []).map(
    (item) => ({
      ...item,
      modules_progress: [], // List endpoint doesn't include modules_progress
    }),
  );

  const isLoading = isLoadingStats || isLoadingModuleStats || isLoadingUserList;

  const handleViewReadingProgress = (user: UserProgress) => {
    setSelectedUser(user);
    setShowReadingProgress(true);
  };

  const handleViewQuizHistory = (user: UserProgress) => {
    setSelectedUser(user);
    setShowQuizHistory(true);
  };

  const handleViewStuckUsers = (moduleId: string, moduleTitle: string) => {
    setSelectedModule({ id: moduleId, title: moduleTitle });
    setShowStuckUsersModal(true);
  };

  const handleStatsCardClick = (type: "active" | "struggling" | "inactive") => {
    setUserListModalType(type);
    setShowUserListModal(true);
  };

  const getUsersByStatus = (status: "active" | "struggling" | "inactive") => {
    return filteredUsers.filter((u) => u.status === status);
  };

  const getModalTitle = () => {
    const titles = {
      active: "Kader Aktif",
      struggling: "Kader Perlu Perhatian",
      inactive: "Kader Belum Aktif",
    };
    return titles[userListModalType];
  };

  return (
    <div className="space-y-4 md:space-y-8 pb-4 md:pb-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <div className="p-2 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg md:rounded-2xl shadow-lg">
          <BarChart3 className="w-5 h-5 md:w-8 md:h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-3xl font-bold md:font-semibold text-[#27548A]">
            Monitoring Progress Belajar
          </h1>
          <p className="text-slate-600 text-[10px] md:text-sm truncate">
            Pantau progress belajar kader secara real-time
          </p>
        </div>
      </div>

      {/* Stats Overview - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 w-full">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Total Kader */}
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
                    Total
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-[#27548A] mb-0.5 md:mb-1">
                  {totalUsers}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Total Kader
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center text-[9px] md:text-xs text-slate-600">
                    <Users className="w-3 h-3 mr-1 text-[#578FCA] flex-shrink-0" />
                    <span className="font-medium">Terdaftar aktif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kader Aktif */}
            <div
              onClick={() => handleStatsCardClick("active")}
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full"
              style={{
                boxShadow:
                  "3px 3px 0px rgba(89, 172, 119, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#59AC77]/10 to-[#3d8a59]/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-[#59AC77] to-[#3d8a59] rounded-lg md:rounded-xl">
                    <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Klik Detail
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-[#59AC77] mb-0.5 md:mb-1">
                  {activeUsers}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Kader Aktif
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center text-[9px] md:text-xs text-slate-600">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600 flex-shrink-0" />
                    <span className="font-medium">Nilai 85%+ semua modul</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perlu Perhatian */}
            <div
              onClick={() => handleStatsCardClick("struggling")}
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full"
              style={{
                boxShadow:
                  "3px 3px 0px rgba(234, 179, 8, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg md:rounded-xl">
                    <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-yellow-100 text-yellow-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Klik Detail
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-yellow-600 mb-0.5 md:mb-1">
                  {strugglingUsers}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Perlu Perhatian
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center text-[9px] md:text-xs text-slate-600">
                    <AlertTriangle className="w-3 h-3 mr-1 text-yellow-600 flex-shrink-0" />
                    <span className="font-medium">Gagal 5+ kali/modul</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Belum Aktif */}
            <div
              onClick={() => handleStatsCardClick("inactive")}
              className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full"
              style={{
                boxShadow:
                  "3px 3px 0px rgba(239, 68, 68, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-xl opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg md:rounded-xl">
                    <XCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[9px] md:text-xs bg-red-100 text-red-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
                    Klik Detail
                  </span>
                </div>
                <div className="text-2xl md:text-4xl font-bold md:font-semibold text-red-600 mb-0.5 md:mb-1">
                  {inactiveUsers}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
                  Belum Aktif
                </div>
                <div className="pt-2 md:pt-3 border-t border-slate-200">
                  <div className="flex items-center text-[9px] md:text-xs text-slate-600">
                    <XCircle className="w-3 h-3 mr-1 text-red-600 flex-shrink-0" />
                    <span className="font-medium">Belum ada progress</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Module Completion Chart - Modern Design */}
      <div className="space-y-3 md:space-y-6 w-full">
        {/* Chart Section */}
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
                    Tingkat Penyelesaian Modul
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 hidden md:block">
                    Perbandingan selesai vs stuck per modul
                  </p>
                </div>
                {/* Info Button */}
                <button
                  onClick={() => setShowStuckInfoModal(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors group ml-1"
                  title="Info perhitungan stuck"
                >
                  <Info className="w-5 h-5 text-slate-400 group-hover:text-[#578FCA] transition-colors" />
                </button>
              </div>

              {/* Stats Summary */}
              {!isLoading && moduleStats.length > 0 && (
                <div className="hidden lg:flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl px-4 py-2 border border-slate-200">
                  <div className="text-center">
                    <div className="text-xs text-slate-600">Total Modul</div>
                    <div className="text-lg font-bold text-[#27548A]">
                      {moduleStats.length}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600">
                      Rata-rata Selesai
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(
                        moduleStats.reduce(
                          (sum, m) =>
                            sum +
                            (m.total_completions / (m.total_started || 1)) *
                              100,
                          0,
                        ) / moduleStats.length,
                      )}
                      %
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Container */}
            <div className="bg-gradient-to-br from-slate-50/50 to-white rounded-xl p-3 md:p-4 border border-slate-200">
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">
                    Memuat data...
                  </div>
                </div>
              ) : (
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="min-w-[600px] lg:min-w-0">
                    <ResponsiveContainer
                      width="100%"
                      height={280}
                      className="md:h-[420px]"
                    >
                      <BarChart
                        data={moduleStats}
                        margin={{ top: 20, right: 20, left: 40, bottom: 100 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="module_title"
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
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                          axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                          tickLine={{ stroke: "#cbd5e1" }}
                          width={85}
                          label={{
                            value: "Jumlah Pengguna",
                            angle: -90,
                            position: "insideLeft",
                            offset: 5,
                            style: {
                              fill: "#27548A",
                              fontWeight: 800,
                              fontSize: 15,
                              textAnchor: "middle",
                            },
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(87, 143, 202, 0.1)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload as ModuleStats;
                              const completionRate =
                                data.total_started > 0
                                  ? Math.round(
                                      (data.total_completions /
                                        data.total_started) *
                                        100,
                                    )
                                  : 0;
                              return (
                                <div className="bg-white/98 backdrop-blur-md border-2 border-[#27548A]/20 rounded-2xl shadow-2xl p-4 min-w-[200px]">
                                  <p className="font-bold text-slate-900 mb-3 text-sm border-b border-slate-200 pb-2">
                                    {data.module_title}
                                  </p>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between gap-6">
                                      <span className="text-slate-600 font-medium">
                                        Tingkat Penyelesaian:
                                      </span>
                                      <span className="font-bold text-[#27548A] text-base">
                                        {completionRate}%
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 bg-blue-50 rounded-lg px-2 py-1">
                                      <span className="text-slate-600 font-medium">
                                        ▶ Total Memulai:
                                      </span>
                                      <span className="font-bold text-blue-600">
                                        {data.total_started} orang
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 bg-green-50 rounded-lg px-2 py-1">
                                      <span className="text-slate-600 font-medium">
                                        ✓ Selesai:
                                      </span>
                                      <span className="font-bold text-green-600">
                                        {data.total_completions} orang
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 bg-red-50 rounded-lg px-2 py-1">
                                      <span className="text-slate-600 font-medium">
                                        ⚠ Stuck:
                                      </span>
                                      <span className="font-bold text-red-600">
                                        {data.total_stuck} orang
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
                          dataKey="total_started"
                          fill="#3b82f6"
                          name="Total Memulai"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="total_completions"
                          fill="#59AC77"
                          name="Selesai"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="total_stuck"
                          fill="#ef4444"
                          name="Stuck"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Legend - Enhanced Visibility */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-4 md:mt-6 bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 md:p-5 border-2 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-lg flex items-center justify-center border-2 border-white">
                  <PlayCircle
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
                    strokeWidth={3}
                  />
                </div>
                <span className="text-sm md:text-base font-bold text-slate-800">
                  Total Memulai
                </span>
              </div>
              <div className="w-px h-8 md:h-10 bg-slate-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#59AC77] to-[#4a9563] shadow-lg flex items-center justify-center border-2 border-white">
                  <CheckCircle
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
                    strokeWidth={3}
                  />
                </div>
                <span className="text-sm md:text-base font-bold text-slate-800">
                  Selesai
                </span>
              </div>
              <div className="w-px h-8 md:h-10 bg-slate-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] shadow-lg flex items-center justify-center border-2 border-white">
                  <AlertTriangle
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
                    strokeWidth={3}
                  />
                </div>
                <span className="text-sm md:text-base font-bold text-slate-800">
                  Stuck
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

        {/* Stuck Ranking Section */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-slate-800">
                  Modul dengan Tingkat &quot;Stuck&quot; Tertinggi
                </h3>
                <p className="text-xs md:text-sm text-slate-600">
                  Modul yang perlu perhatian khusus
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowStuckInfoModal(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              title="Info perhitungan"
            >
              <Info className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[...moduleStats]
                .sort((a, b) => b.total_stuck - a.total_stuck)
                .slice(0, 5)
                .map((module, idx) => {
                  // Calculate percentage based on total users who started the module
                  // This gives a more realistic view of how many users are stuck
                  const percentage =
                    module.total_started > 0
                      ? (module.total_stuck / module.total_started) * 100
                      : 0;

                  return (
                    <div
                      key={module.module_id}
                      className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Ranking Number */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {idx + 1}
                        </div>

                        {/* Module Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-2">
                            {module.module_title}
                          </h4>

                          {/* Progress Bar with Count */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  percentage >= 50
                                    ? "bg-gradient-to-r from-red-600 to-red-500"
                                    : percentage >= 25
                                      ? "bg-gradient-to-r from-orange-600 to-orange-500"
                                      : percentage >= 10
                                        ? "bg-gradient-to-r from-yellow-600 to-yellow-500"
                                        : "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                }`}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-red-600 min-w-[60px] text-right">
                              {module.total_stuck} kader
                            </span>
                          </div>

                          {/* Additional Info */}
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                            <span>
                              {percentage.toFixed(1)}% dari{" "}
                              {module.total_started} kader
                            </span>
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() =>
                            handleViewStuckUsers(
                              module.module_id,
                              module.module_title,
                            )
                          }
                          className="flex-shrink-0 p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Lihat kader yang kesulitan"
                        >
                          <Eye className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              {moduleStats.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">
                    Belum ada data modul stuck
                  </p>
                  <p className="text-xs mt-1">
                    Data akan muncul setelah ada aktivitas kader
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200">
        {/* Search and Filter */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau email kader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-slate-900 placeholder:text-slate-400 border-2 border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#578FCA] focus:border-[#578FCA] transition-all text-sm md:text-base"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <FilterButton
                label="Semua"
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />
              <FilterButton
                label="Aktif"
                active={statusFilter === "active"}
                onClick={() => setStatusFilter("active")}
                color="green"
              />
              <FilterButton
                label="Perlu Perhatian"
                active={statusFilter === "struggling"}
                onClick={() => setStatusFilter("struggling")}
                color="yellow"
              />
              <FilterButton
                label="Belum Aktif"
                active={statusFilter === "inactive"}
                onClick={() => setStatusFilter("inactive")}
                color="red"
              />
            </div>
          </div>
        </div>

        {/* User Table */}
        <UserListTable
          users={filteredUsers}
          isLoading={isLoading}
          onViewReadingProgress={handleViewReadingProgress}
          onViewQuizHistory={handleViewQuizHistory}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showReadingProgress && selectedUser && (
          <ReadingProgressModal
            user={selectedUser}
            onClose={() => {
              setShowReadingProgress(false);
              setSelectedUser(null);
            }}
          />
        )}

        {showQuizHistory && selectedUser && (
          <QuizHistoryModal
            user={selectedUser}
            onClose={() => {
              setShowQuizHistory(false);
              setSelectedUser(null);
            }}
          />
        )}

        {showUserListModal && (
          <UserListModal
            title={getModalTitle()}
            users={getUsersByStatus(userListModalType)}
            onClose={() => setShowUserListModal(false)}
            onViewReadingProgress={handleViewReadingProgress}
            onViewQuizHistory={handleViewQuizHistory}
          />
        )}

        {showStuckUsersModal && selectedModule && (
          <StuckUsersModal
            isOpen={showStuckUsersModal}
            onClose={() => {
              setShowStuckUsersModal(false);
              setSelectedModule(null);
            }}
            moduleTitle={selectedModule.title}
            moduleId={selectedModule.id}
          />
        )}
      </AnimatePresence>

      {/* Info Modal for Stuck Calculation */}
      <InfoModal
        isOpen={showStuckInfoModal}
        onClose={() => setShowStuckInfoModal(false)}
        title="Perhitungan Modul 'Stuck'"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">
            Bagaimana kami menghitung modul yang &quot;stuck&quot;?
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  Modul dengan Tingkat Kesulitan Tinggi
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Modul dimana banyak kader mengalami kesulitan, ditandai dengan{" "}
                  <span className="font-bold text-red-600">
                    5 atau lebih kegagalan kuis
                  </span>{" "}
                  di modul tersebut
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs mt-0.5">
                i
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  Kriteria Kader Stuck
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Kader dianggap &quot;stuck&quot; jika gagal menjawab kuis di
                  modul yang sama sebanyak 5 kali atau lebih
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-[#578FCA] p-3 rounded">
            <p className="text-xs text-slate-700">
              <span className="font-semibold text-[#27548A]">💡 Tips:</span>{" "}
              Modul dengan tingkat stuck tinggi menunjukkan bahwa materi
              tersebut sulit dipahami kader. Pertimbangkan untuk menyederhanakan
              materi, menambah contoh, atau memberikan pendampingan khusus untuk
              modul ini.
            </p>
          </div>
        </div>
      </InfoModal>
    </div>
  );
}

// Filter Button Component
interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: "blue" | "green" | "yellow" | "red";
}

function FilterButton({
  label,
  active,
  onClick,
  color = "blue",
}: FilterButtonProps) {
  const colorClasses = {
    blue: active
      ? "bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white shadow-md"
      : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
    green: active
      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
      : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
    yellow: active
      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md"
      : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
    red: active
      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
      : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 ${colorClasses[color]}`}
    >
      {label}
    </button>
  );
}
