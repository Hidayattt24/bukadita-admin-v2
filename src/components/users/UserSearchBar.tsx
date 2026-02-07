import { Search, Filter, Plus } from "lucide-react";

interface UserSearchBarProps {
  searchTerm: string;
  roleFilter: string;
  roleFromUrl: string;
  canManageAdmin: boolean;
  onSearch: (value: string) => void;
  onRoleFilter: (role: string) => void;
  onAddUser: () => void;
}

export default function UserSearchBar({
  searchTerm,
  roleFilter,
  roleFromUrl,
  canManageAdmin,
  onSearch,
  onRoleFilter,
  onAddUser,
}: UserSearchBarProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border-2 border-slate-200">
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch lg:items-center justify-between">
        {/* Search Bar - Full Width */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Cari nama atau nomor hp..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 border-2 text-slate-700 text-sm sm:text-base border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] w-full transition-all"
          />
        </div>

        {/* Filter - Only show if no role filter from URL */}
        {!roleFromUrl && (
          <div className="relative w-full lg:w-auto">
            <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilter(e.target.value)}
              className="pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-2.5 md:py-3 border-2 text-slate-700 text-sm sm:text-base border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] appearance-none bg-white cursor-pointer transition-all w-full lg:w-auto"
            >
              <option value="">Semua Role</option>
              <option value="pengguna">Kader</option>
              {canManageAdmin && (
                <option value="admin">Ketua Posyandu / Admin</option>
              )}
            </select>
          </div>
        )}

        {/* Modern Add Button */}
        <button
          onClick={onAddUser}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">
            {roleFilter === "admin"
              ? "Tambah Ketua Posyandu / Admin"
              : roleFilter === "pengguna"
              ? "Tambah Kader"
              : canManageAdmin
              ? "Tambah Kader/Admin"
              : "Tambah Kader"}
          </span>
          <span className="sm:hidden">
            {roleFilter === "admin"
              ? "Tambah Admin"
              : "Tambah Kader"}
          </span>
        </button>
      </div>
    </div>
  );
}
