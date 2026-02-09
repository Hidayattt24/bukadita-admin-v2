"use client";

import { useMemo, useState, useCallback } from "react";
import type React from "react";
import Swal from "sweetalert2";
import { RefreshCw, Plus, Edit, X, Trash2 } from "lucide-react";
import DataTable from "../shared/DataTable";
import {
  materialsAPI,
  quizzesAPI,
  modulesAPI,
  type Material,
  type Quiz,
  type Poin,
} from "@/lib/api";
import MaterialPreview from "../materials/MaterialPreview";
import { useModules } from "@/hooks/useModules";
import { 
  useMaterials, 
  useCreateMaterial, 
  useUpdateMaterial, 
  useDeleteMaterial 
} from "@/hooks/useMaterials";
import { 
  useQuizzes, 
  useCreateQuiz, 
  useUpdateQuiz, 
  useDeleteQuiz 
} from "@/hooks/useQuizzes";

type ResourceType = "materi" | "kuis";

// Alias for backward compatibility
type MaterialRecord = Material;
type QuizRecord = Quiz;
type PoinDetailRecord = Poin;
type MaterialsListResponse = {
  items?: Material[];
  data?: Material[];
  pagination?: Material[];
};

// Interface untuk soal sementara (sebelum disimpan ke server)
interface TempQuestion {
  id: string; // temporary ID
  question_text: string;
  options: string[];
  correct_answer_index: number;
  explanation?: string;
}

export interface ModuleItemRow {
  id: string;
  title: string;
  description?: string;
  updated_at?: string;
  published?: boolean;
  contentLength?: number; // materi
  pointsCount?: number; // materi - jumlah poin
  questionCount?: number; // kuis
  content?: string; // materi - untuk preview
  poinDetails?: PoinDetailRecord[]; // materi - detail poin lengkap dengan media
}

interface ModuleItemsPageProps {
  moduleId: string;
  resource: ResourceType;
}

