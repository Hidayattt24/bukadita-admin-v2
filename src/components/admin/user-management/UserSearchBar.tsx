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
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-slate-200">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar - Full Width */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau nomor hp..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-12 pr-4 py-3 border-2 text-slate-700 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] w-full transition-all"
          />
        </div>

        {/* Filter - Only show if no role filter from URL */}
        {!roleFromUrl && (
          <div className="relative w-full lg:w-auto">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilter(e.target.value)}
              className="pl-12 pr-10 py-3 border-2 text-slate-700 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] appearance-none bg-white cursor-pointer transition-all w-full lg:w-auto"
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          <Plus className="w-4 h-4" />
          {roleFilter === "admin"
            ? "Tambah Ketua Posyandu / Admin"
            : roleFilter === "pengguna"
            ? "Tambah Kader"
            : canManageAdmin
            ? "Tambah Kader/Admin"
            : "Tambah Kader"}
        </button>
      </div>
    </div>
  );
}
