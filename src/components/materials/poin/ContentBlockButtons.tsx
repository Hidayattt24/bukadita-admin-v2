"use client";

import { FileText, ImageIcon } from "lucide-react";

interface ContentBlockButtonsProps {
  onAddText: () => void;
  onAddMedia: () => void;
}

export default function ContentBlockButtons({
  onAddText,
  onAddMedia,
}: ContentBlockButtonsProps) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        type="button"
        onClick={onAddText}
        className="flex-1 group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#27548A] to-[#578FCA] hover:from-[#1e3f6b] hover:to-[#4579b0] text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#27548A]/30 hover:shadow-xl hover:-translate-y-0.5"
      >
        <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FileText className="w-4 h-4" />
        </div>
        Tambah Teks
      </button>
      <button
        type="button"
        onClick={onAddMedia}
        className="flex-1 group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-600/30 hover:shadow-xl hover:-translate-y-0.5"
      >
        <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <ImageIcon className="w-4 h-4" />
        </div>
        Tambah Media
      </button>
    </div>
  );
}
