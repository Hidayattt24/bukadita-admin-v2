import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Phone,
  Shield,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { User, PaginationData } from "./types.ts";

interface UserTableProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  pagination: PaginationData;
  itemsPerPage: number | "all";
  isSelf: (user: User) => boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

export default function UserTable({
  users,
  loading,
  searchTerm,
  pagination,
  itemsPerPage,
  isSelf,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
}: UserTableProps) {
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

  // Component untuk menampilkan foto profil atau avatar fallback
  const UserAvatar = ({ user }: { user: User }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Jika tidak ada profil_url atau gambar error, tampilkan avatar dengan inisial
    if (!user.profil_url || imageError) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white font-semibold">
          {getAvatarText(user.full_name)}
        </div>
      );
    }

    // Jika ada profil_url, tampilkan foto profil
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100">
        {/* Tampilkan avatar sementara gambar loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white font-semibold text-xs">
            {getAvatarText(user.full_name)}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.profil_url}
          alt={user.full_name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onError={() => {
            console.error(`Failed to load image for ${user.full_name}:`, user.profil_url);
            setImageError(true);
          }}
          onLoad={() => {
            console.log(`Successfully loaded image for ${user.full_name}`);
            setImageLoaded(true);
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-slate-200 overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center py-12 sm:py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#27548A] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-slate-600 font-medium text-sm sm:text-base">
              Memuat data pengguna...
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Table View - Scrollable on Mobile */}
          <div className="overflow-x-auto text-slate-700">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Telepon
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Registrasi
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <UserAvatar user={user} />
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                          {user.full_name || "Tidak ada nama"}
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                        <span className="text-[10px] sm:text-xs md:text-sm">{user.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-gradient-to-r from-[#27548A]/20 to-[#578FCA]/20 text-[#27548A] border border-[#27548A]/30"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">
                          {user.role === "admin"
                            ? "Ketua Posyandu / Admin"
                            : user.role === "superadmin"
                            ? "Superadmin"
                            : "Kader"}
                        </span>
                        <span className="sm:hidden">
                          {user.role === "admin"
                            ? "Admin"
                            : user.role === "superadmin"
                            ? "Super"
                            : "Kader"}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                        <span className="text-[10px] sm:text-xs md:text-sm">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => onView(user)}
                          className="p-1 sm:p-1.5 md:p-2 text-[#27548A] hover:bg-blue-50 rounded-md sm:rounded-lg transition-all hover:scale-110"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => onEdit(user)}
                          className="p-1 sm:p-1.5 md:p-2 text-green-600 hover:bg-green-50 rounded-md sm:rounded-lg transition-all hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(user)}
                          className={`p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg transition-all ${
                            isSelf(user)
                              ? "text-slate-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50 hover:scale-110"
                          }`}
                          title={
                            isSelf(user)
                              ? "Tidak dapat menghapus akun sendiri"
                              : "Hapus"
                          }
                          disabled={isSelf(user)}
                        >
                          <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State with Animation */}
          {!loading && users.length === 0 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12 sm:py-16 px-4"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="mb-4 sm:mb-6"
                >
                  <Users className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-slate-300" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                  Tidak Ada Pengguna
                </h3>
                <p className="text-sm sm:text-base text-slate-500 text-center max-w-md px-4">
                  {searchTerm
                    ? `Tidak ditemukan pengguna dengan kata kunci "${searchTerm}"`
                    : "Belum ada pengguna yang terdaftar di sistem"}
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}

      {/* Modern Pagination */}
      {!loading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t-2 border-slate-100 gap-3 sm:gap-4 bg-slate-50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <label
              htmlFor="itemsPerPage"
              className="text-xs sm:text-sm text-slate-700 font-medium whitespace-nowrap"
            >
              Tampilkan:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(e.target.value)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] bg-white font-medium text-slate-700 cursor-pointer transition-all"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">Semua</option>
            </select>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">
              {itemsPerPage === "all"
                ? `Menampilkan semua ${pagination.total} pengguna`
                : `Menampilkan ${Math.min(
                    (pagination.page - 1) * pagination.limit + 1,
                    pagination.total
                  )} - ${Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )} dari ${pagination.total}`}
            </span>
          </div>

          {/* Pagination Buttons */}
          {itemsPerPage !== "all" && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                <span className="hidden sm:inline">Halaman {pagination.page} dari {pagination.totalPages}</span>
                <span className="sm:hidden">{pagination.page}/{pagination.totalPages}</span>
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
