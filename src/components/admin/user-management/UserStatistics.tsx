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
  return (
    <div
      className={`grid grid-cols-1 ${
        roleFilter === "admin" ? "md:grid-cols-2" : "md:grid-cols-1"
      } gap-6`}
    >
      {/* Total Users Card */}
      <div
        className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        style={{
          boxShadow:
            "6px 6px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
              Total
            </span>
          </div>
          <div className="text-4xl font-semibold text-[#27548A] mb-1">
            {totalUsers}
          </div>
          <div className="text-sm font-semibold text-slate-700 mb-3">
            Total Pengguna
          </div>
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center text-xs text-slate-600">
              <Users className="w-3 h-3 mr-1 text-[#27548A]" />
              <span className="font-medium">Semua pengguna terdaftar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Users Card - Only show for admin role filter */}
      {roleFilter === "admin" && (
        <div
          className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          style={{
            boxShadow:
              "6px 6px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                Admin
              </span>
            </div>
            <div className="text-4xl font-semibold text-[#27548A] mb-1">
              {adminUsers}
            </div>
            <div className="text-sm font-semibold text-slate-700 mb-3">
              Ketua Posyandu / Admin
            </div>
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center text-xs text-slate-600">
                <Shield className="w-3 h-3 mr-1 text-[#27548A]" />
                <span className="font-medium">Pengelola sistem</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
