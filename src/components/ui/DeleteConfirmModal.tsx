"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  userName: string;
  userEmail: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  userName,
  userEmail,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 min-h-screen bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4 overflow-y-auto"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-3 sm:p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl"
              >
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{title}</h3>
                <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">Tindakan ini tidak dapat dibatalkan</p>
              </div>

              <button
                onClick={onCancel}
                className="text-white/80 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-6">
            <p className="text-slate-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
              Apakah Anda yakin ingin menghapus pengguna berikut?
            </p>

            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-3.5 md:p-4 rounded-lg sm:rounded-xl border-2 border-slate-200 mb-3 sm:mb-4"
            >
              <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                <div className="p-1.5 sm:p-2 bg-red-100 rounded-md sm:rounded-lg">
                  <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-xs sm:text-sm md:text-base truncate">
                    {userName}
                  </p>
                  <p className="text-slate-600 text-[10px] sm:text-xs md:text-sm truncate">{userEmail}</p>
                </div>
              </div>
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6"
            >
              <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-semibold text-[10px] sm:text-xs md:text-sm">Peringatan!</p>
                  <p className="text-red-700 text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1">
                    Semua data pengguna termasuk progress belajar dan riwayat kuis akan dihapus permanen.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onCancel}
                className="flex-1 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all font-semibold text-xs sm:text-sm md:text-base"
              >
                Batal
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onConfirm}
                className="flex-1 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                Ya, Hapus!
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
