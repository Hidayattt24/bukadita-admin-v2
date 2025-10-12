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
} from "lucide-react";
import { progressService, type QuizAttemptSummary, type UserProgress } from "@/lib/api/progress";
import { adminModulesApi, type ModuleItem } from "@/lib/api/admin";

export default function ProgressMonitoringPage() {
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
        const res = await adminModulesApi.list();
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

        // Create HTML for detailed view
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <TrendingUp className="w-5 h-5 opacity-90" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Progress & Attempts</h1>
        <p className="text-gray-600">Pantau progress pengguna dan hasil kuis</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_users_today}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kuis Diselesaikan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed_quizzes_total}</p>
            </div>
            <Trophy className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rata-rata Completion</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.average_completion_rate)}%</p>
            </div>
            <BookOpen className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("attempts")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "attempts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Quiz Attempts
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "progress"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              User Progress
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari pengguna atau kuis..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Semua Modul</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Memuat data...
          </div>
        ) : (
          <>
            {activeTab === "attempts" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pengguna
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kuis
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waktu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.user_full_name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {attempt.user_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attempt.quiz_title || `Quiz ${attempt.quiz_id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {attempt.correct_answers || 0}/{attempt.total_questions || 0}
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.score || 0}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attempt.passed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Lulus
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Tidak Lulus
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString('id-ID') : 'Belum selesai'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewAttemptDetail(attempt.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {attempts.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Tidak ada data attempt kuis ditemukan.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-6">
                  {userProgress.map((user) => (
                    <div key={user.user_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.user_full_name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-500">{user.user_email}</p>
                        </div>
                      </div>

                      {user.module_progress && user.module_progress.length > 0 ? (
                        <div className="space-y-3">
                          {user.module_progress.map((moduleProgress) => (
                            <div key={moduleProgress.module_id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {moduleProgress.module_title || `Module ${moduleProgress.module_id}`}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${moduleProgress.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {moduleProgress.completion_percentage}% Complete
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${moduleProgress.completed ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}
                                  style={{ width: `${moduleProgress.completion_percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada progress yang tercatat</p>
                      )}
                    </div>
                  ))}
                </div>

                {userProgress.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Tidak ada data progress pengguna ditemukan.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}