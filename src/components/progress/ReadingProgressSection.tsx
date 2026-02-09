"use client";

import { useState } from "react";
import { BookOpen, Eye, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useReadingProgressStats } from "@/hooks/useProgressMonitoring";

interface ReadingProgress {
  user_id: string;
  user_name: string;
  user_email: string;
  module_id: string;
  module_title: string;
  sub_materis: Array<{
    sub_materi_id: string;
    sub_materi_title: string;
    total_poins: number;
    read_poins: number;
    scroll_completed_poins: number;
    read_percentage: number;
  }>;
  total_poins: number;
  read_poins: number;
  scroll_completed_poins: number;
  read_percentage: number;
}

export default function ReadingProgressSection() {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const { data: readingData, isLoading } = useReadingProgressStats();

  const toggleUserExpand = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const getReadingStatusColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getReadingStatusText = (percentage: number) => {
    if (percentage >= 80) return "Aktif Membaca";
    if (percentage >= 50) return "Cukup Aktif";
    return "Kurang Aktif";
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl">
          <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-lg font-semibold text-slate-800">
            Progress Bacaan per Modul
          </h3>
          <p className="text-xs md:text-sm text-slate-600 truncate">
            Pantau aktivitas membaca kader di setiap poin materi
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Data List */}
      {!isLoading && readingData && readingData.length > 0 && (
        <div className="space-y-3">
          {readingData.map((user: ReadingProgress) => (
            <div
              key={`${user.user_id}-${user.module_id}`}
              className="border-2 border-slate-200 rounded-lg overflow-hidden hover:border-purple-300 transition-all"
            >
              {/* User Header */}
              <div
                className="p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => toggleUserExpand(user.user_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm md:text-base truncate">
                        {user.user_name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getReadingStatusColor(
                          user.read_percentage
                        )}`}
                      >
                        {getReadingStatusText(user.read_percentage)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{user.user_email}</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      📚 {user.module_title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <div className="text-lg md:text-2xl font-bold text-purple-600">
                        {user.read_percentage}%
                      </div>
                      <div className="text-xs text-slate-600">
                        {user.scroll_completed_poins}/{user.total_poins} poin
                      </div>
                    </div>
                    {expandedUsers.has(user.user_id) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Progress Bacaan</span>
                    <span className="font-medium">{user.read_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${user.read_percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedUsers.has(user.user_id) && (
                <div className="p-4 bg-white border-t-2 border-slate-200">
                  <h5 className="text-sm font-semibold text-slate-800 mb-3">
                    Detail per Sub-Materi:
                  </h5>
                  <div className="space-y-3">
                    {user.sub_materis.map((sub) => (
                      <div
                        key={sub.sub_materi_id}
                        className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h6 className="font-medium text-slate-900 text-sm truncate">
                              {sub.sub_materi_title}
                            </h6>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {sub.read_poins}/{sub.total_poins} dibaca
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {sub.scroll_completed_poins}/{sub.total_poins} selesai
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-sm font-bold text-purple-600">
                              {sub.read_percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-purple-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${sub.read_percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!readingData || readingData.length === 0) && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Belum ada data progress bacaan</p>
        </div>
      )}
    </div>
  );
}
