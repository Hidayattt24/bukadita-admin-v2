"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Check } from "lucide-react";
import { Material } from "@/lib/api";

interface SubMateriEditModalProps {
  material: Material | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    published: boolean;
    content?: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function SubMateriEditModal({
  material,
  onClose,
  onSubmit,
  isSubmitting = false,
}: SubMateriEditModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (material) {
      setTitle(material.title);
      setContent(material.content || "");
      setPublished(material.published || false);
    }
  }, [material]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title || title.trim().length < 3) {
      newErrors.title = "Judul minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({ title: title.trim(), published, content: content.trim() });
  };

  if (!material) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Sub-Materi</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Ubah judul dan status publikasi
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Judul Sub-Materi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Gizi Seimbang untuk Balita"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#578FCA] focus:border-[#578FCA] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 ${
                  errors.title ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-600">
                Minimal 3 karakter. Gunakan judul yang jelas dan deskriptif.
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Konten <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis deskripsi atau pengantar untuk sub-materi ini..."
                disabled={isSubmitting}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA] focus:border-[#578FCA] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 resize-y"
              />
              <p className="mt-2 text-xs text-gray-600">
                Deskripsi sub-materi yang akan ditampilkan kepada pengguna.
              </p>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Status Publikasi
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Terbitkan sub-materi agar dapat diakses oleh pengguna
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                disabled={isSubmitting}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  published ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    published ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
