"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Activity,
  Award,
  Clock,
  BarChart3,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import dynamic from "next/dynamic";

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

interface Activity {
  id: string | number;
  user: string;
  action: string;
  category: string;
  score?: number;
  passed?: boolean;
  time: string;
  relative_time: string;
}

export default function AdminDashboardPage() {
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
    recent_activities: [] as Activity[],
    last_updated: "" as string | undefined,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard stats from real API
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Loading dashboard stats from API...");
        const res = await adminAPI.dashboardStats();

        if (res.ok && res.data) {
          console.log("Dashboard stats loaded successfully:", res.data);
          setStats(res.data as typeof stats);
          // Don't set error if data is empty - it's a valid state
        } else {
          const errorMsg =
            !res.ok && "error" in res
              ? res.error
              : "Gagal memuat data dashboard";
          console.error("Failed to load dashboard stats:", errorMsg);
          // Only set error if it's actually a failure, not empty data
          if (!res.ok) {
            setError("Gagal memuat data dashboard. Coba refresh halaman.");
          }
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        // Only set error for actual errors, not empty data
        setError(
          "Terjadi kesalahan saat memuat data. Silakan refresh halaman."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with enhanced styling */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-md">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              Dashboard Analytics
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitoring real-time sistem edukasi Posyandu
            </p>
          </div>
        </div>
      </div>

      {/* Main Statistics Grid - Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Pengguna */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-7 h-7" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
              Total Users
            </span>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.total_users}</div>
          <div className="text-blue-100 text-sm font-medium">
            Pengguna Terdaftar
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center text-xs text-blue-100">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+{stats.new_users_this_week} minggu ini</span>
            </div>
          </div>
        </div>

        {/* Total Materi */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
              Learning
            </span>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.total_modules}</div>
          <div className="text-green-100 text-sm font-medium">
            Modul Edukasi
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center text-xs text-green-100">
              <FileText className="w-3 h-3 mr-1" />
              <span>{stats.total_materials} materi total</span>
            </div>
          </div>
        </div>

        {/* Total Kuis */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-7 h-7" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
              Assessment
            </span>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.total_quizzes}</div>
          <div className="text-purple-100 text-sm font-medium">
            Kuis Tersedia
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center text-xs text-purple-100">
              <Award className="w-3 h-3 mr-1" />
              <span>{stats.completed_quizzes_total} diselesaikan</span>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
              Success Rate
            </span>
          </div>
          <div className="text-4xl font-bold mb-2">
            {Math.round(stats.average_completion_rate)}%
          </div>
          <div className="text-orange-100 text-sm font-medium">
            Completion Rate
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center text-xs text-orange-100">
              <Activity className="w-3 h-3 mr-1" />
              <span>{stats.passed_quizzes_total} kuis lulus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Statistics - Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Aktif Hari Ini
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.active_users_today}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                {stats.total_users > 0
                  ? `${(
                      (stats.active_users_today / stats.total_users) *
                      100
                    ).toFixed(1)}% dari total`
                  : "0% dari total"}
              </p>
            </div>
            <div className="p-4 bg-blue-100 rounded-2xl">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Kuis Diselesaikan
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completed_quizzes_total}
              </p>
              <p className="text-xs text-green-600 mt-1 font-medium">
                Total percobaan kuis
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-2xl">
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Pengguna Baru
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.new_users_this_week}
              </p>
              <p className="text-xs text-purple-600 mt-1 font-medium">
                7 hari terakhir
              </p>
            </div>
            <div className="p-4 bg-purple-100 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Kuis Lulus
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.passed_quizzes_total}
              </p>
              <p className="text-xs text-orange-600 mt-1 font-medium">
                {stats.completed_quizzes_total > 0
                  ? `${(
                      (stats.passed_quizzes_total /
                        stats.completed_quizzes_total) *
                      100
                    ).toFixed(1)}% pass rate`
                  : "0% pass rate"}
              </p>
            </div>
            <div className="p-4 bg-orange-100 rounded-2xl">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {!loading &&
        stats.module_completion_stats &&
        stats.module_completion_stats.length > 0 && (
          <div className="mb-8">
            <DashboardCharts
              moduleStats={stats.module_completion_stats}
              recentActivities={stats.recent_activities || []}
              stats={{
                total_users: stats.total_users,
                active_users_today: stats.active_users_today,
                new_users_this_week: stats.new_users_this_week,
                total_modules: stats.total_modules,
                total_quizzes: stats.total_quizzes,
                completed_quizzes_total: stats.completed_quizzes_total,
                passed_quizzes_total: stats.passed_quizzes_total,
              }}
            />
          </div>
        )}

      {/* Recent Activities - Enhanced */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200">
        <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Aktivitas Terbaru
                </h2>
                <p className="text-xs text-gray-600">
                  Real-time user activity monitoring
                </p>
              </div>
            </div>
            {stats.recent_activities && stats.recent_activities.length > 0 && (
              <span className="px-4 py-2 bg-blue-100 border-2 border-blue-300 text-blue-700 text-sm font-bold rounded-xl">
                {stats.recent_activities.length} aktivitas
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Memuat aktivitas terbaru...
              </p>
            </div>
          ) : stats.recent_activities && stats.recent_activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recent_activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-start gap-4 p-5 border-2 border-gray-200 hover:border-blue-400 rounded-2xl transition-all hover:shadow-lg bg-gradient-to-br from-white to-gray-50"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      activity.passed
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                    } flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          activity.passed
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-blue-100 text-blue-700 border border-blue-300"
                        }`}
                      >
                        {activity.category}
                      </span>
                      {activity.score !== undefined && (
                        <span className="text-xs font-semibold text-gray-600">
                          {Math.round(activity.score)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                      <Clock className="w-3 h-3" />
                      {activity.relative_time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Belum ada aktivitas terbaru
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Aktivitas pengguna akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Info */}
      {error ? (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚠️</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : !loading && stats.total_users === 0 && stats.total_modules === 0 ? (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ℹ️</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Belum Ada Aktivitas
              </h3>
              <p className="text-sm text-blue-700">
                Sistem masih baru. Mulai tambahkan modul dan pengguna untuk
                melihat statistik aktivitas kader.
              </p>
            </div>
          </div>
        </div>
      ) : (
        !loading &&
        stats.last_updated && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-900 mb-1">
                  Data Real-time
                </h3>
                <p className="text-sm text-green-700">
                  Semua data ditampilkan secara real-time dari database.
                  Terakhir diperbarui:{" "}
                  {new Date(stats.last_updated).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
