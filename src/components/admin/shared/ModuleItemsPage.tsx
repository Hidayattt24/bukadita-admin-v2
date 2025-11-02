"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type React from "react";
import Swal from "sweetalert2";
import { RefreshCw, Plus, Edit, X, Trash2 } from "lucide-react";
import DataTable from "./DataTable";
import {
  materialsAPI,
  quizzesAPI,
  modulesAPI,
  type Material,
  type Quiz,
  type Poin,
  type MediaItem,
} from "@/lib/api";
import MaterialPreview from "../MaterialPreview";

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
  filterByMaterialId?: string; // Optional: filter quiz by specific material
}

const STORAGE_PREFIX = "admin_module_resource_";

export default function ModuleItemsPage({
  moduleId,
  resource,
  filterByMaterialId,
}: ModuleItemsPageProps) {
  const title = resource === "materi" ? "Materi" : "Kuis";
  const searchPlaceholder =
    resource === "materi" ? "Cari materi..." : "Cari kuis...";
  const storageKey = `${STORAGE_PREFIX}${resource}_${moduleId}`;

  const [rows, setRows] = useState<ModuleItemRow[]>([]);
  const [currentModuleName, setCurrentModuleName] = useState<string>("");
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

  // Preview modal states
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<ModuleItemRow | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Backend doesn't have endpoint to get single poin, so we use data from material response
  // This helper is no longer needed as backend returns complete data

  // Fetch module name if not provided
  useEffect(() => {
    let isCancelled = false;

    const fetchModuleName = async () => {
      if (!moduleId) return;

      try {
        const res = await modulesAPI.list();
        if (res.ok && res.data && !isCancelled) {
          // Handle multiple possible response structures
          let modulesList: { id: string | number; title: string }[] = [];
          if (Array.isArray(res.data)) {
            modulesList = res.data;
          } else if (res.data.items && Array.isArray(res.data.items)) {
            modulesList = res.data.items;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            modulesList = res.data.data;
          }

          // Find the module with matching ID
          const foundModule = modulesList.find(
            (m) => String(m.id) === String(moduleId)
          );
          if (foundModule && foundModule.title && !isCancelled) {
            setCurrentModuleName(foundModule.title);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to fetch module name:", error);
        }
      }
    };

    fetchModuleName();

    // Cleanup function to prevent setting state if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [moduleId]); // Helper to format server error from our apiFetch union result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatServerError = (res: {
    ok: false;
    status: number;
    error: string;
    raw?: any;
  }) => {
    const j =
      res.raw && typeof res.raw === "object"
        ? (res.raw as Record<string, unknown>)
        : undefined;
    const code = typeof j?.code === "string" ? j?.code : undefined;
    const message = (typeof j?.message === "string" && j?.message) || res.error;
    const details = typeof j?.details === "string" ? j?.details : undefined;
    const head = code ? `[${code}] ${message}` : message;
    return details ? `${head}\nDetail: ${details}` : head;
  };

  // Helper function to refetch materials list
  const refetchMaterialsList = useCallback(
    async (bypassCache = false) => {
      const params = {
        module_id: moduleId,
        ...(bypassCache && { _t: Date.now() }),
      };

      const res = await materialsAPI.list(params);

      if (res.ok) {
        const data = res.data as MaterialsListResponse;

        // Handle multiple possible response structures
        let arr: MaterialRecord[] = [];
        if (Array.isArray(data)) {
          arr = data as MaterialRecord[];
        } else if (Array.isArray(data.items)) {
          arr = data.items;
        } else if (Array.isArray(data.data)) {
          arr = data.data;
        } else if (data && typeof data === "object" && "length" in data) {
          arr = Array.from(data as ArrayLike<MaterialRecord>);
        }

        const mapped: ModuleItemRow[] = await Promise.all(
          arr.map(async (m) => {
            // Fetch poin details for count only (media will be loaded on demand for preview)
            let poinDetails: PoinDetailRecord[] = [];
            try {
              const poinRes = await materialsAPI.get(m.id);
              if (poinRes.ok && poinRes.data.poin_details) {
                poinDetails = poinRes.data.poin_details;
              }
            } catch (error) {
              console.warn(
                `Failed to fetch poins for material ${m.id}:`,
                error
              );
            }

            return {
              id: String(m.id),
              title: m.title,
              description: undefined, // Remove content description from table
              updated_at: m.updated_at || m.created_at,
              published: !!m.published,
              contentLength:
                typeof m.content === "string" ? m.content.length : 0,
              pointsCount: poinDetails.length,
              content: typeof m.content === "string" ? m.content : undefined,
              poinDetails: poinDetails,
            };
          })
        );
        setRows(mapped);
        try {
          localStorage.setItem(storageKey, JSON.stringify(mapped));
        } catch {}
        return true;
      } else {
        console.error("Failed to refetch materials:", res.error);
        return false;
      }
    },
    [moduleId, storageKey]
  );

  // Helper function to refetch quiz list
  const refetchQuizList = useCallback(
    async (bypassCache = false) => {
      // Call quiz API directly according to backend API documentation
      const quizRes = await quizzesAPI.list({
        // Add cache busting if needed (API doesn't need this param but TypeScript requires valid params)
        ...(bypassCache && { limit: 1000 }),
      });

      if (!quizRes.ok) {
        console.error("Failed to get quiz list:", quizRes.error);
        setRows([]);
        return false;
      }

      // Parse quiz response according to backend API documentation
      const responseData = quizRes.data;
      let allQuizzes: QuizRecord[] = [];

      // According to API documentation, response should be:
      // { "success": true, "data": { "quizzes": [...], "pagination": {...} } }
      const dataWithQuizzes = responseData as unknown as {
        quizzes?: QuizRecord[];
        items?: QuizRecord[];
        [key: string]: unknown;
      };

      if (dataWithQuizzes.quizzes && Array.isArray(dataWithQuizzes.quizzes)) {
        // Backend API format: { data: { quizzes: [...] } }
        allQuizzes = dataWithQuizzes.quizzes;
      } else if (
        dataWithQuizzes.items &&
        Array.isArray(dataWithQuizzes.items)
      ) {
        // Fallback format: { items: [...] }
        allQuizzes = dataWithQuizzes.items;
      } else if (Array.isArray(responseData)) {
        // Direct array format
        allQuizzes = responseData;
      } else {
        console.error(
          "Unexpected API response structure:",
          Object.keys(dataWithQuizzes)
        );
        setRows([]);
        return false;
      }

      // Filter quizzes by module - get materials in this module first
      const materialsRes = await materialsAPI.list({
        module_id: moduleId,
        limit: 100,
        ...(bypassCache && { _t: Date.now() }),
      });

      let materialIds: Set<string | number> = new Set();

      if (materialsRes.ok && materialsRes.data.items) {
        const materials = materialsRes.data.items;
        materialIds = new Set(materials.map((m) => String(m.id)));
      } else {
        console.warn("Could not get materials for module filtering");
        // If we can't get materials, include all quizzes (fallback)
      }

      // Filter quizzes that belong to materials in this module
      let moduleQuizzes = allQuizzes.filter((quiz) => {
        return (
          materialIds.size === 0 || materialIds.has(String(quiz.sub_materi_id))
        );
      });

      // If filterByMaterialId is provided, filter further to only show quiz for that material
      if (filterByMaterialId) {
        moduleQuizzes = moduleQuizzes.filter((quiz) => {
          return String(quiz.sub_materi_id) === String(filterByMaterialId);
        });
      }

      // Map quiz data to UI rows - fetch question count for each quiz
      const mapped: ModuleItemRow[] = await Promise.all(
        moduleQuizzes.map(async (quiz) => {
          let questionCount = 0;

          // Get question count - check if already included in response
          if (quiz.questions && Array.isArray(quiz.questions)) {
            questionCount = quiz.questions.length;
          } else {
            // Fetch quiz details to get question count
            try {
              const detailRes = await quizzesAPI.get(quiz.id);
              if (detailRes.ok && detailRes.data.questions) {
                questionCount = detailRes.data.questions.length;
              }
            } catch (error) {
              console.warn(
                `Failed to fetch question count for quiz ${quiz.id}:`,
                error
              );
            }
          }

          // Handle published field mapping - Backend uses 'is_active' instead of 'published'
          let publishedStatus = false;

          if (quiz.published !== undefined) {
            // Preferred field name per API documentation
            publishedStatus = quiz.published;
          } else {
            // Backend actually uses 'is_active' field - map it to published
            const quizWithExtraFields = quiz as unknown as {
              is_active?: boolean;
            };
            if (quizWithExtraFields.is_active !== undefined) {
              publishedStatus = quizWithExtraFields.is_active;
            }
          }

          return {
            id: String(quiz.id),
            title: quiz.title,
            description: quiz.description?.slice(0, 140),
            updated_at: quiz.updated_at || quiz.created_at,
            published: publishedStatus,
            questionCount: questionCount,
          };
        })
      );

      setRows(mapped);

      // Clear local storage cache if bypassCache is true
      if (bypassCache) {
        try {
          localStorage.removeItem(storageKey);
        } catch {}
      }

      try {
        localStorage.setItem(storageKey, JSON.stringify(mapped));
      } catch {}
      return true;
    },
    [moduleId, storageKey]
  );

  // Load sub-materi options for quiz dropdown - get sub-materis with poin details
  useEffect(() => {
    if (resource === "kuis" && moduleId) {
      const loadSubMateriOptions = async () => {
        try {
          console.log(
            "[ModuleItemsPage] Loading sub-materi options for module:",
            moduleId
          );

          // Use module detail endpoint to get all sub-materis (same as test-user-flow)
          const res = await modulesAPI.get(moduleId);

          console.log("[ModuleItemsPage] Module detail response:", res);

          if (res.ok && res.data) {
            // Get sub-materis from module detail (supports both snake_case and camelCase)
            const subMateris =
              res.data.sub_materis || res.data.subMateris || [];

            console.log(
              "[ModuleItemsPage] Found sub-materis:",
              subMateris.length
            );

            // Fetch poin details for each sub materi to show count
            const optionsWithPoinCount = await Promise.all(
              subMateris.map(async (subMateri: any) => {
                let poinCount = 0;
                try {
                  const materiDetail = await materialsAPI.get(subMateri.id);
                  if (materiDetail.ok && materiDetail.data.poin_details) {
                    poinCount = materiDetail.data.poin_details.length;
                  }
                } catch (error) {
                  console.warn(
                    `Failed to fetch poin count for ${subMateri.id}:`,
                    error
                  );
                }

                return {
                  id: subMateri.id,
                  title: subMateri.title,
                  module_title:
                    res.data.title || currentModuleName || `Module ${moduleId}`,
                  display_title: `${subMateri.title}${
                    poinCount > 0 ? ` (${poinCount} poin)` : ""
                  }`,
                  poin_count: poinCount,
                };
              })
            );

            setSubMateriOptions(optionsWithPoinCount);
            console.log(
              "[ModuleItemsPage] Sub-materi options set:",
              optionsWithPoinCount
            );
          } else {
            console.warn(
              "[ModuleItemsPage] Failed to load module detail. Response:",
              res
            );
            setSubMateriOptions([]);
          }
        } catch (error) {
          console.error(
            "[ModuleItemsPage] Error loading sub-materi options:",
            error
          );
          setSubMateriOptions([]);
        }
      };
      loadSubMateriOptions();
    }
  }, [resource, moduleId, currentModuleName, showAdd, showEdit]); // Re-run when form is opened

  // Load data from backend for both materi and kuis
  useEffect(() => {
    const load = async () => {
      try {
        if (resource === "materi") {
          // Get materials list first (without poin details to avoid backend dependency)
          const res = await materialsAPI.list({
            module_id: moduleId,
          });

          if (res.ok) {
            const data = res.data as MaterialsListResponse;

            // Handle multiple possible response structures
            let arr: MaterialRecord[] = [];
            if (Array.isArray(data)) {
              arr = data as MaterialRecord[];
            } else if (Array.isArray(data.items)) {
              arr = data.items;
            } else if (Array.isArray(data.data)) {
              arr = data.data;
            } else if (data && typeof data === "object" && "length" in data) {
              arr = Array.from(data as ArrayLike<MaterialRecord>);
            }

            // Fetch poin details for each material (without media for faster initial load)
            const mapped: ModuleItemRow[] = await Promise.all(
              arr.map(async (m) => {
                // Only fetch poin details for count, don't load media yet for faster initial load
                let poinDetails: PoinDetailRecord[] = [];
                try {
                  const poinRes = await materialsAPI.get(m.id);
                  if (poinRes.ok && poinRes.data.poin_details) {
                    poinDetails = poinRes.data.poin_details;
                  }
                } catch (error) {
                  console.warn(
                    `Failed to fetch poins for material ${m.id}:`,
                    error
                  );
                }

                return {
                  id: String(m.id),
                  title: m.title,
                  description: undefined, // Remove content description from table
                  updated_at: m.updated_at || m.created_at,
                  published: !!m.published,
                  contentLength:
                    typeof m.content === "string" ? m.content.length : 0,
                  pointsCount: poinDetails.length,
                  content:
                    typeof m.content === "string" ? m.content : undefined,
                  poinDetails: poinDetails,
                };
              })
            );

            setRows(mapped);
            try {
              localStorage.setItem(storageKey, JSON.stringify(mapped));
            } catch {}
            return;
          } else {
            console.error("Failed to load materials:", res.error);
            // Show user-friendly error message
            await Swal.fire({
              icon: "error",
              title: "Gagal Memuat Materi",
              text: `Tidak dapat memuat materi: ${
                res.error || "Terjadi kesalahan pada server"
              }`,
              footer:
                "Silakan coba refresh halaman atau hubungi administrator jika masalah berlanjut",
            });
          }
        } else if (resource === "kuis") {
          // Use the same logic as refetchQuizList to ensure consistency
          const result = await refetchQuizList(false);
          if (result) {
            return; // Data already set by refetchQuizList
          } else {
            await Swal.fire({
              icon: "error",
              title: "Gagal Memuat Kuis",
              text: "Tidak dapat memuat kuis untuk modul ini",
              footer:
                "Silakan coba refresh halaman atau hubungi administrator jika masalah berlanjut",
            });
          }
        }

        // Fallback to local storage
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            setRows(JSON.parse(raw));
            return;
          }
        } catch {}

        // If no data available, set empty
        setRows([]);
      } catch (error) {
        console.error(`Error loading ${resource} data:`, error);
        await Swal.fire({
          icon: "error",
          title: "Kesalahan Sistem",
          text: `Terjadi kesalahan saat memuat ${resource}: ${
            error instanceof Error ? error.message : "Kesalahan tidak diketahui"
          }`,
          footer: "Silakan refresh halaman atau hubungi administrator",
        });
        setRows([]); // Set empty array as fallback
      }
    };
    load();
  }, [moduleId, resource, storageKey, refetchQuizList]);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch {
      // ignore
    }
  }, [rows, storageKey]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ColumnDef = {
    key: string;
    label: string;
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

  const onManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (resource === "materi") {
        await refetchMaterialsList(true);
      } else {
        await refetchQuizList(true);
      }
      await Swal.fire({
        icon: "success",
        title: "Data diperbarui",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Manual refresh failed:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal memperbarui",
        text: "Terjadi kesalahan saat memperbarui data",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [resource, refetchMaterialsList, refetchQuizList]);

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

      const res = await materialsAPI.create({
        title: titleVal,
        content: contentVal,
        module_id: String(moduleId),
        published: aPublished,
        slug: aSlug ? aSlug.trim() : undefined,
      });

      setASubmitting(false);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            formatServerError(
              res as unknown as {
                ok: false;
                status: number;
                error: string;
                raw?: unknown;
              }
            ) || "Gagal membuat materi",
        });
        return;
      }

      // Force refetch all materials to ensure UI shows complete list
      await refetchMaterialsList();

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
          sub_materi_id: aSubMateriId, // Wajib untuk kuis per sub-materi
          title: titleVal,
          description: aDescription || undefined,
          time_limit_seconds: timeLimitSeconds,
          passing_score: passingScoreNum,
          published: aPublished,
        };

        const res = await quizzesAPI.create(payload);

        if (!res.ok) {
          await Swal.fire({
            icon: "error",
            title: "Gagal",
            text:
              formatServerError(
                res as unknown as {
                  ok: false;
                  status: number;
                  error: string;
                  raw?: unknown;
                }
              ) || "Gagal membuat kuis",
          });
          return;
        }

        // 2. Tambahkan soal-soal jika ada
        if (questions.length > 0) {
          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const validOptions = q.options.filter((opt) => opt.trim());

            await quizzesAPI.addQuestion(res.data.id, {
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

        // 3. Reset form dan refresh data
        resetQuizForm();
        setShowAdd(false);
        await refetchQuizList();

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
          text: "Terjadi kesalahan saat membuat kuis",
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

      const res = await materialsAPI.update(editingItem.id, payload);
      setESubmitting(false);

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            formatServerError(
              res as unknown as {
                ok: false;
                status: number;
                error: string;
                raw?: unknown;
              }
            ) || "Gagal memperbarui materi",
        });
        return;
      }

      // Force refetch to ensure UI is up to date
      await refetchMaterialsList();
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

    const res = await quizzesAPI.update(editingItem.id, payload);

    if (!res.ok) {
      setESubmitting(false);
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          formatServerError(
            res as unknown as {
              ok: false;
              status: number;
              error: string;
              raw?: unknown;
            }
          ) || "Gagal memperbarui kuis",
      });
      return;
    }

    // Update questions if any
    if (questions.length > 0) {
      try {
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

          // Check if this is an existing question (ID is numeric from backend)
          const isExistingQuestion = existingQuestionIds.includes(q.id);

          if (isExistingQuestion) {
            // Update existing question
            await quizzesAPI.updateQuestion(q.id, questionPayload);
          } else {
            // Create new question
            await quizzesAPI.addQuestion(editingItem.id, questionPayload);
          }
        }

        // Delete questions that were removed (exist in backend but not in current questions array)
        const currentQuestionIds = questions.map((q) => q.id);
        const questionsToDelete = existingQuestionIds.filter(
          (id) => !currentQuestionIds.includes(id)
        );

        for (const questionId of questionsToDelete) {
          await quizzesAPI.deleteQuestion(questionId);
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
    }

    setESubmitting(false);

    // Small delay to ensure database commit is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Force refetch to ensure UI is up to date with fresh data
    await refetchQuizList(true); // bypassCache=true untuk memastikan data terbaru

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
      const res = await materialsAPI.remove(row.id);
      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            formatServerError(
              res as unknown as {
                ok: false;
                status: number;
                error: string;
                raw?: unknown;
              }
            ) || "Gagal menghapus materi",
        });
        return;
      }
      // Force refetch to ensure UI is accurate
      await refetchMaterialsList();
      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Berhasil Dihapus",
        text: `Materi "${row.title}" berhasil dihapus.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else if (resource === "kuis") {
      const res = await quizzesAPI.remove(row.id);
      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            formatServerError(
              res as unknown as {
                ok: false;
                status: number;
                error: string;
                raw?: unknown;
              }
            ) || "Gagal menghapus kuis",
        });
        return;
      }
      // Force refetch to ensure UI is accurate
      await refetchQuizList();
      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Berhasil Dihapus",
        text: `Kuis "${row.title}" berhasil dihapus.`,
        timer: 2000,
        showConfirmButton: false,
      });
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
                      Klik "Tambah Soal" untuk menambahkan soal kuis
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

                    {(previewItem as any).questions &&
                    (previewItem as any).questions.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Daftar Soal
                        </h3>
                        <div className="space-y-4">
                          {(previewItem as any).questions.map(
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
              Menampilkan semua {title.toLowerCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Memuat..." : "Refresh"}
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
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    statusFilter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Semua ({rows.length})
                </button>
                <button
                  onClick={() => setStatusFilter("published")}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    statusFilter === "published"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Published ({rows.filter((r) => r.published).length})
                </button>
                <button
                  onClick={() => setStatusFilter("draft")}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    statusFilter === "draft"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Draft ({rows.filter((r) => !r.published).length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Cari ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
        </div>
      </div>
    </div>
  );
}
