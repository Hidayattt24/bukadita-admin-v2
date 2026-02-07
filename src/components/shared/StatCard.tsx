import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "purple" | "orange" | "green" | "red" | "yellow";
  className?: string;
}

const colorVariants = {
  blue: {
    text: "text-blue-600",
    icon: "text-blue-600",
  },
  purple: {
    text: "text-purple-600",
    icon: "text-purple-600",
  },
  orange: {
    text: "text-orange-600",
    icon: "text-orange-600",
  },
  green: {
    text: "text-green-600",
    icon: "text-green-600",
  },
  red: {
    text: "text-red-600",
    icon: "text-red-600",
  },
  yellow: {
    text: "text-yellow-600",
    icon: "text-yellow-600",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  className = ""
}: StatCardProps) {
  const colorClasses = colorVariants[color];

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses.text}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses.icon}`} />
      </div>
    </div>
  );
}