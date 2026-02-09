import { motion } from "framer-motion";
import { XCircle, Award } from "lucide-react";
import Image from "next/image";
import QuizHistoryDetail from "@/components/progress/QuizHistoryDetail";
import type { UserProgress } from "./types";
import { useUserDetailProgress } from "@/hooks/useProgressMonitoring";

interface QuizHistoryModalProps {
  user: UserProgress;
  onClose: () => void;
}

export default function QuizHistoryModal({ user, onClose }: QuizHistoryModalProps) {
  // Fetch detailed user progress from API
  const { data: userDetail, isLoading } = useUserDetailProgress(user.user_id);

  // Use detailed data if available, otherwise use the basic user data
  const modulesProgress = userDetail?.modules_progress || [];

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
        className="bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg sm:text-2xl font-bold border-2 border-white/30 flex-shrink-0">
                {user.user_profil_url ? (
                  <Image
                    src={user.user_profil_url}
                    alt={user.user_name}
                    width={64}
                    height={64}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  user.user_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold truncate">{user.user_name}</h2>
                <p className="text-blue-100 text-xs sm:text-sm truncate">{user.user_email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-blue-200" />
                  <p className="text-[10px] sm:text-xs text-blue-200 truncate">
                    Riwayat Kuis & Jawaban
                  </p>
                </div>
              </div>
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
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <QuizHistorySkeleton />
          ) : (
            <QuizHistoryDetail modules={modulesProgress} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Skeleton Loading Component
function QuizHistorySkeleton() {
  return (
    <div className="space-y-3">
      {/* Search Bar Skeleton */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-lg border-2 border-slate-200 p-3 shadow-sm animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
          <div className="flex-1 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>

      {/* Module Cards Skeleton */}
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm animate-pulse"
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
