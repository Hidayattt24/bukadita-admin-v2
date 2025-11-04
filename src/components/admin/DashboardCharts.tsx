"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Users, Activity, Award, BarChart3 } from "lucide-react";

interface ModuleCompletionStat {
  module_id: string | number;
  module_title: string;
  total_users_started: number;
  total_users_completed: number;
  completion_rate: number;
}

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

interface DashboardChartsProps {
  moduleStats: ModuleCompletionStat[];
  recentActivities: Activity[];
  stats: {
    total_users: number;
    active_users_today: number;
    new_users_this_week: number;
    total_modules: number;
    total_quizzes: number;
    completed_quizzes_total: number;
    passed_quizzes_total: number;
  };
}

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

export default function DashboardCharts({
  moduleStats,
  recentActivities,
  stats,
}: DashboardChartsProps) {
  // Prepare data for module completion chart
  const moduleChartData = moduleStats.map((module) => ({
    name:
      module.module_title.length > 20
        ? module.module_title.substring(0, 20) + "..."
        : module.module_title,
    started: module.total_users_started,
    completed: module.total_users_completed,
    rate: module.completion_rate,
  }));

  // Prepare data for quiz performance pie chart
  const quizPerformanceData = [
    { name: "Lulus", value: stats.passed_quizzes_total },
    {
      name: "Tidak Lulus",
      value: stats.completed_quizzes_total - stats.passed_quizzes_total,
    },
  ];

  // Prepare data for user activity trend (last 7 days from activities)
  const activityTrendData = (() => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        day: days[date.getDay()],
        date: date.toISOString().split("T")[0],
        activities: 0,
      };
    });

    // Count activities per day
    recentActivities.forEach((activity) => {
      const activityDate = new Date(activity.time).toISOString().split("T")[0];
      const dayData = last7Days.find((d) => d.date === activityDate);
      if (dayData) {
        dayData.activities++;
      }
    });

    return last7Days.map((d) => ({ name: d.day, aktivitas: d.activities }));
  })();

  // Prepare data for overview stats
  const overviewData = [
    { name: "Total Pengguna", value: stats.total_users },
    { name: "Aktif Hari Ini", value: stats.active_users_today },
    { name: "Pengguna Baru (7 Hari)", value: stats.new_users_this_week },
  ];

  // Custom Tooltip Component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-700">{entry.name}:</span>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Module Completion Chart - Optimized */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Progress Penyelesaian Modul
              </h3>
              <p className="text-sm text-gray-600">
                Tracking pengguna yang memulai vs menyelesaikan modul
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">Memulai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">Selesai</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={moduleChartData} barGap={8}>
            <defs>
              <linearGradient id="colorStarted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar
              dataKey="started"
              fill="url(#colorStarted)"
              name="Memulai"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="completed"
              fill="url(#colorCompleted)"
              name="Selesai"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trend Chart - Optimized */}
        <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-600 rounded-xl shadow-sm">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Tren Aktivitas
              </h3>
              <p className="text-xs text-gray-600">7 Hari Terakhir</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityTrendData}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="aktivitas"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#colorActivity)"
                name="Aktivitas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz Performance Pie Chart - Optimized */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-600 rounded-xl shadow-sm">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Performa Kuis</h3>
              <p className="text-xs text-gray-600">Tingkat Kelulusan</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <defs>
                <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
              <Pie
                data={quizPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const item = entry as unknown as {
                    name: string;
                    percent: number;
                  };
                  const percentValue = (item.percent * 100).toFixed(1);
                  return `${item.name}\n${percentValue}%`;
                }}
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {quizPerformanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0 ? "url(#gradientGreen)" : "url(#gradientRed)"
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
                <span className="text-xs font-semibold text-green-800">
                  Lulus
                </span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {stats.passed_quizzes_total}
              </p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full"></div>
                <span className="text-xs font-semibold text-red-800">
                  Tidak Lulus
                </span>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {stats.completed_quizzes_total - stats.passed_quizzes_total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Overview Bar Chart - Optimized */}
      <div className="bg-white rounded-2xl shadow-md border border-cyan-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-600 rounded-xl shadow-sm">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Ringkasan Pengguna
            </h3>
            <p className="text-sm text-gray-600">
              Overview data pengguna sistem
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={overviewData} layout="vertical" barSize={40}>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient
                  key={index}
                  id={`gradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={180}
              tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(6, 182, 212, 0.1)" }}
            />
            <Bar dataKey="value" name="Jumlah" radius={[0, 10, 10, 0]}>
              {overviewData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index % COLORS.length})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Module Completion Rate Chart - Enhanced */}
      {moduleChartData.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 rounded-2xl shadow-lg border-2 border-orange-100 p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Tingkat Penyelesaian per Modul
                </h3>
                <p className="text-sm text-gray-600">
                  Persentase completion rate setiap modul
                </p>
              </div>
            </div>
            <div className="bg-orange-100 border-2 border-orange-300 rounded-xl px-4 py-2">
              <p className="text-xs font-semibold text-orange-800">
                Target: 80%
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={moduleChartData}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={120}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                label={{
                  value: "Completion Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
              />
              <Bar
                dataKey="rate"
                fill="url(#colorRate)"
                name="Completion Rate (%)"
                radius={[10, 10, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-xs font-semibold text-green-800 mb-1">
                Sangat Baik
              </p>
              <p className="text-lg font-bold text-green-700">≥ 80%</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-xs font-semibold text-yellow-800 mb-1">
                Cukup Baik
              </p>
              <p className="text-lg font-bold text-yellow-700">50-79%</p>
            </div>
            <div className="text-center p-3 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-xs font-semibold text-red-800 mb-1">
                Perlu Perbaikan
              </p>
              <p className="text-lg font-bold text-red-700">&lt; 50%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