export default function ModuleItemsPage({
  moduleId,
  resource,
}: ModuleItemsPageProps) {
  const title = resource === "materi" ? "Materi" : "Kuis";
  const searchPlaceholder =
    resource === "materi" ? "Cari materi..." : "Cari kuis...";

  // React Query hooks
  const { data: modulesData } = useModules();
  const { data: materialsData, isLoading: loadingMaterials } = useMaterials(
    resource === "materi" ? { module_id: moduleId } : undefined
  );
  const { data: quizzesData, isLoading: loadingQuizzes } = useQuizzes(
    resource === "kuis" ? { module_id: moduleId } : undefined
  );
  
  const createMaterialMutation = useCreateMaterial();
  const updateMaterialMutation = useUpdateMaterial();
  const deleteMaterialMutation = useDeleteMaterial();
  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

  // Get current module name from modules data
  const currentModuleName = useMemo(() => {
    if (!modulesData) return "";
    const modulesList = Array.isArray(modulesData) 
      ? modulesData 
      : (modulesData.items || modulesData.data || []);
    const foundModule = modulesList.find((m: { id: string | number }) => String(m.id) === String(moduleId));
    return foundModule?.title || "";
  }, [modulesData, moduleId]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingItem, setEditingItem] = useState<ModuleItemRow | null>(null);

  // State untuk sub-materi options (khusus kuis)
  interface SubMateriOption {
    id: string | number;
    title: string;
    module_title: string;
    display_title: string;
    poin_count?: number;
  }
  const [subMateriOptions, setSubMateriOptions] = useState<SubMateriOption[]>(
    []
  );

  // State untuk quiz questions
  const [questions, setQuestions] = useState<TempQuestion[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  // Add form states
  const [aTitle, setATitle] = useState("");
  const [aPublished, setAPublished] = useState(false);
  const [aSlug, setASlug] = useState(""); // materi optional
  const [aContent, setAContent] = useState(""); // materi
  const [aDescription, setADescription] = useState(""); // kuis
  const [aSubMateriId, setASubMateriId] = useState(""); // kuis sub materi - REQUIRED
  const [aTimeLimit, setATimeLimit] = useState<string>("30"); // kuis time limit in minutes
  const [aPassingScore, setAPassingScore] = useState<string>("70"); // kuis passing score
  const [aSubmitting, setASubmitting] = useState(false);

  // Edit form states (separate from add form)
  const [eTitle, setETitle] = useState("");
  const [ePublished, setEPublished] = useState(false);
  const [eSlug, setESlug] = useState(""); // materi optional
  const [eContent, setEContent] = useState(""); // materi
  const [eDescription, setEDescription] = useState(""); // kuis
  const [eSubMateriId, setESubMateriId] = useState(""); // kuis sub materi - REQUIRED
  const [eTimeLimit, setETimeLimit] = useState<string>(""); // kuis time limit in seconds
  const [ePassingScore, setEPassingScore] = useState<string>(""); // kuis passing score
  const [eSubmitting, setESubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transform data from React Query to rows format
  const rows = useMemo(() => {
    if (resource === "materi" && materialsData) {
      const data = materialsData as MaterialsListResponse;
      let arr: MaterialRecord[] = [];
      if (Array.isArray(data)) {
        arr = data as MaterialRecord[];
      } else if (Array.isArray(data.items)) {
        arr = data.items;
      } else if (Array.isArray(data.data)) {
        arr = data.data;
      }

      return arr.map((m): ModuleItemRow => ({
        id: String(m.id),
        title: m.title,
        description: undefined,
        updated_at: m.updated_at || m.created_at,
        published: !!m.published,
        contentLength: typeof m.content === "string" ? m.content.length : 0,
        pointsCount: m.poin_details?.length || 0,
        content: typeof m.content === "string" ? m.content : undefined,
        poinDetails: m.poin_details || [],
      }));
    } else if (resource === "kuis" && quizzesData) {
      const responseData = quizzesData;
      let allQuizzes: QuizRecord[] = [];
      
      const dataWithQuizzes = responseData as unknown as {
        quizzes?: QuizRecord[];
        items?: QuizRecord[];
      };

      if (dataWithQuizzes.quizzes && Array.isArray(dataWithQuizzes.quizzes)) {
        allQuizzes = dataWithQuizzes.quizzes;
      } else if (dataWithQuizzes.items && Array.isArray(dataWithQuizzes.items)) {
        allQuizzes = dataWithQuizzes.items;
      } else if (Array.isArray(responseData)) {
        allQuizzes = responseData;
      }

      return allQuizzes.map((quiz): ModuleItemRow => ({
        id: String(quiz.id),
        title: quiz.title,
        description: quiz.description?.slice(0, 140),
        updated_at: quiz.updated_at || quiz.created_at,
        published: quiz.published || false,
        questionCount: quiz.questions?.length || 0,
      }));
    }
    return [];
  }, [resource, materialsData, quizzesData]);

  const isInitialLoading = resource === "materi" ? loadingMaterials : loadingQuizzes;

  // Preview modal states
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<ModuleItemRow | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");



  // Load sub-materi options when needed
  const loadSubMateriOptions = useCallback(async () => {
    if (resource === "kuis" && moduleId) {
      try {
        const res = await modulesAPI.get(moduleId);
        if (res.ok && res.data) {
          const subMateris = res.data.sub_materis || res.data.subMateris || [];
          const optionsWithPoinCount = await Promise.all(
            subMateris.map(async (subMateri: Material) => {
              let poinCount = 0;
              try {
                const materiDetail = await materialsAPI.get(subMateri.id);
                if (materiDetail.ok && materiDetail.data.poin_details) {
                  poinCount = materiDetail.data.poin_details.length;
                }
              } catch (error) {
                console.warn(`Failed to fetch poin count for ${subMateri.id}:`, error);
              }

              return {
                id: subMateri.id,
                title: subMateri.title,
                module_title: res.data.title || currentModuleName || `Module ${moduleId}`,
                display_title: `${subMateri.title}${poinCount > 0 ? ` (${poinCount} poin)` : ""}`,
                poin_count: poinCount,
              };
            })
          );
          setSubMateriOptions(optionsWithPoinCount);
        }
      } catch (error) {
        console.error("Error loading sub-materi options:", error);
        setSubMateriOptions([]);
      }
    }
  }, [resource, moduleId, currentModuleName]);

  // Load sub-materi options when form is opened
  if (resource === "kuis" && (showAdd || showEdit) && subMateriOptions.length === 0) {
    loadSubMateriOptions();
  }

  // Manual refresh function
  const onManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refetch will be triggered automatically by React Query
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Filter data based on status and search term
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Apply status filter
    if (statusFilter === "published") {
      filtered = filtered.filter((row) => row.published === true);
    } else if (statusFilter === "draft") {
      filtered = filtered.filter((row) => row.published !== true);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (row) =>
          row.title.toLowerCase().includes(term) ||
          (row.description && row.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [rows, statusFilter, searchTerm]);

  type ColumnDef = {
    key: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, row: ModuleItemRow) => React.ReactNode;
  };
  const columns: ColumnDef[] = useMemo(() => {
    return [
      {
        key: "title",
        label: title,
        render: (_: unknown, row: ModuleItemRow) => (
          <div>
            {resource === "kuis" ? (
              <p className="font-semibold text-xl">{row.title}</p>
            ) : (
              <div className="font-medium text-gray-900">{row.title}</div>
            )}
            {row.description && (
              <div className="text-sm text-gray-500 truncate max-w-[360px]">
                {row.description}
              </div>
            )}
          </div>
        ),
      },
      {
        key: resource === "materi" ? "pointsCount" : "questionCount",
        label: resource === "materi" ? "Jumlah Poin Materi" : "Jumlah Soal",
        render: (val: number | undefined) => (
          <span className="text-sm text-gray-700">
            {val ?? 0} {resource === "materi" ? "poin materi" : "soal"}
          </span>
        ),
      },
      {
        key: "published",
        label: "Status",
        render: (v: boolean | undefined) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              v ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
            }`}
          >
            {v ? "Terbit" : "Draf"}
          </span>
        ),
      },
      {
        key: "updated_at",
        label: "Diubah",
        render: (val?: string) => (
          <span className="text-sm text-gray-700">
            {val ? new Date(val).toLocaleString("id-ID") : "-"}
          </span>
        ),
      },
    ];
  }, [resource, title]);

  const onAdd = () => setShowAdd((v) => !v);

  // Function to handle "Tambah Poin" action for materi and "Tambah Soal" for kuis
  const onTambahPoin = (row: ModuleItemRow) => {
    if (resource === "materi") {
      if (!row.id) {
        console.error("Row ID is missing:", row);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ID materi tidak ditemukan. Silakan refresh halaman dan coba lagi.",
        });
        return;
      }
      // Use nested structure: /admin/modul/[id]/materi/[materialId]/poin
      window.location.href = `/admin/modul/${moduleId}/materi/${row.id}/poin`;
    } else if (resource === "kuis") {
      if (!row.id) {
        console.error("Row ID is missing:", row);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ID kuis tidak ditemukan. Silakan refresh halaman dan coba lagi.",
        });
        return;
      }
      // Use nested structure: /admin/modul/[id]/kuis/[kuisId]/soal
      window.location.href = `/admin/modul/${moduleId}/kuis/${row.id}/soal`;
    }
  };

  // Function to handle "Preview" action for materi
  const onPreview = async (row: ModuleItemRow) => {
    if (resource === "materi") {
      // Check if we already have poin details with media in the row
      if (row.poinDetails && row.poinDetails.length > 0) {
        // Check if any poin has media data already loaded
        const hasMediaLoaded = row.poinDetails.some(
          (poin) => poin.poin_media && poin.poin_media.length > 0
        );

        if (hasMediaLoaded) {
          setPreviewItem(row);
          setShowPreview(true);
          return;
        }
      }

      // Fetch material with poin details
      try {
        const poinRes = await materialsAPI.get(row.id);
        if (poinRes.ok && poinRes.data.poin_details) {
          // Backend already returns complete data with media references
          const updatedRow = {
            ...row,
            poinDetails: poinRes.data.poin_details,
          };
          setPreviewItem(updatedRow);
          setShowPreview(true);
        } else {
          // Show preview even if no poin details
          setPreviewItem(row);
          setShowPreview(true);
        }
      } catch (error) {
        console.error("Error loading preview data:", error);
        // Fallback to current data
        setPreviewItem(row);
        setShowPreview(true);
      }
    } else if (resource === "kuis") {
      // Preview quiz with questions
      try {
        const quizRes = await quizzesAPI.get(row.id);
        if (quizRes.ok) {
          const updatedRow = {
            ...row,
            description: quizRes.data.description,
            questionCount: quizRes.data.questions?.length || 0,
            questions: quizRes.data.questions || [],
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPreviewItem(updatedRow as any);
          setShowPreview(true);
        } else {
          setPreviewItem(row);
          setShowPreview(true);
        }
      } catch (error) {
        console.error("Error loading quiz preview:", error);
        setPreviewItem(row);
        setShowPreview(true);
      }
    }
  };

  // Helper functions untuk quiz questions
  const resetQuizForm = () => {
    setATitle("");
    setADescription("");
    setASubMateriId("");
    setATimeLimit("30");
    setAPassingScore("70");
    setAPublished(false);
    setQuestions([]);
    setShowQuestionForm(false);
    setEditingQuestionId(null);
  };

  const addNewQuestion = () => {
    const newQuestion: TempQuestion = {
      id: `temp_${Date.now()}`,
      question_text: "",
      options: ["", "", "", ""],
      correct_answer_index: 0,
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
    setShowQuestionForm(true);
    setEditingQuestionId(newQuestion.id);
  };

  const updateQuestion = (
    questionId: string,
    updates: Partial<TempQuestion>
  ) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = async (questionId: string) => {
    const result = await Swal.fire({
      title: "Hapus Soal?",
      text: "Soal ini akan dihapus dari daftar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setQuestions(questions.filter((q) => q.id !== questionId));
      if (editingQuestionId === questionId) {
        setEditingQuestionId(null);
        setShowQuestionForm(false);
      }
    }
  };

  const editQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
    setShowQuestionForm(true);
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = aTitle.trim();
    if (!titleVal || titleVal.length < 3) {
      await Swal.fire({ icon: "warning", title: "Judul minimal 3 karakter" });
      return;
    }

    if (resource === "materi") {
      const contentVal = aContent.trim();
      if (!contentVal || contentVal.length < 10) {
        await Swal.fire({
          icon: "warning",
          title: "Konten minimal 10 karakter",
        });
        return;
      }
      setASubmitting(true);

      try {
        await createMaterialMutation.mutateAsync({
          title: titleVal,
          content: contentVal,
          module_id: String(moduleId),
          published: aPublished,
          slug: aSlug ? aSlug.trim() : undefined,
        });

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          timer: 900,
          showConfirmButton: false,
        });
        
        // reset & close
        setATitle("");
        setAContent("");
        setASlug("");
        setAPublished(false);
        setShowAdd(false);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error instanceof Error ? error.message : "Gagal membuat materi",
        });
      } finally {
        setASubmitting(false);
      }
      return;
    }

    // Kuis: create via backend API
    if (resource === "kuis") {
      if (!aSubMateriId) {
        await Swal.fire({
          icon: "warning",
          title: "Peringatan",
          text: "Sub materi harus dipilih",
        });
        return;
      }

      // Validasi soal jika ada
      if (questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.question_text.trim()) {
            await Swal.fire({
              icon: "warning",
              title: "Peringatan",
              text: `Soal ${i + 1}: Pertanyaan harus diisi`,
            });
            return;
          }
          const validOptions = q.options.filter((opt) => opt.trim());
          if (validOptions.length < 2) {
            await Swal.fire({
              icon: "warning",
              title: "Peringatan",
              text: `Soal ${i + 1}: Minimal harus ada 2 opsi jawaban`,
            });
            return;
          }
        }
      }

      // Validasi Sub Materi wajib dipilih
      if (!aSubMateriId || aSubMateriId.trim() === "") {
        await Swal.fire({
          icon: "warning",
          title: "Sub-Materi Wajib",
          text: "Silakan pilih sub-materi untuk kuis ini",
        });
        return;
      }

      const timeLimitSeconds = parseInt(aTimeLimit) * 60; // convert minutes to seconds
      const passingScoreNum = parseInt(aPassingScore);

      if (passingScoreNum < 0 || passingScoreNum > 100) {
        await Swal.fire({
          icon: "warning",
          title: "Peringatan",
          text: "Nilai kelulusan harus antara 0-100",
        });
        return;
      }

      setASubmitting(true);
      try {
        // 1. Buat kuis terlebih dahulu
        const payload = {
          module_id: moduleId,
          sub_materi_id: aSubMateriId,
          title: titleVal,
          description: aDescription || undefined,
          time_limit_seconds: timeLimitSeconds,
          passing_score: passingScoreNum,
          published: aPublished,
        };

        const createdQuiz = await createQuizMutation.mutateAsync(payload);

        // 2. Tambahkan soal-soal jika ada
        if (questions.length > 0) {
          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const validOptions = q.options.filter((opt) => opt.trim());

            await quizzesAPI.addQuestion(createdQuiz.id, {
              question_text: q.question_text.trim(),
              options: validOptions,
              correct_answer_index: Math.min(
                q.correct_answer_index,
                validOptions.length - 1
              ),
              explanation: q.explanation?.trim() || undefined,
              order_index: i + 1,
            });
          }
        }

        // 3. Reset form
        resetQuizForm();
        setShowAdd(false);

        const message =
          questions.length > 0
            ? `Kuis berhasil dibuat dengan ${questions.length} soal`
            : "Kuis berhasil dibuat";

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: message,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error creating quiz:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error instanceof Error ? error.message : "Terjadi kesalahan saat membuat kuis",
        });
      } finally {
        setASubmitting(false);
      }
      return;
    }
  };

  const onEdit = async (row: ModuleItemRow) => {
    setEditingItem(row);
    // Populate edit form dengan data existing (menggunakan state edit terpisah)
    setETitle(row.title);
    setEPublished(row.published || false);
    if (resource === "materi") {
      setEContent(row.content || "");
      setESlug(""); // slug tidak disimpan di row, biarkan kosong
    } else {
      setEDescription(row.description || "");
      setETimeLimit("");
      setEPassingScore("");
      setESubMateriId("");

      // Fetch quiz details to get current sub_materi_id, time_limit, passing_score, and questions
      try {
        const quizDetailsRes = await quizzesAPI.get(row.id);
        if (quizDetailsRes.ok) {
          const quiz = quizDetailsRes.data;
          setESubMateriId(String(quiz.sub_materi_id || ""));
          setETimeLimit(
            String(
              quiz.time_limit_seconds
                ? Math.floor(quiz.time_limit_seconds / 60)
                : ""
            )
          ); // convert seconds to minutes
          setEPassingScore(String(quiz.passing_score || ""));

          // Load existing questions for editing
          if (quiz.questions && quiz.questions.length > 0) {
            const loadedQuestions: TempQuestion[] = quiz.questions.map((q) => ({
              id: String(q.id), // Use actual question ID from backend
              question_text: q.question_text,
              options: q.options || [],
              correct_answer_index: q.correct_answer_index,
              explanation: q.explanation || "",
            }));
            setQuestions(loadedQuestions);
          } else {
            setQuestions([]);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch quiz details for editing:", error);
      }
    }
    setShowEdit(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const titleVal = eTitle.trim();
    if (!titleVal || titleVal.length < 3) {
      await Swal.fire({ icon: "warning", title: "Judul minimal 3 karakter" });
      return;
    }

    if (resource === "materi") {
      const contentVal = eContent.trim();
      if (!contentVal || contentVal.length < 10) {
        await Swal.fire({
          icon: "warning",
          title: "Konten minimal 10 karakter",
        });
        return;
      }

      setESubmitting(true);
      const payload = {
        title: titleVal,
        content: contentVal,
        published: ePublished,
        slug: eSlug ? eSlug.trim() : undefined,
      };

      try {
        await updateMaterialMutation.mutateAsync({ id: editingItem.id, data: payload });
        
        await Swal.fire({
          icon: "success",
          title: "Tersimpan",
          timer: 900,
          showConfirmButton: false,
        });

        // Reset edit form and close
        setETitle("");
        setEContent("");
        setESlug("");
        setEPublished(false);
        setShowEdit(false);
        setEditingItem(null);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error instanceof Error ? error.message : "Gagal memperbarui materi",
        });
      } finally {
        setESubmitting(false);
      }
      return;
    }

    // Kuis: validate required fields
    if (!eSubMateriId || eSubMateriId.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Sub-Materi Wajib",
        text: "Sub-materi harus dipilih untuk kuis",
      });
      return;
    }

    const timeLimitMinutes = parseInt(eTimeLimit);
    const passingScoreNum = parseInt(ePassingScore);

    if (eTimeLimit && (isNaN(timeLimitMinutes) || timeLimitMinutes < 1)) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Batas waktu harus berupa angka positif (dalam menit)",
      });
      return;
    }

    if (
      ePassingScore &&
      (isNaN(passingScoreNum) || passingScoreNum < 0 || passingScoreNum > 100)
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Nilai kelulusan harus antara 0-100",
      });
      return;
    }

    // Kuis: update via backend API
    setESubmitting(true);
    const payload = {
      sub_materi_id: eSubMateriId, // Wajib untuk kuis per sub-materi
      title: titleVal,
      description: eDescription || undefined,
      time_limit_seconds: eTimeLimit ? timeLimitMinutes * 60 : undefined,
      passing_score: ePassingScore ? passingScoreNum : undefined,
      published: ePublished,
    };

    try {
      await updateQuizMutation.mutateAsync({ id: editingItem.id, data: payload });

      // Update questions if any
      if (questions.length > 0) {
        // Get existing questions from backend to compare
        const quizDetailsRes = await quizzesAPI.get(editingItem.id);
        const existingQuestionIds =
          quizDetailsRes.ok && quizDetailsRes.data.questions
            ? quizDetailsRes.data.questions.map((q) => String(q.id))
            : [];

        // Update or create questions
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const validOptions = q.options.filter((opt) => opt.trim());

          const questionPayload = {
            question_text: q.question_text.trim(),
            options: validOptions,
            correct_answer_index: Math.min(
              q.correct_answer_index,
              validOptions.length - 1
            ),
            explanation: q.explanation?.trim() || undefined,
            order_index: i + 1,
          };

          const isExistingQuestion = existingQuestionIds.includes(q.id);

          if (isExistingQuestion) {
            await quizzesAPI.updateQuestion(q.id, questionPayload);
          } else {
            await quizzesAPI.addQuestion(editingItem.id, questionPayload);
          }
        }

        // Delete questions that were removed
        const currentQuestionIds = questions.map((q) => q.id);
        const questionsToDelete = existingQuestionIds.filter(
          (id) => !currentQuestionIds.includes(id)
        );

        for (const questionId of questionsToDelete) {
          await quizzesAPI.deleteQuestion(questionId);
        }
      }
    } catch (error) {
      console.error("Error updating questions:", error);
      setESubmitting(false);
      await Swal.fire({
        icon: "warning",
        title: "Kuis Tersimpan",
        text: "Kuis berhasil diperbarui, tetapi ada masalah saat memperbarui soal. Silakan coba edit lagi.",
      });
      return;
    }

    setESubmitting(false);

    // Small delay to ensure database commit is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    const message =
      questions.length > 0
        ? `Kuis berhasil diperbarui dengan ${questions.length} soal`
        : "Kuis berhasil diperbarui";

    await Swal.fire({
      icon: "success",
      title: "Tersimpan",
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });

    // Reset edit form and close
    setETitle("");
    setEDescription("");
    setESubMateriId("");
    setETimeLimit("");
    setEPassingScore("");
    setEPublished(false);
    setQuestions([]); // Reset questions
    setShowEdit(false);
    setEditingItem(null);
  };

  const onDelete = async (row: ModuleItemRow) => {
    const result = await Swal.fire({
      title: `Hapus ${title}?`,
      text: `Item \"${row.title}\" akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    if (resource === "materi") {
      try {
        await deleteMaterialMutation.mutateAsync(row.id);
        await Swal.fire({
          icon: "success",
          title: "Berhasil Dihapus",
          text: `Materi "${row.title}" berhasil dihapus.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error instanceof Error ? error.message : "Gagal menghapus materi",
        });
      }
    } else if (resource === "kuis") {
      try {
        await deleteQuizMutation.mutateAsync(row.id);
        await Swal.fire({
          icon: "success",
          title: "Berhasil Dihapus",
          text: `Kuis "${row.title}" berhasil dihapus.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error instanceof Error ? error.message : "Gagal menghapus kuis",
        });
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      {/* Add form section */}
      {showAdd && (
        <form
          onSubmit={submitAdd}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tambah {title} Baru
          </h2>
          {resource === "materi" ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-600">Judul *</label>
                <input
                  value={aTitle}
                  onChange={(e) => setATitle(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Judul minimal 3 karakter"
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Konten *</label>
                <textarea
                  value={aContent}
                  onChange={(e) => setAContent(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-32"
                  placeholder="Konten minimal 10 karakter"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="a-published"
                  type="checkbox"
                  checked={aPublished}
                  onChange={(e) => setAPublished(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="a-published" className="text-sm text-gray-700">
                  Terbitkan
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={aSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow disabled:opacity-60"
                >
                  {aSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Quiz Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Kuis *
                  </label>
                  <input
                    value={aTitle}
                    onChange={(e) => setATitle(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul kuis"
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={aDescription}
                    onChange={(e) => setADescription(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Deskripsi singkat kuis (opsional)"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sub-Materi untuk Kuis *{" "}
                    <span className="text-red-500">(Wajib)</span>
                  </label>
                  <select
                    value={aSubMateriId}
                    onChange={(e) => setASubMateriId(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Pilih Sub-Materi --</option>
                    {(Array.isArray(subMateriOptions)
                      ? subMateriOptions
                      : []
                    ).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.display_title}
                      </option>
                    ))}
                  </select>
                  {subMateriOptions.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Belum ada sub-materi. Silakan buat sub-materi terlebih
                      dahulu.
                    </p>
                  )}
                  {subMateriOptions.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ✓ Tersedia {subMateriOptions.length} sub-materi untuk
                      modul ini
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Batas Waktu (menit)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={aTimeLimit}
                      onChange={(e) => setATimeLimit(e.target.value)}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nilai Kelulusan (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={aPassingScore}
                      onChange={(e) => setAPassingScore(e.target.value)}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="70"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={aPublished}
                      onChange={(e) => setAPublished(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Publikasikan kuis
                    </span>
                  </label>
                </div>
              </div>

              {/* Questions Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">
                    Soal Kuis ({questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addNewQuestion}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Soal
                  </button>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Soal {index + 1}:{" "}
                              {question.question_text || "Belum diisi"}
                            </h4>
                            <div className="text-sm text-gray-600">
                              {
                                question.options.filter((opt) => opt.trim())
                                  .length
                              }{" "}
                              opsi jawaban
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => editQuestion(question.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit soal"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteQuestion(question.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus soal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Form */}
                {showQuestionForm &&
                  editingQuestionId &&
                  (() => {
                    const currentEditingQuestion = questions.find(
                      (q) => q.id === editingQuestionId
                    );
                    if (!currentEditingQuestion) return null;

                    return (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Edit Soal{" "}
                          {questions.findIndex(
                            (q) => q.id === editingQuestionId
                          ) + 1}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pertanyaan *
                            </label>
                            <textarea
                              value={currentEditingQuestion.question_text}
                              onChange={(e) =>
                                updateQuestion(editingQuestionId!, {
                                  question_text: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                              placeholder="Masukkan pertanyaan..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Opsi Jawaban *
                            </label>
                            {currentEditingQuestion.options.map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center gap-2 mb-2"
                                >
                                  <input
                                    type="radio"
                                    name={`correct_${editingQuestionId}`}
                                    checked={
                                      currentEditingQuestion.correct_answer_index ===
                                      optionIndex
                                    }
                                    onChange={() =>
                                      updateQuestion(editingQuestionId!, {
                                        correct_answer_index: optionIndex,
                                      })
                                    }
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...currentEditingQuestion.options,
                                      ];
                                      newOptions[optionIndex] = e.target.value;
                                      updateQuestion(editingQuestionId!, {
                                        options: newOptions,
                                      });
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Opsi ${optionIndex + 1}...`}
                                  />
                                  {currentEditingQuestion.options.length >
                                    2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions =
                                          currentEditingQuestion.options.filter(
                                            (_, i) => i !== optionIndex
                                          );
                                        const newCorrectIndex =
                                          currentEditingQuestion.correct_answer_index >=
                                          newOptions.length
                                            ? newOptions.length - 1
                                            : currentEditingQuestion.correct_answer_index;
                                        updateQuestion(editingQuestionId!, {
                                          options: newOptions,
                                          correct_answer_index: newCorrectIndex,
                                        });
                                      }}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                            {currentEditingQuestion.options.length < 6 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [
                                    ...currentEditingQuestion.options,
                                    "",
                                  ];
                                  updateQuestion(editingQuestionId!, {
                                    options: newOptions,
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                + Tambah Opsi
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Penjelasan (opsional)
                            </label>
                            <textarea
                              value={currentEditingQuestion.explanation || ""}
                              onChange={(e) =>
                                updateQuestion(editingQuestionId!, {
                                  explanation: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Penjelasan jawaban yang benar..."
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowQuestionForm(false);
                                setEditingQuestionId(null);
                              }}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                            >
                              Selesai
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={aSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors disabled:opacity-60"
                >
                  {aSubmitting ? "Menyimpan..." : "Simpan Kuis"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetQuizForm();
                    setShowAdd(false);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Edit form section */}
      {showEdit && (
        <form
          onSubmit={submitEdit}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Edit {title}
          </h2>
          {resource === "materi" ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-600">Judul *</label>
                <input
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Judul minimal 3 karakter"
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Konten *</label>
                <textarea
                  value={eContent}
                  onChange={(e) => setEContent(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-32"
                  placeholder="Konten minimal 10 karakter"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="e-published"
                  type="checkbox"
                  checked={ePublished}
                  onChange={(e) => setEPublished(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="e-published" className="text-sm text-gray-700">
                  Terbitkan
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={eSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow disabled:opacity-60"
                >
                  {eSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit(false);
                    setEditingItem(null);
                  }}
                  className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Kuis *
                </label>
                <input
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Judul minimal 3 karakter"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={eDescription}
                  onChange={(e) => setEDescription(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Deskripsi singkat kuis (opsional)"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sub-Materi untuk Kuis *{" "}
                  <span className="text-red-500">(Wajib)</span>
                </label>
                <select
                  value={eSubMateriId}
                  onChange={(e) => setESubMateriId(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Sub-Materi --</option>
                  {(Array.isArray(subMateriOptions)
                    ? subMateriOptions
                    : []
                  ).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.display_title}
                    </option>
                  ))}
                  {subMateriOptions.length === 0 && (
                    <option value="" disabled>
                      Tidak ada sub-materi tersedia
                    </option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Batas Waktu (menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={eTimeLimit}
                    onChange={(e) => setETimeLimit(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nilai Kelulusan (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={ePassingScore}
                    onChange={(e) => setEPassingScore(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="70"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    id="eq-published"
                    type="checkbox"
                    checked={ePublished}
                    onChange={(e) => setEPublished(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publikasikan kuis
                  </span>
                </label>
              </div>

              {/* Questions Section - Same as Add Form */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">
                    Soal Kuis ({questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addNewQuestion}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Soal
                  </button>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Soal {index + 1}:{" "}
                              {question.question_text || "Belum diisi"}
                            </h4>
                            <div className="text-sm text-gray-600">
                              {
                                question.options.filter((opt) => opt.trim())
                                  .length
                              }{" "}
                              opsi jawaban
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => editQuestion(question.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit soal"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteQuestion(question.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus soal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {questions.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">Belum ada soal</p>
                    <p className="text-sm text-gray-400">
                      Klik &quot;Tambah Soal&quot; untuk menambahkan soal kuis
                    </p>
                  </div>
                )}

                {/* Question Form - Same as Add Form */}
                {showQuestionForm &&
                  editingQuestionId &&
                  (() => {
                    const currentEditingQuestion = questions.find(
                      (q) => q.id === editingQuestionId
                    );
                    if (!currentEditingQuestion) return null;

                    return (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {questions.findIndex(
                            (q) => q.id === editingQuestionId
                          ) >= 0
                            ? `Edit Soal ${
                                questions.findIndex(
                                  (q) => q.id === editingQuestionId
                                ) + 1
                              }`
                            : "Edit Soal"}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pertanyaan *
                            </label>
                            <textarea
                              value={currentEditingQuestion.question_text}
                              onChange={(e) =>
                                updateQuestion(editingQuestionId!, {
                                  question_text: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                              placeholder="Masukkan pertanyaan..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Opsi Jawaban *
                            </label>
                            {currentEditingQuestion.options.map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center gap-2 mb-2"
                                >
                                  <input
                                    type="radio"
                                    name={`correct_edit_${editingQuestionId}`}
                                    checked={
                                      currentEditingQuestion.correct_answer_index ===
                                      optionIndex
                                    }
                                    onChange={() =>
                                      updateQuestion(editingQuestionId!, {
                                        correct_answer_index: optionIndex,
                                      })
                                    }
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...currentEditingQuestion.options,
                                      ];
                                      newOptions[optionIndex] = e.target.value;
                                      updateQuestion(editingQuestionId!, {
                                        options: newOptions,
                                      });
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Opsi ${optionIndex + 1}...`}
                                  />
                                  {currentEditingQuestion.options.length >
                                    2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions =
                                          currentEditingQuestion.options.filter(
                                            (_, i) => i !== optionIndex
                                          );
                                        const newCorrectIndex =
                                          currentEditingQuestion.correct_answer_index >=
                                          newOptions.length
                                            ? newOptions.length - 1
                                            : currentEditingQuestion.correct_answer_index;
                                        updateQuestion(editingQuestionId!, {
                                          options: newOptions,
                                          correct_answer_index: newCorrectIndex,
                                        });
                                      }}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                            {currentEditingQuestion.options.length < 6 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [
                                    ...currentEditingQuestion.options,
                                    "",
                                  ];
                                  updateQuestion(editingQuestionId!, {
                                    options: newOptions,
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                + Tambah Opsi
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Penjelasan (opsional)
                            </label>
                            <textarea
                              value={currentEditingQuestion.explanation || ""}
                              onChange={(e) =>
                                updateQuestion(editingQuestionId!, {
                                  explanation: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Penjelasan jawaban yang benar..."
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowQuestionForm(false);
                                setEditingQuestionId(null);
                              }}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                            >
                              Selesai
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={eSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow disabled:opacity-60"
                >
                  {eSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit(false);
                    setEditingItem(null);
                    setQuestions([]);
                  }}
                  className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Preview Modal */}
      {showPreview && previewItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Preview: {previewItem.title}
              </h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewItem(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1">
              {resource === "materi" ? (
                previewItem.poinDetails &&
                previewItem.poinDetails.length > 0 ? (
                  <MaterialPreview
                    poins={previewItem.poinDetails}
                    materialTitle={previewItem.title}
                  />
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500 italic text-lg">
                      Belum ada poin yang dibuat
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Tambahkan poin pembelajaran untuk melihat preview lengkap
                    </p>
                  </div>
                )
              ) : (
                // Quiz Preview
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {previewItem.title}
                      </h2>
                      {previewItem.description && (
                        <p className="text-gray-600">
                          {previewItem.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Jumlah Soal</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {previewItem.questionCount || 0}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-lg font-semibold text-green-600">
                          {previewItem.published ? "Terbit" : "Draft"}
                        </p>
                      </div>
                    </div>

                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(previewItem as any).questions &&
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (previewItem as any).questions.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Daftar Soal
                        </h3>
                        <div className="space-y-4">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(previewItem as any).questions.map(
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            (q: any, index: number) => (
                              <div
                                key={q.id}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                    {index + 1}
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 mb-3">
                                      {q.question_text}
                                    </p>
                                    <div className="space-y-2">
                                      {q.options &&
                                        q.options.map(
                                          (
                                            option: string,
                                            optIndex: number
                                          ) => (
                                            <div
                                              key={optIndex}
                                              className={`flex items-center gap-2 p-2 rounded ${
                                                q.correct_answer_index ===
                                                optIndex
                                                  ? "bg-green-100 border border-green-300"
                                                  : "bg-white border border-gray-200"
                                              }`}
                                            >
                                              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                                                {String.fromCharCode(
                                                  65 + optIndex
                                                )}
                                              </span>
                                              <span
                                                className={
                                                  q.correct_answer_index ===
                                                  optIndex
                                                    ? "font-medium text-green-700"
                                                    : "text-gray-700"
                                                }
                                              >
                                                {option}
                                              </span>
                                              {q.correct_answer_index ===
                                                optIndex && (
                                                <span className="ml-auto text-green-600 text-sm font-semibold">
                                                  ✓ Benar
                                                </span>
                                              )}
                                            </div>
                                          )
                                        )}
                                    </div>
                                    {q.explanation && (
                                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-semibold text-blue-700">
                                            Penjelasan:
                                          </span>{" "}
                                          {q.explanation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="italic">Belum ada soal yang dibuat</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewItem(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {title} Modul {currentModuleName || `#${moduleId}`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isInitialLoading ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Memuat data {title.toLowerCase()}...
                </span>
              ) : (
                `Menampilkan ${filteredRows.length} ${title.toLowerCase()}`
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing || isInitialLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing || isInitialLoading ? "animate-spin" : ""}`}
              />
              {isRefreshing || isInitialLoading ? "Memuat..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Status Filter & Search */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Filter Status:
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  disabled={isInitialLoading}
                  className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
                    statusFilter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Semua ({isInitialLoading ? "-" : rows.length})
                </button>
                <button
                  onClick={() => setStatusFilter("published")}
                  disabled={isInitialLoading}
                  className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
                    statusFilter === "published"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Published ({isInitialLoading ? "-" : rows.filter((r) => r.published).length})
                </button>
                <button
                  onClick={() => setStatusFilter("draft")}
                  disabled={isInitialLoading}
                  className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
                    statusFilter === "draft"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Draft ({isInitialLoading ? "-" : rows.filter((r) => !r.published).length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={isInitialLoading ? "Memuat..." : `Cari ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isInitialLoading}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  disabled={isInitialLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DataTable content */}
        <div className="p-4">
          {/* ✅ Show loading skeleton while data is being fetched */}
          {isInitialLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header Skeleton */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  </div>
                </div>

                {/* Table Rows Skeleton */}
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="border-b border-gray-200 px-4 py-4">
                    <div className="flex gap-4 items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-gray-500 text-sm py-4">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memuat data {title.toLowerCase()}...</span>
                </div>
              </div>
            </div>
          ) : (
            <DataTable<ModuleItemRow>
              title=""
              data={filteredRows}
              columns={columns}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onPreview}
              onCustomAction={onTambahPoin}
              customActionIcon={<Plus className="w-4 h-4" />}
              customActionTitle={
                resource === "materi" ? "Tambah Poin" : "Tambah Soal"
              }
              customActionColor="purple-600"
              searchPlaceholder={searchPlaceholder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
