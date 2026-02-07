import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Plus,
  Edit,
  Clock,
  BookOpen,
  Tag,
  FileText,
} from "lucide-react";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface ModuleFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  formData: {
    title: string;
    description: string;
    published: boolean;
    durationLabel: string;
    durationMinutes: string;
    lessons: string;
    category: string;
  };
  formErrors: Record<string, string>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string | boolean) => void;
  submitting: boolean;
}

export default function ModuleFormModal({
  isOpen,
  isEditMode,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onChange,
  submitting,
}: ModuleFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 min-h-screen bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-3 md:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modern Header with Gradient */}
          <div className="bg-gradient-to-r from-[#27548A] to-[#578FCA] p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
                {isEditMode ? (
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                ) : (
                  <Folder className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-white truncate">
                  {isEditMode ? "Edit Modul" : "Tambah Modul Baru"}
                </h3>
                <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 line-clamp-2">
                  {isEditMode
                    ? "Perbarui informasi modul di bawah ini"
                    : "Lengkapi formulir untuk menambahkan modul baru"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form
            onSubmit={onSubmit}
            className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-140px)]"
          >
            {/* Title Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Judul Modul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 ${
                  formErrors.title
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                placeholder="Masukkan judul modul (minimal 3 karakter)"
                required
                minLength={3}
              />
              {formErrors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span> {formErrors.title}
                </motion.p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Deskripsi{" "}
                <span className="text-slate-400 text-[10px] sm:text-xs font-normal">
                  (Opsional)
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 resize-none border-slate-200 hover:border-slate-300"
                placeholder="Masukkan deskripsi modul"
                rows={3}
              />
            </div>

            {/* Category Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Kategori{" "}
                <span className="text-slate-400 text-[10px] sm:text-xs font-normal">
                  (Opsional)
                </span>
                <InfoTooltip
                  title="Kategori Modul"
                  content="Kategori membantu mengelompokkan modul berdasarkan topik atau tema tertentu. Ini memudahkan pengguna untuk menemukan modul yang relevan."
                  example="Kesehatan Ibu, Kesehatan Anak, Gizi Balita, Imunisasi, dll."
                />
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => onChange("category", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 border-slate-200 hover:border-slate-300"
                placeholder="mis. Kesehatan Ibu"
              />
            </div>

            {/* Duration Label and Minutes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                  Label Durasi
                  <InfoTooltip
                    title="Label Durasi"
                    content="Label durasi adalah deskripsi waktu yang dibutuhkan untuk menyelesaikan modul dalam format yang mudah dipahami. Gunakan format yang fleksibel dan user-friendly."
                    example="4-6 minggu, 2 bulan, 1 semester, 3-4 hari, dll."
                  />
                </label>
                <input
                  type="text"
                  value={formData.durationLabel}
                  onChange={(e) => onChange("durationLabel", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 border-slate-200 hover:border-slate-300"
                  placeholder="mis. 4–6 minggu"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                  Durasi (menit)
                  <InfoTooltip
                    title="Durasi dalam Menit"
                    content="Estimasi total waktu yang dibutuhkan untuk menyelesaikan seluruh modul dalam satuan menit. Ini membantu pengguna merencanakan waktu belajar mereka."
                    example="120 menit (2 jam), 180 menit (3 jam), 60 menit (1 jam), dll."
                  />
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.durationMinutes}
                  onChange={(e) => onChange("durationMinutes", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 border-slate-200 hover:border-slate-300"
                  placeholder="mis. 120"
                />
              </div>
            </div>

            {/* Lessons Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Jumlah Pelajaran
                <InfoTooltip
                  title="Jumlah Pelajaran"
                  content="Total jumlah sesi atau topik pembelajaran yang ada dalam modul ini. Ini membantu pengguna memahami seberapa banyak materi yang akan mereka pelajari."
                  example="10 pelajaran, 5 sesi, 8 topik, dll. Jika modul memiliki 10 sub-materi, maka isi dengan angka 10."
                />
              </label>
              <input
                type="number"
                min={0}
                value={formData.lessons}
                onChange={(e) => onChange("lessons", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 border-slate-200 hover:border-slate-300"
                placeholder="mis. 10"
              />
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border-2 border-blue-200">
              <input
                id="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) => onChange("published", e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#27548A] bg-white border-2 border-slate-300 rounded focus:ring-2 focus:ring-[#27548A] focus:ring-offset-0 checked:bg-[#27548A] checked:border-[#27548A] cursor-pointer"
                style={{
                  accentColor: '#27548A'
                }}
              />
              <label htmlFor="published" className="text-xs sm:text-sm md:text-base text-[#27548A] font-semibold cursor-pointer">
                Terbitkan modul (modul akan terlihat oleh pengguna)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 md:pt-6 border-t-2 border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-slate-700 bg-slate-100 rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60"
              >
                {isEditMode ? (
                  <>
                    <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">{submitting ? "Menyimpan..." : "Update Modul"}</span>
                    <span className="sm:hidden">{submitting ? "..." : "Update"}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">{submitting ? "Menyimpan..." : "Tambah Modul"}</span>
                    <span className="sm:hidden">{submitting ? "..." : "Tambah"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
