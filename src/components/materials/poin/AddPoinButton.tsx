"use client";

import { Plus, X } from "lucide-react";

interface AddPoinButtonProps {
  showForm: boolean;
  onToggle: () => void;
}

export default function AddPoinButton({
  showForm,
  onToggle,
}: AddPoinButtonProps) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="group inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#27548A] to-[#578FCA] hover:from-[#1e3f6b] hover:to-[#4579b0] text-white rounded-xl shadow-lg shadow-[#27548A]/30 hover:shadow-xl hover:shadow-[#27548A]/40 transition-all duration-300 font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
        {showForm ? "Tutup Form" : "Tambah Poin Baru"}
      </button>
    </div>
  );
}
