import { motion } from "framer-motion";
import { XCircle, BookOpen, Award, Target } from "lucide-react";
import Image from "next/image";
import ModuleReadingProgress from "@/components/progress/ModuleReadingProgress";
import QuizHistoryDetail from "@/components/progress/QuizHistoryDetail";
import type { UserProgress } from "./types";
import { useUserDetailProgress } from "@/hooks/useProgressMonitoring";

interface UserDetailModalProps {
  user: UserProgress;
  onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  // Fetch detailed user progress from API
  const { data: userDetail, isLoading } = useUserDetailProgress(user.user_id);

  // Use detailed data if available, otherwise use the basic user data
  const displayUser = userDetail || user;
  const modulesProgress = displayUser.modules_progress || [];
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
        className="bg-white rounded-xl sm:rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg sm:text-2xl font-bold border-2 border-white/30 flex-shrink-0">
                {displayUser.user_profil_url ? (
                  <Image
                    src={displayUser.user_profil_url}
                    alt={displayUser.user_name}
                    width={64}
                    height={64}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  displayUser.user_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold truncate">{displayUser.user_name}</h2>
                <p className="text-blue-100 text-xs sm:text-sm truncate">{displayUser.user_email}</p>
                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1 truncate">
                  Terakhir aktif:{" "}
                  {new Date(displayUser.last_activity).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
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
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#578FCA]"></div>
            </div>
          ) : (
            <>
              {/* Progress Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <SummaryCard
                  icon={<BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />}
                  value={`${displayUser.completed_modules}/${displayUser.total_modules}`}
                  label="Modul Selesai"
                  color="blue"
                />
                <SummaryCard
                  icon={<Award className="w-4 h-4 sm:w-6 sm:h-6" />}
                  value={displayUser.total_quiz_passed}
                  label="Kuis Lulus"
                  color="green"
                />
                <SummaryCard
                  icon={<Target className="w-4 h-4 sm:w-6 sm:h-6" />}
                  value={`${displayUser.average_quiz_score}%`}
                  label="Rata-rata Skor"
                  color="purple"
                />
              </div>

              {/* Module Reading Progress */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                    Progress Bacaan per Modul
                  </h3>
                </div>
                <ModuleReadingProgress modules={modulesProgress} />
              </div>

              {/* Quiz History Detail */}
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                    Riwayat Kuis & Jawaban
                  </h3>
                </div>
                <QuizHistoryDetail modules={modulesProgress} />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: "blue" | "green" | "purple" | "orange";
}

function SummaryCard({ icon, value, label, color }: SummaryCardProps) {
  const colorConfig = {
    blue: {
      gradient: "from-[#578FCA] to-[#27548A]",
      iconBg: "bg-gradient-to-br from-[#578FCA] to-[#27548A]",
      textColor: "text-[#27548A]",
    },
    green: {
      gradient: "from-[#59AC77] to-[#3d8a59]",
      iconBg: "bg-gradient-to-br from-[#59AC77] to-[#3d8a59]",
      textColor: "text-[#3d8a59]",
    },
    purple: {
      gradient: "from-purple-600 to-purple-700",
      iconBg: "bg-gradient-to-br from-purple-600 to-purple-700",
      textColor: "text-purple-700",
    },
    orange: {
      gradient: "from-orange-600 to-orange-700",
      iconBg: "bg-gradient-to-br from-orange-600 to-orange-700",
      textColor: "text-orange-700",
    },
  };

  const config = colorConfig[color];

  return (
    <div className={`relative bg-gradient-to-br from-white to-slate-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex-shrink-0 p-2 sm:p-2.5 ${config.iconBg} rounded-lg text-white`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xl sm:text-2xl font-bold ${config.textColor} truncate`}>{value}</div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}
