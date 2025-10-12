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
import { progressService } from "@/lib/api/progress";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total_users: 0,
    active_users_today: 0,
    total_modules: 0,
    total_quizzes: 0,
    completed_quizzes_total: 0,
    average_completion_rate: 0,
    module_completion_stats: [] as Array<{
      module_id: string | number;
      module_title: string;
      total_users_started: number;
      total_users_completed: number;
      completion_rate: number;
    }>
  });

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Try to load from progress service
        const progressRes = await progressService.getProgressStats();
        if (progressRes.ok) {
          setStats(progressRes.data);
        } else {
          // Use fallback dummy data if API fails
          setStats({
            total_users: 248,
            active_users_today: 67,
            total_modules: 12,
            total_quizzes: 32,
            completed_quizzes_total: 156,
            average_completion_rate: 73,
            module_completion_stats: [
              { module_id: "1", module_title: "Bayi & Balita", total_users_started: 78, total_users_completed: 64, completion_rate: 82 },
              { module_id: "2", module_title: "Hamil & Menyusui", total_users_started: 64, total_users_completed: 48, completion_rate: 75 },
              { module_id: "3", module_title: "Sekolah & Remaja", total_users_started: 52, total_users_completed: 35, completion_rate: 67 },
              { module_id: "4", module_title: "Dewasa & Lansia", total_users_started: 54, total_users_completed: 32, completion_rate: 59 }
            ]
          });
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    loadStats();
  }, []);

  const recentActivities = [
    { id: 1, user: "Siti Aminah", action: "Menyelesaikan Kuis", category: "Bayi & Balita", time: "5 menit lalu" },
    { id: 2, user: "Budi Santoso", action: "Membaca Materi", category: "Dewasa & Lansia", time: "12 menit lalu" },
    { id: 3, user: "Rina Wati", action: "Menyelesaikan Kuis", category: "Hamil & Menyusui", time: "25 menit lalu" },
    { id: 4, user: "Ahmad Yani", action: "Membaca Materi", category: "Sekolah & Remaja", time: "1 jam lalu" },
    { id: 5, user: "Dewi Lestari", action: "Mendaftar Jadwal", category: "Posyandu", time: "2 jam lalu" }
  ];



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
              <p className="text-sm text-gray-600">Pengguna Baru</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jadwal Mendatang</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">
                      {activity.action} • <span className="text-blue-600">{activity.category}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Pengguna per Kategori</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.module_completion_stats?.map((module, index) => (
                <div key={module.module_id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{module.module_title}</span>
                    <span className="font-semibold text-gray-900">{module.total_users_completed}/{module.total_users_started}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${index % 4 === 0 ? 'bg-blue-500' : index % 4 === 1 ? 'bg-green-500' : index % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${module.completion_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-gray-700">Total Pengguna</span>
                <span className="text-gray-900">{stats.total_users}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">ℹ️</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Dashboard Sementara</h3>
            <p className="text-sm text-blue-700">
              Data yang ditampilkan saat ini adalah data dummy untuk keperluan tampilan.
              Data akan diintegrasikan dengan backend setelah semua fitur selesai dikembangkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
