import { Search, Plus, X } from "lucide-react";

interface ModuleSearchBarProps {
  searchTerm: string;
  showForm: boolean;
  onSearch: (value: string) => void;
  onToggleForm: () => void;
}

export default function ModuleSearchBar({
  searchTerm,
  showForm,
  onSearch,
  onToggleForm,
}: ModuleSearchBarProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border-2 border-slate-200">
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch lg:items-center justify-between">
        {/* Search Bar - Full Width */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Cari modul..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 border-2 text-slate-700 text-sm sm:text-base border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] w-full transition-all"
          />
        </div>

        {/* Add Module Button */}
        <button
          onClick={onToggleForm}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base whitespace-nowrap ${
            showForm
              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
              : "bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white"
          }`}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Tutup Form</span>
              <span className="sm:hidden">Tutup</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Tambah Modul</span>
              <span className="sm:hidden">Tambah</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
