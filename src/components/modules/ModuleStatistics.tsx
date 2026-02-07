import { Folder, Check, BookOpen, ListChecks } from "lucide-react";

interface ModuleStatisticsProps {
  totalModules: number;
  publishedModules: number;
  totalMaterials: number;
  totalQuiz: number;
}

export default function ModuleStatistics({
  totalModules,
  publishedModules,
  totalMaterials,
  totalQuiz,
}: ModuleStatisticsProps) {
  const stats = [
    {
      title: "Total Modul",
      shortTitle: "Modul",
      value: totalModules,
      icon: Folder,
      iconBg: "bg-[#27548A]",
      badge: "Total",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "Modul Terbit",
      shortTitle: "Terbit",
      value: publishedModules,
      icon: Check,
      iconBg: "bg-green-500",
      badge: "Aktif",
      badgeColor: "bg-green-100 text-green-700",
    },
    {
      title: "Total Materi",
      shortTitle: "Materi",
      value: totalMaterials,
      icon: BookOpen,
      iconBg: "bg-[#578FCA]",
      badge: "Konten",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      title: "Total Kuis",
      shortTitle: "Kuis",
      value: totalQuiz,
      icon: ListChecks,
      iconBg: "bg-orange-500",
      badge: "Evaluasi",
      badgeColor: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{
              boxShadow:
                "4px 4px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {/* Decorative Background - Hidden on mobile */}
            <div className="hidden sm:block absolute top-0 right-0 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
            
            <div className="relative">
              {/* Mobile Layout (2 columns) */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 sm:p-2 ${stat.iconBg} rounded-md sm:rounded-lg shadow-md`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] ${stat.badgeColor} px-1.5 sm:px-2 py-0.5 rounded-full font-semibold`}>
                    {stat.badge}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-semibold text-[#27548A] mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-700">
                  {stat.shortTitle}
                </div>
              </div>

              {/* Desktop Layout (4 columns) */}
              <div className="hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.iconBg} rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs ${stat.badgeColor} px-3 py-1 rounded-full font-semibold`}>
                    {stat.badge}
                  </span>
                </div>
                <div className="text-4xl font-semibold text-[#27548A] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-3">
                  {stat.title}
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center text-xs text-slate-600">
                    <Icon className="w-3 h-3 mr-1 text-[#27548A]" />
                    <span className="font-medium">
                      {index === 0 && "Semua modul terdaftar"}
                      {index === 1 && "Modul yang dipublikasi"}
                      {index === 2 && "Konten pembelajaran"}
                      {index === 3 && "Evaluasi pembelajaran"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
