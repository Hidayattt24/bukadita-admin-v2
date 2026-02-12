"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BookCheck,
  Plus,
  Folder,
  Trash2,
  Edit,
  Check,
  X,
  Clock,
  Target,
  FileQuestion,
  Eye,
} from "lucide-react";
import { useModules } from "@/hooks/useModules";
import {
  useQuizzesWithDetails,
  useCreateQuiz,
  useDeleteQuiz,
  useUpdateQuiz,
} from "@/hooks/useQuizzes";
import { useMaterials } from "@/hooks/useMaterials";
import { useToast } from "@/hooks/useToast";
import LoadingModal from "@/components/ui/LoadingModal";
import QuizPreviewModal from "@/components/quizzes/QuizPreviewModal";
import CustomSelect from "@/components/shared/CustomSelect";
import type { Quiz } from "@/lib/api";

interface ModernQuizzesPageProps {
  moduleId: string;
}

export default function ModernQuizzesPage({
  moduleId,
}: ModernQuizzesPageProps) {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();

  // React Query hooks
  const { data: modulesData } = useModules();
  const {
    data: quizzesData,
    isLoading,
    refetch,
  } = useQuizzesWithDetails({ module_id: moduleId });
  const { data: materialsData } = useMaterials({ module_id: moduleId });
  const createQuizMutation = useCreateQuiz();
  const deleteQuizMutation = useDeleteQuiz();
  const updateQuizMutation = useUpdateQuiz();

  // Get current module
  const currentModule = useMemo(() => {
    if (!modulesData) return null;
    const modulesList = Array.isArray(modulesData)
      ? modulesData
      : modulesData.items || modulesData.data || [];
    return modulesList.find(
      (m: { id: string | number }) => String(m.id) === String(moduleId),
    );
  }, [modulesData, moduleId]);

  // Transform materials for dropdown
  const subMateriOptions = useMemo(() => {
    if (!materialsData) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = materialsData as any;
    const materials = Array.isArray(data)
      ? data
      : data.items || data.data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return materials.map((m: any) => ({
      id: String(m.id),
      title: m.title,
    }));
  }, [materialsData]);

  // Transform quizzes data
  const quizzes = useMemo(() => {
    if (!quizzesData) return [];
    const dataWithQuizzes = quizzesData as unknown as {
      quizzes?: Quiz[];
      items?: Quiz[];
    };
    if (dataWithQuizzes.quizzes && Array.isArray(dataWithQuizzes.quizzes)) {
      return dataWithQuizzes.quizzes;
    } else if (dataWithQuizzes.items && Array.isArray(dataWithQuizzes.items)) {
      return dataWithQuizzes.items;
    } else if (Array.isArray(quizzesData)) {
      return quizzesData;
    }
    return [];
  }, [quizzesData]);

  // State
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    quiz: Quiz | null;
  }>({ isOpen: false, quiz: null });
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subMateriId, setSubMateriId] = useState("");
  const [timeLimit, setTimeLimit] = useState("30");
  const [passingScore, setPassingScore] = useState("70");
  const [published, setPublished] = useState(false);

  // Filtered quizzes
  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return quizzes;
    return quizzes.filter((q) => q.title.toLowerCase().includes(query));
  }, [quizzes, search]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: quizzes.length,
      published: quizzes.filter((q) => q.published).length,
      draft: quizzes.filter((q) => !q.published).length,
    }),
    [quizzes],
  );

  // Handle delete
  const handleDelete = (quiz: Quiz) => {
    setDeleteModal({ isOpen: true, quiz });
  };

  const confirmDelete = async () => {
    if (!deleteModal.quiz) return;

    const quizToDelete = deleteModal.quiz;
    setDeleteModal({ isOpen: false, quiz: null });
    setIsSubmitting(true);

    try {
      await deleteQuizMutation.mutateAsync(quizToDelete.id);
      toast.delete(
        "Berhasil Dihapus!",
        `Kuis <strong class="text-red-600">"${quizToDelete.title}"</strong> telah dihapus`,
      );
      await refetch();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Gagal Menghapus!", "Terjadi kesalahan saat menghapus kuis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubMateriId("");
    setTimeLimit("30");
    setPassingScore("70");
    setPublished(false);
  };

  // Handle create quiz
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subMateriId) {
      toast.error("Data Tidak Lengkap!", "Judul dan Sub-Materi harus diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createQuizMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        sub_materi_id: subMateriId,
        module_id: moduleId,
        time_limit_seconds: parseInt(timeLimit) * 60, // convert to seconds
        passing_score: parseInt(passingScore),
        published,
      });

      setShowForm(false);
      resetForm();
      toast.create(
        "Berhasil Ditambahkan!",
        `Kuis <strong class="text-emerald-600">"${title}"</strong> telah ditambahkan`,
      );

      await refetch();
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error(
        "Gagal Menambahkan!",
        "Terjadi kesalahan saat menambahkan kuis. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit quiz
  const handleEditQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingQuiz || !title.trim() || !subMateriId) {
      toast.error("Data Tidak Lengkap!", "Judul dan Sub-Materi harus diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateQuizMutation.mutateAsync({
        id: editingQuiz.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          sub_materi_id: subMateriId,
          time_limit_seconds: parseInt(timeLimit) * 60, // convert to seconds
          passing_score: parseInt(passingScore),
          published,
        },
      });

      setShowEdit(false);
      setEditingQuiz(null);
      resetForm();
      toast.success(
        "Berhasil Diupdate!",
        `Kuis <strong class="text-blue-600">"${title}"</strong> telah diperbarui`,
      );

      await refetch();
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error(
        "Gagal Mengupdate!",
        "Terjadi kesalahan saat mengupdate kuis. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle preview - fetch full quiz data with questions
  const handlePreview = async (quiz: Quiz) => {
    setLoadingPreview(true);
    try {
      // Import quizzesAPI dynamically to avoid circular dependency
      const { quizzesAPI } = await import("@/lib/api");
      const response = await quizzesAPI.get(quiz.id);
      
      if (response.ok && response.data) {
        setPreviewQuiz(response.data);
      } else {
        toast.error("Gagal Memuat Preview", "Tidak dapat memuat data kuis lengkap.");
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      toast.error("Gagal Memuat Preview", "Terjadi kesalahan saat memuat data kuis.");
    } finally {
      setLoadingPreview(false);
    }
  };

  // Open edit modal
  const openEditModal = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description || "");
    setSubMateriId(String(quiz.sub_materi_id || ""));
    setTimeLimit(String((quiz.time_limit_seconds || 1800) / 60)); // convert to minutes
    setPassingScore(String(quiz.passing_score || 70));
    setPublished(quiz.published || false);
    setShowEdit(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#578FCA] to-[#27548A]">
                    <th className="px-6 py-4 text-left">
                      <div className="h-4 bg-white/30 rounded w-32 animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="h-4 bg-white/30 rounded w-20 animate-pulse"></div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="h-4 bg-white/30 rounded w-24 animate-pulse"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="h-7 w-7 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="h-7 w-7 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-lg">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {currentModule?.title || "Kelola Kuis"}
              </h1>
              <p className="text-gray-600">
                Kelola dan atur kuis dalam modul ini
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Kuis
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
                <BookCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Published
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.published}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Draft</p>
                <p className="text-3xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <X className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#578FCA] to-[#27548A]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-white">Daftar Kuis</h2>
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    placeholder="Cari kuis..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#578FCA] hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Kuis</span>
                </button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Judul Kuis
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Info
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <BookCheck className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-lg font-medium">
                          Tidak ada kuis ditemukan
                        </p>
                        <p className="text-sm mt-1">
                          {search
                            ? "Coba kata kunci lain"
                            : "Mulai dengan menambah kuis baru"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((quiz, index) => (
                    <tr
                      key={quiz.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
                            <BookCheck className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {quiz.title}
                            </p>
                            {quiz.description && (
                              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                {quiz.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <FileQuestion className="w-3.5 h-3.5" />
                            <span>{quiz.questions?.length || 0} Soal</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {Math.floor((quiz.time_limit_seconds || 1800) / 60)} Menit
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Target className="w-3.5 h-3.5" />
                            <span>Passing: {quiz.passing_score || 70}%</span>
                          </div>
                          {/* NEW: Questions to Show Info */}
                          {quiz.questions_to_show && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                              <span>Tampil: {quiz.questions_to_show} soal</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            quiz.published
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {quiz.published ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Published
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(quiz)}
                            disabled={loadingPreview}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Lihat Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/modul/${moduleId}/kuis/${quiz.id}/soal`,
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
                            title="Kelola Soal"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(quiz)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(quiz)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Quiz Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <form onSubmit={handleCreateQuiz} className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex-shrink-0 bg-gradient-to-r from-[#578FCA] to-[#27548A] p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Tambah Kuis Baru
                      </h3>
                      <p className="text-sm text-white/80 mt-0.5">
                        Lengkapi form untuk menambah kuis
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Judul Kuis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all text-gray-900"
                    placeholder="Masukkan judul kuis"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all resize-none text-gray-900"
                    placeholder="Masukkan deskripsi kuis (opsional)"
                  />
                </div>

                {/* Sub Materi */}
                <CustomSelect
                  label="Sub-Materi"
                  options={subMateriOptions}
                  value={subMateriId}
                  onChange={setSubMateriId}
                  placeholder="-- Pilih Sub-Materi --"
                  required
                  colorScheme="blue"
                />

                {/* Time Limit & Passing Score */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Waktu (Menit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Passing Score (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Published */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#578FCA]/5 to-[#27548A]/5 rounded-lg border border-[#578FCA]/20">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 text-[#578FCA] border-gray-300 rounded focus:ring-[#578FCA] cursor-pointer"
                  />
                  <label
                    htmlFor="published"
                    className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                  >
                    Publish kuis sekarang
                  </label>
                  {published && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      <Check className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex-shrink-0 border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Kuis"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEdit && editingQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <form onSubmit={handleEditQuiz} className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Edit Kuis
                      </h3>
                      <p className="text-sm text-white/80 mt-0.5">
                        Perbarui informasi kuis
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEdit(false);
                      setEditingQuiz(null);
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Same as Add Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Judul Kuis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-900"
                    placeholder="Masukkan judul kuis"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none text-gray-900"
                    placeholder="Masukkan deskripsi kuis (opsional)"
                  />
                </div>

                {/* Sub Materi */}
                <CustomSelect
                  label="Sub-Materi"
                  options={subMateriOptions}
                  value={subMateriId}
                  onChange={setSubMateriId}
                  placeholder="-- Pilih Sub-Materi --"
                  required
                  colorScheme="amber"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Waktu (Menit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Passing Score (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-lg border border-amber-500/20">
                  <input
                    type="checkbox"
                    id="published-edit"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="published-edit"
                    className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                  >
                    Publish kuis sekarang
                  </label>
                  {published && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      <Check className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex-shrink-0 border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEdit(false);
                      setEditingQuiz(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Menyimpan..." : "Update Kuis"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  Konfirmasi Hapus
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Apakah Anda yakin ingin menghapus kuis ini?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Kuis:</p>
              <p className="font-semibold text-gray-800">
                {deleteModal.quiz?.title}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, quiz: null })}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewQuiz && (
        <QuizPreviewModal
          quiz={previewQuiz}
          onClose={() => setPreviewQuiz(null)}
        />
      )}

      {/* Loading Preview Modal */}
      {loadingPreview && (
        <LoadingModal
          isOpen={loadingPreview}
          title="Memuat Preview..."
          message="Sedang memuat data kuis lengkap..."
        />
      )}

      <LoadingModal
        isOpen={isSubmitting}
        title={
          deleteModal.quiz
            ? "Menghapus..."
            : editingQuiz
              ? "Mengupdate..."
              : "Menyimpan..."
        }
        message={
          deleteModal.quiz
            ? "Sedang menghapus kuis..."
            : editingQuiz
              ? "Sedang mengupdate kuis..."
              : "Sedang menyimpan kuis baru..."
        }
      />

      <ToastContainer />
    </div>
  );
}
