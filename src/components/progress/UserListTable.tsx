import { BookOpen, Award, Search, ChevronDown, ChevronUp } from "lucide-react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import type { UserProgress } from "./types";

interface UserListTableProps {
  users: UserProgress[];
  isLoading?: boolean;
  onViewReadingProgress: (user: UserProgress) => void;
  onViewQuizHistory: (user: UserProgress) => void;
}

export default function UserListTable({
  users,
  isLoading = false,
  onViewReadingProgress,
  onViewQuizHistory,
}: UserListTableProps) {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const toggleExpand = (userId: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kader
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kuis per Modul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Progress Modul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                    <div className="h-3 bg-gray-200 rounded w-36"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kader
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kuis per Modul
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress Modul
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detail
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="inline-block mb-4"
                  >
                    <Search className="w-16 h-16 text-slate-300 mx-auto" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-semibold text-slate-700 mb-2"
                  >
                    Tidak Ada Kader Ditemukan
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-slate-500"
                  >
                    Coba ubah kata kunci pencarian atau filter status
                  </motion.p>
                </motion.div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.user_profil_url ? (
                        <Image
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.user_profil_url}
                          alt={user.user_name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.user_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.user_email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1 max-w-xs">
                    {user.module_quiz_summary && user.module_quiz_summary.length > 0 ? (
                      <>
                        {/* Show first 3 modules or all if expanded */}
                        {(expandedUsers.has(user.user_id) 
                          ? user.module_quiz_summary 
                          : user.module_quiz_summary.slice(0, 3)
                        ).map((module) => (
                          <div key={module.module_id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 truncate mr-2" title={module.module_title}>
                              {module.module_title.length > 20 
                                ? module.module_title.substring(0, 20) + '...' 
                                : module.module_title}
                            </span>
                            <span className={`font-semibold whitespace-nowrap ${
                              module.quizzes_passed === module.total_quizzes && module.total_quizzes > 0
                                ? "text-green-600"
                                : module.quizzes_passed > 0
                                ? "text-yellow-600"
                                : "text-gray-400"
                            }`}>
                              {module.quizzes_passed}/{module.total_quizzes}
                            </span>
                          </div>
                        ))}
                        
                        {/* Show expand/collapse button if more than 3 modules */}
                        {user.module_quiz_summary.length > 3 && (
                          <button
                            onClick={() => toggleExpand(user.user_id)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 transition-colors"
                          >
                            {expandedUsers.has(user.user_id) ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Sembunyikan
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                +{user.module_quiz_summary.length - 3} modul lainnya
                              </>
                            )}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-gray-400">Belum ada data</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {user.completed_modules}/{user.total_modules} selesai
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.in_progress_modules} sedang berjalan
                      </div>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#e5e7eb"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke={
                            user.completed_modules === user.total_modules
                              ? "#10b981"
                              : user.completed_modules > 0
                              ? "#f59e0b"
                              : "#ef4444"
                          }
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${((user.completed_modules / user.total_modules) * 125.6)} 125.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewReadingProgress(user)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm"
                      title="Lihat Progress Bacaan"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden lg:inline">Bacaan</span>
                    </button>
                    <button
                      onClick={() => onViewQuizHistory(user)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm"
                      title="Lihat Riwayat Kuis"
                    >
                      <Award className="w-4 h-4" />
                      <span className="hidden lg:inline">Kuis</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "struggling" | "inactive" }) {
  const statusConfig = {
    active: {
      label: "Aktif",
      className: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    struggling: {
      label: "Perlu Perhatian",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    inactive: {
      label: "Belum Aktif",
      className: "bg-red-100 text-red-800 border-red-200",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
