import { motion } from "framer-motion";
import { XCircle, BookOpen, Award } from "lucide-react";
import Image from "next/image";
import type { UserProgress } from "./types";

interface UserListModalProps {
  title: string;
  users: UserProgress[];
  onClose: () => void;
  onViewReadingProgress: (user: UserProgress) => void;
  onViewQuizHistory: (user: UserProgress) => void;
}

export default function UserListModal({
  title,
  users,
  onClose,
  onViewReadingProgress,
  onViewQuizHistory,
}: UserListModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl border-2 border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-lg sm:text-2xl font-bold truncate">{title}</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Total: {users.length} kader
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-2 sm:space-y-3">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                      {user.user_profil_url ? (
                        <Image
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-slate-200"
                          src={user.user_profil_url}
                          alt={user.user_name}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center border-2 border-slate-200">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {user.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user.user_name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{user.user_email}</p>
                      <div className="flex items-center gap-2 sm:gap-4 mt-1 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                        <span className="font-medium">
                          Modul: {user.completed_modules}/{user.total_modules}
                        </span>
                        <span className="font-medium">
                          Kuis: {user.total_quiz_passed} lulus / {user.total_quiz_failed} gagal
                        </span>
                        <span
                          className={`font-semibold ${
                            user.average_quiz_score >= 70
                              ? "text-green-600"
                              : user.average_quiz_score >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          Skor: {user.average_quiz_score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onViewReadingProgress(user);
                      }}
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:shadow-lg rounded-lg transition-all font-semibold"
                      title="Lihat Progress Bacaan"
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Bacaan</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onViewQuizHistory(user);
                      }}
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:shadow-lg rounded-lg transition-all font-semibold"
                      title="Lihat Riwayat Kuis"
                    >
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Kuis</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <p className="italic text-sm sm:text-base">Tidak ada data kader</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
