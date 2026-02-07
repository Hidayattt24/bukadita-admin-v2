import Modal from "@/components/shared/Modal";
import { Shield, Phone, Mail, Calendar, MapPin } from "lucide-react";
import type { User } from "./types.ts";

interface UserDetailModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export default function UserDetailModal({
  isOpen,
  user,
  onClose,
}: UserDetailModalProps) {
  const getAvatarText = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Format tidak valid";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg" showCloseButton={false} hideHeader={true}>
      <div className="text-black/80">
        {/* Modern Header with Gradient - Full Width */}
        <div className="bg-gradient-to-r from-[#3b6fa8] to-[#5a8ec4] rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white p-1 shadow-xl">
                {user.profil_url ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.profil_url}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl"
                      style={{ display: "none" }}
                    >
                      {getAvatarText(user.full_name)}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl">
                    {getAvatarText(user.full_name)}
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">
                {user.full_name}
              </h3>
              <p className="text-white/95 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 truncate">
                {user.email}
              </p>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                <span className="text-white font-semibold text-[10px] sm:text-xs md:text-sm">
                  {user.role === "admin"
                    ? "Ketua Posyandu / Admin"
                    : user.role === "superadmin"
                    ? "Superadmin"
                    : "Kader"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details - Compact Grid */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">
                  Nomor Telepon
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 pl-4 sm:pl-5 md:pl-6">
                {user.phone || "Tidak ada nomor telepon"}
              </p>
            </div>

            <div className="p-2 sm:p-2.5 md:p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Email</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 pl-4 sm:pl-5 md:pl-6 break-all">
                {user.email}
              </p>
            </div>

            <div className="p-2 sm:p-2.5 md:p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">
                  Tanggal Registrasi
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 pl-4 sm:pl-5 md:pl-6">
                {formatDate(user.created_at)}
              </p>
            </div>

            <div className="p-2 sm:p-2.5 md:p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">
                  Tanggal Lahir
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 pl-4 sm:pl-5 md:pl-6">
                {formatDate(user.date_of_birth) || "Belum diisi"}
              </p>
            </div>

            {/* Address Field - Full Width */}
            <div className="p-2 sm:p-2.5 md:p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white md:col-span-2">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Alamat</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 pl-4 sm:pl-5 md:pl-6">
                {user.address || "Tidak ada alamat"}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3 sm:pt-4 mt-3 sm:mt-4 border-t-2 border-slate-200">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#3b6fa8] to-[#5a8ec4] text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold text-xs sm:text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
