"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  Activity,
  Award,
  Clock,
  BarChart3,
  PieChart
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
    last_updated: "" as string | undefined
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard stats from real API
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Loading dashboard stats from API...');
        const res = await adminAPI.dashboardStats();

        if (res.ok && res.data) {
          console.log('Dashboard stats loaded successfully:', res.data);
          setStats(res.data as typeof stats);
          // Don't set error if data is empty - it's a valid state
        } else {
          const errorMsg = !res.ok && 'error' in res ? res.error : 'Gagal memuat data dashboard';
          console.error('Failed to load dashboard stats:', errorMsg);
          // Only set error if it's actually a failure, not empty data
          if (!res.ok) {
            setError('Gagal memuat data dashboard. Coba refresh halaman.');
          }
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Only set error for actual errors, not empty data
        setError('Terjadi kesalahan saat memuat data. Silakan refresh halaman.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <p className="text-gray-600">Ringkasan aktivitas dan statistik sistem Posyandu</p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Pengguna */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.total_users}</div>
          <div className="text-blue-100 text-sm">Pengguna Terdaftar</div>
        </div>

        {/* Total Materi */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 opacity-80" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Konten</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.total_modules}</div>
          <div className="text-green-100 text-sm">Materi Edukasi</div>
        </div>

        {/* Total Kuis */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Kuis</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.total_quizzes}</div>
          <div className="text-purple-100 text-sm">Kuis Tersedia</div>
        </div>

        {/* Total Jadwal */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Jadwal</span>
          </div>
          <div className="text-3xl font-bold mb-1">{Math.round(stats.average_completion_rate)}%</div>
          <div className="text-orange-100 text-sm">Completion Rate</div>
        </div>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_users_today}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kuis Diselesaikan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed_quizzes_total}</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pengguna Baru (7 Hari)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.new_users_this_week}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kuis Lulus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.passed_quizzes_total}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {!loading && stats.module_completion_stats && stats.module_completion_stats.length > 0 && (
        <div className="mb-6">
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

      {/* Recent Activities - Full Width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Memuat aktivitas...</p>
            </div>
          ) : stats.recent_activities && stats.recent_activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recent_activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 hover:border-blue-300 rounded-lg transition-all hover:shadow-md">
                  <div className={`w-10 h-10 rounded-full ${activity.passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.action}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${activity.passed ? "text-green-600" : "text-blue-600"}`}>
                      {activity.category}
                      {activity.score !== undefined && (
                        <span className="ml-1 text-gray-500">({Math.round(activity.score)}%)</span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <Clock className="w-3 h-3" />
                      {activity.relative_time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada aktivitas terbaru</p>
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
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Belum Ada Aktivitas</h3>
              <p className="text-sm text-blue-700">Sistem masih baru. Mulai tambahkan modul dan pengguna untuk melihat statistik aktivitas kader.</p>
            </div>
          </div>
        </div>
      ) : !loading && stats.last_updated && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900 mb-1">Data Real-time</h3>
              <p className="text-sm text-green-700">
                Semua data ditampilkan secara real-time dari database. 
                Terakhir diperbarui: {new Date(stats.last_updated).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
