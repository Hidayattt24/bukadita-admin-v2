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
  Cell,
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
  primary: "#27548A", // Blue Dark
  secondary: "#578FCA", // Blue Light
  success: "#10b981", // Emerald
  warning: "#f59e0b", // Amber
  danger: "#ef4444", // Red
  info: "#3b82f6", // Blue
  slate: "#64748b", // Slate
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
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

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
    {
      name: "Total Pengguna",
      value: stats.total_users,
      color: BRAND_COLORS.primary,
    },
    {
      name: "Aktif Hari Ini",
      value: stats.active_users_today,
      color: BRAND_COLORS.success,
    },
    {
      name: "Pengguna Baru (7 Hari)",
      value: stats.new_users_this_week,
      color: BRAND_COLORS.warning,
    },
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
              <span className="font-semibold text-slate-900">
                {entry.value}
              </span>
            </div>
          ))}
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
              <h3 className="text-sm md:text-xl font-semibold text-slate-900">
                Grafik Analytics
              </h3>
              <p className="text-[10px] md:text-sm text-slate-600 truncate">
                Pengguna aktif per hari
              </p>
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
            <ResponsiveContainer
              width="100%"
              height={250}
              className="md:h-[350px]"
            >
              <LineChart data={activityTrendData}>
                <defs>
                  <linearGradient
                    id="colorActivity"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={BRAND_COLORS.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={BRAND_COLORS.primary}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={BRAND_COLORS.success}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={BRAND_COLORS.success}
                      stopOpacity={0.1}
                    />
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
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600"></div>
            <span className="text-[10px] md:text-sm font-semibold text-slate-700">
              Pengguna Aktif
            </span>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-3 md:mt-6">
          {/* Engagement Insight */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-200">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <h4 className="text-xs md:text-sm font-bold text-blue-900">
                Tingkat Engagement
              </h4>
            </div>
            <p className="text-[10px] md:text-sm text-blue-800">
              Dalam periode yang dipilih, terdapat{" "}
              <strong className="text-blue-900">
                {new Set(recentActivities.map((a) => a.user)).size}
              </strong>{" "}
              pengguna aktif yang berinteraksi dengan sistem.
            </p>
            <div className="mt-1.5 md:mt-2 text-[9px] md:text-xs text-blue-700">
              Rata-rata{" "}
              <strong>
                {Math.round(
                  activityTrendData.reduce((sum, d) => sum + d.pengguna, 0) /
                    activityTrendData.length,
                )}
              </strong>{" "}
              pengguna aktif per hari
            </div>
          </div>
        </div>
      </div>

      {/* User Overview Chart - MODERN DESIGN */}
      <div className="relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-slate-100 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/5 to-green-500/5 rounded-full blur-2xl -ml-24 -mb-24"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-2.5 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl shadow-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold text-slate-800">
                  Ringkasan Pengguna
                </h3>
                <p className="text-xs md:text-sm text-slate-600 hidden md:block">
                  Gambaran data pengguna sistem
                </p>
              </div>
            </div>

            {/* Total Summary Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl px-4 py-2 border border-slate-200">
              <div className="text-center">
                <div className="text-xs text-slate-600">Total</div>
                <div className="text-lg font-bold text-[#27548A]">
                  {stats.total_users}
                </div>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="bg-gradient-to-br from-slate-50/50 to-white rounded-xl p-3 md:p-4 border border-slate-200">
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="min-w-[500px] lg:min-w-0">
                <ResponsiveContainer
                  width="100%"
                  height={240}
                  className="md:h-[320px]"
                >
                  <BarChart
                    data={userOverviewData}
                    layout="vertical"
                    barSize={40}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fill: "#1e293b", fontSize: 13, fontWeight: 700 }}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(87, 143, 202, 0.1)" }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          const entry = userOverviewData.find(
                            (e) => e.name === label,
                          );
                          return (
                            <div className="bg-white/98 backdrop-blur-md border-2 border-[#27548A]/20 rounded-2xl shadow-2xl p-4 min-w-[180px]">
                              <p className="font-bold text-slate-900 mb-3 text-sm border-b border-slate-200 pb-2">
                                {label}
                              </p>
                              <div className="flex items-center justify-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-lg shadow-sm"
                                  style={{ backgroundColor: entry?.color }}
                                ></div>
                                <span
                                  className="font-bold text-3xl"
                                  style={{ color: entry?.color }}
                                >
                                  {data.value}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 text-center mt-2">
                                pengguna
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name="Jumlah"
                      radius={[0, 12, 12, 0]}
                      maxBarSize={50}
                    >
                      {userOverviewData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stats Cards - Modern Style */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6">
            {userOverviewData.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-slate-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-slate-200 hover:border-slate-300 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 md:w-4 md:h-4 rounded-lg shadow-sm"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs md:text-sm font-semibold text-slate-700 line-clamp-1">
                    {item.name}
                  </span>
                </div>
                <div
                  className="text-xl md:text-3xl font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {index === 0 && "pengguna"}
                  {index === 1 && "aktif"}
                  {index === 2 && "baru"}
                </div>
              </div>
            ))}
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
            <span>Geser untuk melihat detail</span>
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
    </div>
  );
}
