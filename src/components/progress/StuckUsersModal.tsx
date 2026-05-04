"use client";

import { motion } from "framer-motion";
import { X, Users, AlertTriangle, Mail, User } from "lucide-react";
import { useStuckUsersByModule } from "@/hooks/useProgressMonitoring";
import Image from "next/image";

interface StuckUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  moduleId: string;
}

export default function StuckUsersModal({
  isOpen,
  onClose,
  moduleTitle,
  moduleId,
}: StuckUsersModalProps) {
  // Use custom hook to fetch stuck users
  const { data: stuckUsers = [], isLoading } = useStuckUsersByModule(moduleId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  Kader yang Kesulitan
                </h2>
                <p className="text-sm text-white/90 line-clamp-2">{moduleTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : stuckUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600 font-medium">Tidak ada kader yang kesulitan</p>
              <p className="text-sm text-slate-500 mt-1">
                Semua kader berhasil menyelesaikan modul ini
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">
                  Total: <span className="font-bold text-red-600">{stuckUsers.length}</span> kader
                </p>
              </div>

              {stuckUsers.map((user, idx) => (
                <div
                  key={user.user_id}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border-2 border-slate-200 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                      {idx + 1}
                    </div>

                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {user.user_profil_url ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                          <Image
                            src={user.user_profil_url}
                            alt={user.user_name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            onError={(e) => {
                              // Fallback to default avatar if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-base mb-1">
                        {user.user_name}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{user.user_email}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <span className="text-slate-600">Total Gagal:</span>
                          <span className="font-bold text-red-600">
                            {user.total_quiz_failed}x
                          </span>
                        </div>

                        {/* Failed Quizzes Detail */}
                        {user.failed_quizzes && user.failed_quizzes.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <p className="text-xs font-semibold text-slate-700 mb-1.5">
                              Kuis yang Gagal:
                            </p>
                            <div className="space-y-1">
                              {user.failed_quizzes.map((quiz) => (
                                <div
                                  key={quiz.quiz_id}
                                  className="flex items-center justify-between text-xs bg-red-50 rounded px-2 py-1"
                                >
                                  <span className="text-slate-700 truncate flex-1">
                                    {quiz.quiz_title}
                                  </span>
                                  <span className="font-bold text-red-600 ml-2">
                                    {quiz.failure_count}x
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Failure Badge */}
                    <div className="flex-shrink-0">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        user.total_quiz_failed >= 10
                          ? "bg-red-100 text-red-700"
                          : user.total_quiz_failed >= 5
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {user.total_quiz_failed >= 10
                          ? "Sangat Perlu Bantuan"
                          : user.total_quiz_failed >= 5
                          ? "Perlu Bantuan"
                          : "Kesulitan"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg transition-all"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
