"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function DashboardCharts({ moduleStats, recentActivities, stats }: DashboardChartsProps) {
  // Prepare data for module completion chart
  const moduleChartData = moduleStats.map((module) => ({
    name: module.module_title.length > 20 
      ? module.module_title.substring(0, 20) + '...' 
      : module.module_title,
    started: module.total_users_started,
    completed: module.total_users_completed,
    rate: module.completion_rate,
  }));

  // Prepare data for quiz performance pie chart
  const quizPerformanceData = [
    { name: 'Lulus', value: stats.passed_quizzes_total },
    { name: 'Tidak Lulus', value: stats.completed_quizzes_total - stats.passed_quizzes_total },
  ];

  // Prepare data for user activity trend (last 7 days from activities)
  const activityTrendData = (() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        day: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        activities: 0,
      };
    });

    // Count activities per day
    recentActivities.forEach((activity) => {
      const activityDate = new Date(activity.time).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.date === activityDate);
      if (dayData) {
        dayData.activities++;
      }
    });

    return last7Days.map(d => ({ name: d.day, aktivitas: d.activities }));
  })();

  // Prepare data for overview stats
  const overviewData = [
    { name: 'Total Pengguna', value: stats.total_users },
    { name: 'Aktif Hari Ini', value: stats.active_users_today },
    { name: 'Pengguna Baru (7 Hari)', value: stats.new_users_this_week },
  ];

  return (
    <div className="space-y-6">
      {/* Module Completion Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Penyelesaian Modul</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={moduleChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="started" fill="#3B82F6" name="Memulai" />
            <Bar dataKey="completed" fill="#10B981" name="Selesai" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Aktivitas (7 Hari Terakhir)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="aktivitas" stroke="#8B5CF6" strokeWidth={2} name="Aktivitas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz Performance Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa Kuis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={quizPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {quizPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Lulus: {stats.passed_quizzes_total}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Tidak Lulus: {stats.completed_quizzes_total - stats.passed_quizzes_total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Overview Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pengguna</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={overviewData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" name="Jumlah">
              {overviewData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Module Completion Rate Chart */}
      {moduleChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tingkat Penyelesaian per Modul (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rate" fill="#8B5CF6" name="Completion Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
