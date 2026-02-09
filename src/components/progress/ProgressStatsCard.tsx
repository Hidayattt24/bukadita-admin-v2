import React from "react";

interface ProgressStatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: "blue" | "green" | "yellow" | "red";
  isLoading?: boolean;
  onClick?: () => void;
}

export default function ProgressStatsCard({
  icon,
  title,
  value,
  subtitle,
  color,
  isLoading = false,
  onClick,
}: ProgressStatsCardProps) {
  const colorConfig = {
    blue: {
      gradient: "from-[#578FCA] to-[#27548A]",
      shadow: "shadow-[3px_3px_0px_rgba(87,143,202,0.3),0_1px_3px_rgba(0,0,0,0.05)]",
      bg: "from-[#578FCA]/10 to-[#27548A]/10",
    },
    green: {
      gradient: "from-[#59AC77] to-[#3d8a59]",
      shadow: "shadow-[3px_3px_0px_rgba(89,172,119,0.3),0_1px_3px_rgba(0,0,0,0.05)]",
      bg: "from-[#59AC77]/10 to-[#3d8a59]/10",
    },
    yellow: {
      gradient: "from-yellow-500 to-yellow-600",
      shadow: "shadow-[3px_3px_0px_rgba(234,179,8,0.3),0_1px_3px_rgba(0,0,0,0.05)]",
      bg: "from-yellow-500/10 to-yellow-600/10",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      shadow: "shadow-[3px_3px_0px_rgba(239,68,68,0.3),0_1px_3px_rgba(0,0,0,0.05)]",
      bg: "from-red-500/10 to-red-600/10",
    },
  };

  const config = colorConfig[color];

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white shadow-[6px_6px_0px_rgba(0,0,0,0.1)] animate-pulse">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-white/30 rounded-lg md:rounded-xl"></div>
          <div className="h-4 md:h-6 w-16 md:w-20 bg-white/30 rounded-full"></div>
        </div>
        <div className="h-8 md:h-10 w-20 md:w-24 bg-white/30 rounded mb-1 md:mb-2"></div>
        <div className="h-3 md:h-4 w-24 md:w-32 bg-white/30 rounded"></div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg md:rounded-2xl p-3 md:p-6 border-2 border-white transition-all duration-300 ${
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""
      } w-full`}
      style={{ boxShadow: config.shadow.replace("shadow-[", "").replace("]", "") }}
      onClick={onClick}
    >
      <div className={`absolute top-0 right-0 w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br ${config.bg} rounded-full blur-xl opacity-60`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div className={`p-2 md:p-3 bg-gradient-to-br ${config.gradient} rounded-lg md:rounded-xl`}>
            {icon}
          </div>
          {onClick && (
            <span className="text-[8px] md:text-xs bg-slate-100 text-slate-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-semibold">
              Klik Detail
            </span>
          )}
        </div>
        <div className={`text-2xl md:text-4xl font-bold md:font-semibold mb-0.5 md:mb-1 ${
          color === "blue" ? "text-[#27548A]" :
          color === "green" ? "text-[#59AC77]" :
          color === "yellow" ? "text-yellow-600" :
          "text-red-600"
        }`}>
          {value}
        </div>
        <div className="text-xs md:text-sm font-semibold text-slate-700 mb-1 md:mb-2">
          {title}
        </div>
        <div className="pt-2 md:pt-3 border-t border-slate-200">
          <div className="text-[9px] md:text-xs text-slate-600 font-medium">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}
