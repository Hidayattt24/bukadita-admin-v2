"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, FileText } from "lucide-react";

interface Option {
  id: string;
  title: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  colorScheme?: "blue" | "amber";
  icon?: React.ReactNode;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih opsi",
  label,
  required = false,
  colorScheme = "blue",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  // Color schemes
  const colors = {
    blue: {
      primary: "#578FCA",
      secondary: "#27548A",
      light: "#E3F2FD",
      border: "border-[#578FCA]",
      ring: "ring-[#578FCA]/30",
      bg: "bg-[#578FCA]",
      bgLight: "bg-blue-50",
      bgHover: "hover:bg-blue-50",
      text: "text-[#578FCA]",
      textDark: "text-[#27548A]",
      gradient: "from-[#578FCA] to-[#27548A]",
    },
    amber: {
      primary: "#F59E0B",
      secondary: "#F97316",
      light: "#FEF3C7",
      border: "border-amber-500",
      ring: "ring-amber-500/30",
      bg: "bg-amber-500",
      bgLight: "bg-amber-50",
      bgHover: "hover:bg-amber-50",
      text: "text-amber-600",
      textDark: "text-orange-600",
      gradient: "from-amber-500 to-orange-500",
    },
  };

  const scheme = colors[colorScheme];

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.title.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Select Button - Modern Card Style */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-left flex items-center gap-3 bg-white shadow-sm ${
            isOpen
              ? `${scheme.border} ${scheme.ring} ring-4 shadow-md`
              : "border-gray-200 hover:border-gray-300 hover:shadow"
          }`}
        >
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${scheme.bgLight} flex items-center justify-center`}>
            <FileText className={`w-5 h-5 ${scheme.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <>
                <div className="text-xs text-gray-500 font-medium mb-0.5">Sub-Materi Dipilih</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{selectedOption.title}</div>
              </>
            ) : (
              <div className="text-sm text-gray-500">{placeholder}</div>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 flex-shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            } ${isOpen ? scheme.text : "text-gray-400"}`}
          />
        </button>

        {/* Dropdown Menu - Modern Style */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            {/* Header with Search */}
            <div className={`p-4 bg-gradient-to-r ${scheme.gradient}`}>
              <div className="text-white text-sm font-semibold mb-3">Pilih Sub-Materi</div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari sub-materi..."
                  className="w-full pl-10 pr-3 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Tidak ada sub-materi ditemukan</p>
                  <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain</p>
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.id === value;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      className={`w-full px-3 py-3 rounded-lg text-left flex items-center gap-3 transition-all mb-1 ${
                        isSelected
                          ? `${scheme.bgLight} ${scheme.textDark} font-semibold shadow-sm`
                          : `text-gray-700 ${scheme.bgHover}`
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${isSelected ? scheme.bg : 'bg-gray-100'} flex items-center justify-center transition-colors`}>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                        )}
                      </div>
                      <span className="flex-1 text-sm truncate">
                        {option.title}
                      </span>
                      {isSelected && (
                        <div className={`flex-shrink-0 px-2 py-1 rounded-full ${scheme.bg} text-white text-xs font-semibold`}>
                          Dipilih
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{filteredOptions.length} sub-materi tersedia</span>
                {selectedOption && (
                  <span className="font-medium text-gray-700">✓ 1 dipilih</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
