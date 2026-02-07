"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import { TrendingUp, Users } from "lucide-react";
import CustomDateRangePicker from "../shared/CustomDateRangePicker";

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
  recentActivities: Activity[];
  stats: {
    total_users: number;
    active_users_today: number;
    new_users_this_week: number;
  };
}

// Project Color Palette
const BRAND_COLORS = {
  primary: "#27548A",      // Blue Dark
  secondary: "#578FCA",    // Blue Light
  success: "#10b981",      // Emerald
  warning: "#f59e0b",      // Amber
  danger: "#ef4444",       // Red
  info: "#3b82f6",         // Blue
  slate: "#64748b",        // Slate
};

export default function DashboardCharts({
  recentActivities,
  stats,
}: DashboardChartsProps) {
  const [dateRange, setDateRange] = useState(7); // Default 7 days
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [useCustomRange, setUseCustomRange] = useState(false);

  // Initialize dates
  useEffect(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - dateRange + 1);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, [dateRange]);

  // Prepare data for activity trend
  const activityTrendData = (() => {
    const start = new Date(startDate || new Date());
    const end = new Date(endDate || new Date());
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const dateArray = Array.from({ length: days }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split("T")[0],
        displayDate: `${date.getDate()}/${date.getMonth() + 1}`,
        activities: 0,
        users: new Set<string>(),
      };
    });

    // Count activities per day
    recentActivities.forEach((activity) => {
      const activityDate = new Date(activity.time).toISOString().split("T")[0];
      const dayData = dateArray.find((d) => d.date === activityDate);
      if (dayData) {
        dayData.activities++;
        dayData.users.add(activity.user);
      }
    });

    return dateArray.map((d) => ({
      name: d.displayDate,
      aktivitas: d.activities,
      pengguna: d.users.size,
    }));
  })();

  // Prepare data for user overview
  const userOverviewData = [
    { name: "Total Pengguna", value: stats.total_users, color: BRAND_COLORS.primary },
    { name: "Aktif Hari Ini", value: stats.active_users_today, color: BRAND_COLORS.success },
    { name: "Pengguna Baru (7 Hari)", value: stats.new_users_this_week, color: BRAND_COLORS.warning },
  ];

  // Custom Tooltip for Activity Chart
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
        <div className="bg-white/95 backdrop-blur-sm border-2 border-slate-200 rounded-xl shadow-2xl p-4">
          <p className="font-semibold text-slate-900 mb-2 text-sm">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-slate-700 font-medium">{entry.name}:</span>
              <span className="font-semibold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for User Overview (only show number)
  const UserTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload?: { color?: string } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const color = data.payload?.color || BRAND_COLORS.primary;
      return (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-[#27548A]/30 rounded-xl shadow-2xl p-4">
          <p className="font-semibold text-slate-900 mb-2 text-sm">{label}</p>
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="font-semibold text-2xl" style={{ color }}>{data.value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleQuickRange = (days: number) => {
    setDateRange(days);
    setUseCustomRange(false);
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - days + 1);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Activity Trend with Date Range Picker */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl shadow-md md:shadow-lg border-2 border-slate-200 p-3 md:p-6 w-full">
        <div className="flex flex-col gap-2 md:gap-4 mb-3 md:mb-6 w-full">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-lg md:rounded-xl shadow-md">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-xl font-semibold text-slate-900">Grafik Analytics</h3>
              <p className="text-[10px] md:text-sm text-slate-600 truncate">Aktivitas dan pengguna aktif per hari</p>
            </div>
          </div>

          {/* Date Range Controls */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full">
            {/* Quick Range Buttons */}
            <div className="flex items-center gap-1 md:gap-2 bg-white rounded-lg md:rounded-xl p-1 border-2 border-slate-200 shadow-sm overflow-x-auto">
              {[7, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => handleQuickRange(days)}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    dateRange === days && !useCustomRange
                      ? "bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>

            {/* Custom Date Range Picker */}
            <div className="w-full md:w-auto">
              <CustomDateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => {
                  setStartDate(date);
                  setUseCustomRange(true);
                }}
                onEndDateChange={(date) => {
                  setEndDate(date);
                  setUseCustomRange(true);
                }}
                onCustomRangeActive={() => setUseCustomRange(true)}
              />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto -mx-3 md:mx-0">
          <div className="min-w-[500px] md:min-w-0 px-3 md:px-0">
            <ResponsiveContainer width="100%" height={250} className="md:h-[350px]">
              <LineChart data={activityTrendData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_COLORS.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={BRAND_COLORS.primary} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_COLORS.success} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={BRAND_COLORS.success} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 9, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  className="text-[8px] md:text-xs"
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 9, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  width={35}
                  className="md:w-[50px]"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="aktivitas"
                  stroke={BRAND_COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: BRAND_COLORS.primary, r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Aktivitas"
                  className="md:stroke-[3]"
                />
                <Line
                  type="monotone"
                  dataKey="pengguna"
                  stroke={BRAND_COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: BRAND_COLORS.success, r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Pengguna Aktif"
                  className="md:stroke-[3]"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mt-2 md:mt-4">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-[#27548A] to-[#578FCA]"></div>
            <span className="text-[10px] md:text-sm font-semibold text-slate-700">Aktivitas</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600"></div>
            <span className="text-[10px] md:text-sm font-semibold text-slate-700">Pengguna</span>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-3 md:mt-6">
          {/* Engagement Insight */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-200">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <h4 className="text-xs md:text-sm font-bold text-blue-900">Tingkat Engagement</h4>
            </div>
            <p className="text-[10px] md:text-sm text-blue-800">
              Dalam periode yang dipilih, terdapat{" "}
              <strong className="text-blue-900">
                {activityTrendData.reduce((sum, d) => sum + d.aktivitas, 0)}
              </strong>{" "}
              aktivitas dari{" "}
              <strong className="text-blue-900">
                {new Set(recentActivities.map(a => a.user)).size}
              </strong>{" "}
              pengguna aktif.
            </p>
            <div className="mt-1.5 md:mt-2 text-[9px] md:text-xs text-blue-700">
              Rata-rata{" "}
              <strong>
                {Math.round(
                  activityTrendData.reduce((sum, d) => sum + d.aktivitas, 0) /
                    activityTrendData.length
                )}
              </strong>{" "}
              aktivitas per hari
            </div>
          </div>
        </div>
      </div>

      {/* User Overview Chart */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl shadow-md md:shadow-lg border-2 border-slate-200 p-3 md:p-6 w-full">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-br from-[#27548A] to-[#578FCA] rounded-lg md:rounded-xl shadow-md">
            <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-xl font-semibold text-slate-900">Ringkasan Pengguna</h3>
            <p className="text-[10px] md:text-sm text-slate-600 truncate">Gambaran data pengguna sistem</p>
          </div>
        </div>
        <div className="w-full overflow-x-auto -mx-3 md:mx-0">
          <div className="min-w-[400px] md:min-w-0 px-3 md:px-0">
            <ResponsiveContainer width="100%" height={200} className="md:h-[280px]">
              <BarChart data={userOverviewData} layout="vertical" barSize={25} className="md:bar-size-[40]">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 9, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  className="text-[8px] md:text-xs"
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  tick={{ fill: "#1e293b", fontSize: 9, fontWeight: 600 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  className="md:w-[180px] text-[9px] md:text-[13px]"
                />
                <Tooltip
                  content={<UserTooltip />}
                  cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                />
                <Bar dataKey="value" name="Jumlah" radius={[0, 10, 10, 0]}>
                  {userOverviewData.map((entry, index) => (
                    <defs key={index}>
                      <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor={entry.color} stopOpacity={0.9} />
                        <stop offset="95%" stopColor={entry.color} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                  ))}
                  {userOverviewData.map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      dataKey="value"
                      fill={`url(#gradient-${index})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

