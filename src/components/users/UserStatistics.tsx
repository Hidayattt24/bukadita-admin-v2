import { Users, Shield } from "lucide-react";

interface UserStatisticsProps {
  totalUsers: number;
  adminUsers: number;
  roleFilter: string;
}

export default function UserStatistics({
  totalUsers,
  adminUsers,
  roleFilter,
}: UserStatisticsProps) {
  // When filtering by admin role, only show admin count
  // When filtering by pengguna or no filter, show total users
  const shouldShowAdminOnly = roleFilter === "admin";
  const displayCount = shouldShowAdminOnly ? adminUsers : totalUsers;
  const displayTitle = shouldShowAdminOnly
    ? "Ketua Posyandu / Admin"
    : roleFilter === "pengguna"
    ? "Total Kader"
    : "Total Pengguna";
  const displaySubtitle = shouldShowAdminOnly
    ? "Pengelola sistem"
    : roleFilter === "pengguna"
    ? "Kader posyandu terdaftar"
    : "Semua pengguna terdaftar";
  const displayIcon = shouldShowAdminOnly ? Shield : Users;
  const displayBadge = shouldShowAdminOnly
    ? "Admin"
    : roleFilter === "pengguna"
    ? "Kader"
    : "Total";

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
      {/* Statistics Card */}
      <div
        className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        style={{
          boxShadow:
            "6px 6px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg sm:rounded-xl">
              {displayIcon === Shield ? (
                <Shield className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              ) : (
                <Users className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
              {displayBadge}
            </span>
          </div>
          <div className="text-3xl sm:text-3xl md:text-4xl font-semibold text-[#27548A] mb-1">
            {displayCount}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
            {displayTitle}
          </div>
          <div className="pt-2 sm:pt-3 border-t border-slate-200">
            <div className="flex items-center text-[10px] sm:text-xs text-slate-600">
              {displayIcon === Shield ? (
                <Shield className="w-3 h-3 mr-1 text-[#27548A]" />
              ) : (
                <Users className="w-3 h-3 mr-1 text-[#27548A]" />
              )}
              <span className="font-medium">{displaySubtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
