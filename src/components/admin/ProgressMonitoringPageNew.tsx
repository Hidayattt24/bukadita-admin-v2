"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Users,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  TrendingUp,
  Filter,
  BarChart3,
  Target,
  Award,
  Activity,
} from "lucide-react";
import { progressService, type QuizAttemptSummary, type UserProgress } from "@/lib/api/progress";
import { modulesAPI, type Module } from "@/lib/api";

type ModuleItem = Module;

export default function ProgressMonitoringPageNew() {
  const [activeTab, setActiveTab] = useState<"attempts" | "progress">("attempts");
  const [attempts, setAttempts] = useState<QuizAttemptSummary[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users_today: 0,
    total_quizzes: 0,
    completed_quizzes_total: 0,
    average_completion_rate: 0,
  });

  // Filters
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load modules for filter
  useEffect(() => {
    const loadModules = async () => {
      try {
        const res = await modulesAPI.list();
        if (res.ok) {
          const data = res.data as { items?: ModuleItem[]; data?: ModuleItem[] };
          const items = data.items || data.data || [];
          setModules(items);
        }
      } catch (error) {
        console.error("Error loading modules:", error);
      }
    };
    loadModules();
  }, []);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await progressService.getProgressStats();
        if (res.ok) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };
    loadStats();
  }, []);

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "attempts") {
          const params = {
            page: currentPage,
            limit: 20,
            ...(selectedModule && { module_id: selectedModule }),
            ...(searchTerm && { search: searchTerm }),
          };
          const res = await progressService.getQuizAttempts(params);
          if (res.ok) {
            setAttempts(res.data.items);
            setTotalPages(Math.ceil(res.data.pagination.total / res.data.pagination.limit) || 1);
          }
        } else {
          const params = {
            page: currentPage,
            limit: 20,
            ...(selectedModule && { module_id: selectedModule }),
            ...(searchTerm && { search: searchTerm }),
          };
          const res = await progressService.getAllUsersProgress(params);
          if (res.ok) {
            setUserProgress(res.data.items);
            setTotalPages(Math.ceil(res.data.pagination.total / res.data.pagination.limit) || 1);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat data' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, selectedModule, searchTerm, currentPage]);

  const handleViewAttemptDetail = async (attemptId: string | number) => {
    try {
      const res = await progressService.getQuizAttemptDetail(attemptId);
      if (res.ok) {
        const attempt = res.data;

        const answersHtml = attempt.answers?.map((answer, index) => `
          <div class="mb-4 p-3 border rounded ${answer.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
            <div class="font-medium mb-2">${index + 1}. ${answer.question_text || 'Pertanyaan ' + (index + 1)}</div>
            <div class="text-sm">
              <div class="mb-1">Jawaban: ${answer.selected_option || `Opsi ${answer.selected_index + 1}`}</div>
              ${answer.correct_option ? `<div class="text-green-700">Jawaban benar: ${answer.correct_option}</div>` : ''}
              <div class="font-medium ${answer.is_correct ? 'text-green-700' : 'text-red-700'}">
                ${answer.is_correct ? '✓ Benar' : '✗ Salah'}
              </div>
            </div>
          </div>
        `).join('') || 'Tidak ada detail jawaban';

        await Swal.fire({
          title: `Detail Attempt - ${attempt.quiz_title || 'Kuis'}`,
          html: `
            <div class="text-left">
              <div class="mb-4 p-4 bg-gray-50 rounded">
                <div><strong>User:</strong> ${attempt.user_full_name || 'Unknown'} (${attempt.user_email || 'No email'})</div>
                <div><strong>Skor:</strong> ${attempt.score || 0}/${attempt.total_questions || 0} (${attempt.passed ? 'LULUS' : 'TIDAK LULUS'})</div>
                <div><strong>Waktu:</strong> ${attempt.started_at ? new Date(attempt.started_at).toLocaleString('id-ID') : 'Unknown'}</div>
              </div>
              <div class="max-h-96 overflow-y-auto">
                ${answersHtml}
              </div>
            </div>
          `,
          width: 800,
          confirmButtonText: 'Tutup',
        });
      }
    } catch (error) {
      console.error("Error loading attempt detail:", error);
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat detail attempt' });
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monitoring Progress & Attempts</h1>
            <p className="text-gray-600 mt-1">Pantau progress pengguna dan hasil kuis secara real-time</p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.total_users}</p>
              <p className="text-blue-100 text-sm mt-1">Total Pengguna</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
            <Activity className="w-4 h-4" />
            <span>Terdaftar di sistem</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.active_users_today}</p>
              <p className="text-green-100 text-sm mt-1">Aktif Hari Ini</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
            <TrendingUp className="w-4 h-4" />
            <span>Pengguna online</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.completed_quizzes_total}</p>
              <p className="text-purple-100 text-sm mt-1">Kuis Diselesaikan</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
            <Award className="w-4 h-4" />
            <span>Total attempts</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{Math.round(stats.average_completion_rate)}%</p>
              <p className="text-orange-100 text-sm mt-1">Completion Rate</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
            <BookOpen className="w-4 h-4" />
            <span>Rata-rata progress</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Tab Navigation with Modern Design */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <nav className="flex px-6">
            <button
              onClick={() => {
                setActiveTab("attempts");
                setCurrentPage(1);
              }}
              className={`relative px-8 py-4 text-sm font-semibold transition-all ${
                activeTab === "attempts"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>Quiz Attempts</span>
              </div>
              {activeTab === "attempts" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("progress");
                setCurrentPage(1);
              }}
              className={`relative px-8 py-4 text-sm font-semibold transition-all ${
                activeTab === "progress"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>User Progress</span>
              </div>
              {activeTab === "progress" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>

        {/* Filters Section */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pengguna atau kuis..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedModule}
                  onChange={(e) => {
                    setSelectedModule(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all shadow-sm appearance-none"
                >
                  <option value="">Semua Modul</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center text-gray-500">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium">Memuat data...</p>
            </div>
          ) : (
            <>
              {activeTab === "attempts" ? (
                <div className="space-y-4">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {(attempt.user_full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {attempt.user_full_name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-500">{attempt.user_email}</p>
                            <p className="text-sm font-medium text-blue-600 mt-1">
                              {attempt.quiz_title || `Quiz ${attempt.quiz_id}`}
                            </p>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {attempt.correct_answers || 0}/{attempt.total_questions || 0}
                            </div>
                            <div className="text-sm text-gray-500">Benar</div>
                            <div className="text-lg font-semibold text-blue-600 mt-1">
                              {attempt.score || 0}%
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {attempt.passed ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-green-100 rounded-full">
                                  <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-700">LULUS</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-red-100 rounded-full">
                                  <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <span className="text-xs font-semibold text-red-700">TIDAK LULUS</span>
                              </div>
                            )}
                          </div>

                          {/* Date & Action */}
                          <div className="flex flex-col gap-2">
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString('id-ID') : 'Belum selesai'}
                            </div>
                            <button
                              onClick={() => handleViewAttemptDetail(attempt.id)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {attempts.length === 0 && (
                    <div className="py-16 text-center text-gray-500">
                      <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Tidak ada data attempt kuis ditemukan</p>
                      <p className="text-sm mt-2">Coba ubah filter atau tambahkan data baru</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {userProgress.map((user) => (
                    <div key={user.user_id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {(user.user_full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {user.user_full_name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-500">{user.user_email}</p>
                        </div>
                      </div>

                      {user.module_progress && user.module_progress.length > 0 ? (
                        <div className="space-y-4">
                          {user.module_progress.map((moduleProgress) => (
                            <div key={moduleProgress.module_id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <BookOpen className="w-5 h-5 text-blue-600" />
                                  <span className="font-semibold text-gray-900">
                                    {moduleProgress.module_title || `Module ${moduleProgress.module_id}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                    moduleProgress.completed 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {moduleProgress.completion_percentage}%
                                  </span>
                                  {moduleProgress.completed && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    moduleProgress.completed 
                                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  }`}
                                  style={{ width: `${moduleProgress.completion_percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Belum ada progress yang tercatat</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {userProgress.length === 0 && (
                    <div className="py-16 text-center text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Tidak ada data progress pengguna ditemukan</p>
                      <p className="text-sm mt-2">Coba ubah filter atau tambahkan data baru</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
