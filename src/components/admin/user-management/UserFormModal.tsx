import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Plus,
  Edit,
} from "lucide-react";
import type { UserFormData } from "./types";
import CustomRoleSelect from "./CustomRoleSelect";
import CustomDatePicker from "./CustomDatePicker";

interface UserFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  formData: UserFormData;
  formErrors: Record<string, string>;
  roleFilter: string;
  canManageAdmin: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof UserFormData, value: string) => void;
}

export default function UserFormModal({
  isOpen,
  isEditMode,
  formData,
  formErrors,
  roleFilter,
  canManageAdmin,
  onClose,
  onSubmit,
  onChange,
}: UserFormModalProps) {
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
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-white truncate">
                  {isEditMode
                    ? "Edit Pengguna"
                    : roleFilter === "admin"
                    ? "Tambah Ketua Posyandu / Admin Baru"
                    : "Tambah Kader Baru"}
                </h3>
                <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 line-clamp-2">
                  {isEditMode
                    ? "Perbarui informasi pengguna di bawah ini"
                    : "Lengkapi formulir di bawah untuk menambahkan pengguna baru"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form
            onSubmit={onSubmit}
            className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-140px)]"
          >
            {/* Email Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 ${
                  formErrors.email
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                placeholder="contoh@email.com"
                required
              />
              {formErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span> {formErrors.email}
                </motion.p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => onChange("full_name", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 ${
                  formErrors.full_name
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                placeholder="Masukkan nama lengkap"
                required
              />
              {formErrors.full_name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span> {formErrors.full_name}
                </motion.p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 ${
                  formErrors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                placeholder="08123456789"
                required
              />
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span> {formErrors.phone}
                </motion.p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Role <span className="text-red-500">*</span>
              </label>
              <CustomRoleSelect
                value={formData.role}
                onChange={(value) => onChange("role", value)}
                canManageAdmin={canManageAdmin}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Password{" "}
                {isEditMode ? (
                  <span className="text-slate-400 text-[10px] sm:text-xs font-normal">
                    (Opsional)
                  </span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 ${
                  formErrors.password
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                placeholder={
                  isEditMode
                    ? "Kosongkan jika tidak ingin mengubah"
                    : "Minimal 6 karakter"
                }
                required={!isEditMode}
              />
              {formErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span> {formErrors.password}
                </motion.p>
              )}
              {isEditMode && (
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                  Kosongkan jika tidak ingin mengubah password
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Alamat{" "}
                <span className="text-slate-400 text-[10px] sm:text-xs font-normal">
                  (Opsional)
                </span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => onChange("address", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all text-slate-700 resize-none ${
                  formErrors.address
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                placeholder="Masukkan alamat lengkap (maksimal 500 karakter)"
                rows={3}
                maxLength={500}
              />
              {formErrors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span> {formErrors.address}
                </motion.p>
              )}
              <p className="text-slate-500 text-[10px] sm:text-xs mt-1 sm:mt-2">
                {formData.address.length}/500 karakter
              </p>
            </div>

            {/* Date of Birth Field */}
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#27548A]" />
                Tanggal Lahir{" "}
                <span className="text-slate-400 text-[10px] sm:text-xs font-normal">
                  (Opsional)
                </span>
              </label>
              <CustomDatePicker
                value={formData.date_of_birth}
                onChange={(value) => onChange("date_of_birth", value)}
                error={formErrors.date_of_birth}
              />
              {formErrors.date_of_birth && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-1"
                >
                  <span className="font-medium">⚠</span>{" "}
                  {formErrors.date_of_birth}
                </motion.p>
              )}
            </div>

            {/* Modern Action Buttons */}
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
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-1.5 sm:gap-2"
              >
                {isEditMode ? (
                  <>
                    <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Update Pengguna</span>
                    <span className="sm:hidden">Update</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">
                      {roleFilter === "admin"
                        ? "Tambah Ketua Posyandu / Admin"
                        : "Tambah Kader"}
                    </span>
                    <span className="sm:hidden">
                      {roleFilter === "admin" ? "Tambah Admin" : "Tambah Kader"}
                    </span>
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
