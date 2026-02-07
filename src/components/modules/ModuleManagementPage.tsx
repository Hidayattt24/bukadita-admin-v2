"use client";

import { useMemo, useState, useCallback } from "react";
import { Folder, Users } from "lucide-react";
import { materialsAPI, quizzesAPI } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import LoadingModal from "@/components/ui/LoadingModal";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import ModuleStatistics from "./ModuleStatistics";
import ModuleSearchBar from "./ModuleSearchBar";
import ModuleCard from "./ModuleCard";
import ModuleFormModal from "./ModuleFormModal";
import type { ModuleItem, ModuleFormData } from "./types";
import { useModules, useCreateModule, useUpdateModule, useDeleteModule } from "@/hooks/useModules";

const STORAGE_KEY = "admin_modules";

export default function ModuleManagement() {
  const { toast, ToastContainer } = useToast();
  
  // React Query hooks
  const { data: modulesData, isLoading: loading, refetch } = useModules();
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();

  // Transform data
  const parseList = (d: unknown): ModuleItem[] => {
    const dataAny = d as ModuleItem[] | { items?: ModuleItem[]; data?: ModuleItem[] };
    return Array.isArray(dataAny) ? dataAny : ((dataAny.items || dataAny.data || []) as ModuleItem[]);
  };

  const modules = modulesData ? parseList(modulesData) : [];
  
  // State management
  const [search, setSearch] = useState("");
  const [modulesCounts, setModulesCounts] = useState<Record<string, { materials: number; quiz: number }>>({});
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState({ title: "", message: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<ModuleItem | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ModuleFormData>({
    title: "",
    description: "",
    published: false,
    durationLabel: "",
    durationMinutes: "",
    lessons: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Helpers
  const toNumOrNull = (v: string) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      published: false,
      durationLabel: "",
      durationMinutes: "",
      lessons: "",
      category: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setSelectedModule(null);
  };

  // Function to fetch real counts for materials and quiz
  const fetchModuleCounts = useCallback(async (moduleId: string | number) => {
    try {
      // Fetch materials count
      const materialsRes = await materialsAPI.list({ module_id: moduleId });
      const materialsCount = materialsRes.ok ?
        (Array.isArray(materialsRes.data) ? materialsRes.data.length :
          materialsRes.data?.items?.length || 0) : 0;

      // Fetch quiz count
      let quizCount = 0;
      const quizRes = await quizzesAPI.list({ module_id: moduleId });

      if (quizRes.ok && quizRes.data?.items) {
        quizCount = quizRes.data.items.length;
      } else if (quizRes.ok && !quizRes.data?.items && materialsRes.ok && materialsRes.data?.items) {
        const allQuizzes: unknown[] = [];
        for (const material of materialsRes.data.items) {
          const subQuizRes = await quizzesAPI.list({ sub_materi_id: material.id });
          if (subQuizRes.ok) {
            const quizData = subQuizRes.data;
            const quizDataWithQuizzes = quizData as typeof quizData & { quizzes?: unknown[] };
            if (quizData.items) {
              allQuizzes.push(...quizData.items);
            } else if (quizDataWithQuizzes.quizzes) {
              allQuizzes.push(...quizDataWithQuizzes.quizzes);
            }
          }
        }
        quizCount = allQuizzes.length;
      }

      return { materials: materialsCount, quiz: quizCount };
    } catch (error) {
      console.error('Error fetching module counts:', error);
      return { materials: 0, quiz: 0 };
    }
  }, []);

  // Function to refresh counts for all modules
  const refreshAllCounts = useCallback(async (modulesList: ModuleItem[]) => {
    const countsPromises = modulesList.map(async (module) => {
      const counts = await fetchModuleCounts(module.id);
      return { id: String(module.id), counts };
    });

    const results = await Promise.all(countsPromises);
    const newCounts: Record<string, { materials: number; quiz: number }> = {};

    results.forEach(({ id, counts }) => {
      newCounts[id] = counts;
    });

    setModulesCounts(newCounts);
  }, [fetchModuleCounts]);

  // Update counts when modules change
  if (modules.length > 0 && Object.keys(modulesCounts).length === 0) {
    refreshAllCounts(modules).catch(console.error);
  }

  // Save modules to localStorage and notify sidebar
  const saveModules = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    window.dispatchEvent(new Event('modules:updated'));
    refreshAllCounts(modules).catch(console.error);
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title || formData.title.trim().length < 3) {
      errors.title = "Judul minimal 3 karakter";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form change
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle add module
  const handleAddModule = () => {
    resetForm();
    setShowForm(true);
    setIsEditMode(false);
  };

  // Handle edit module
  const handleEditModule = (module: ModuleItem) => {
    setSelectedModule(module);
    setFormData({
      title: module.title || "",
      description: module.description || "",
      published: !!module.published,
      durationLabel: module.duration_label || "",
      durationMinutes:
        typeof module.duration_minutes === 'number' && Number.isFinite(module.duration_minutes)
          ? String(module.duration_minutes)
          : "",
      lessons:
        typeof module.lessons === 'number' && Number.isFinite(module.lessons)
          ? String(module.lessons)
          : "",
      category: module.category || "",
    });
    setFormErrors({});
    setIsEditMode(true);
    setShowForm(true);
  };

  // Handle delete module
  const handleDeleteModule = (module: ModuleItem) => {
    setModuleToDelete(module);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteModule = async () => {
    if (!moduleToDelete) return;

    setIsDeleteModalOpen(false);
    setIsLoadingAction(true);
    setLoadingMessage({
      title: "Menghapus Modul",
      message: "Sedang menghapus modul dari sistem...",
    });

    try {
      await deleteModuleMutation.mutateAsync(moduleToDelete.id);

      setIsLoadingAction(false);
      toast.delete(
        "Berhasil Dihapus!",
        `Modul <strong class="text-red-600">"${moduleToDelete.title}"</strong> telah dihapus dari sistem`
      );
      
      saveModules();
    } catch (error) {
      console.error("Error deleting module:", error);
      setIsLoadingAction(false);
      toast.error(
        "Gagal Menghapus!",
        "Terjadi kesalahan saat menghapus modul. Silakan coba lagi."
      );
    }
  };

  // Handle submit form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: (formData.description ?? '').trim(),
      published: !!formData.published,
    };

    setSubmitting(true);
    setIsLoadingAction(true);
    setLoadingMessage({
      title: isEditMode ? "Mengupdate Modul" : "Menambahkan Modul",
      message: isEditMode
        ? "Sedang memperbarui data modul..."
        : "Sedang menambahkan modul baru ke sistem...",
    });

    try {
      if (isEditMode && selectedModule) {
        await updateModuleMutation.mutateAsync({ id: selectedModule.id, data: payload });

        setIsLoadingAction(false);
        setSubmitting(false);
        setShowForm(false);
        resetForm();

        toast.update(
          "Berhasil Diupdate!",
          `Modul <strong class="text-blue-600">"${payload.title}"</strong> telah diperbarui`
        );
        
        saveModules();
      } else {
        await createModuleMutation.mutateAsync(payload);

        setIsLoadingAction(false);
        setSubmitting(false);
        setShowForm(false);
        resetForm();

        toast.create(
          "Berhasil Ditambahkan!",
          `Modul <strong class="text-emerald-600">"${payload.title}"</strong> telah ditambahkan ke sistem`
        );
        
        saveModules();
      }
    } catch (error: unknown) {
      console.error("Error saving module:", error);

      let errorMessage = "Gagal menyimpan data modul. Silakan coba lagi.";
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as { message: string };
        errorMessage = apiError.message;
      }

      setIsLoadingAction(false);
      setSubmitting(false);

      toast.error("Gagal Menyimpan!", errorMessage);
    }
  };

  // Filtered modules
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter(m => m.title.toLowerCase().includes(q));
  }, [modules, search]);

  // Calculate statistics
  const totalModules = modules.length;
  const publishedModules = modules.filter(m => m.published === true).length;
  const totalMaterials = Object.values(modulesCounts).reduce((acc, curr) => acc + curr.materials, 0);
  const totalQuiz = Object.values(modulesCounts).reduce((acc, curr) => acc + curr.quiz, 0);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Modern Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl sm:rounded-2xl shadow-lg">
          <Folder className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#27548A] truncate">
            Kelola Modul
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">
            Tambah, ubah, dan hapus modul pembelajaran
          </p>
        </div>
      </div>

      {/* Statistics */}
      <ModuleStatistics
        totalModules={totalModules}
        publishedModules={publishedModules}
        totalMaterials={totalMaterials}
        totalQuiz={totalQuiz}
      />

      {/* Search and Actions Bar */}
      <ModuleSearchBar
        searchTerm={search}
        showForm={showForm}
        onSearch={setSearch}
        onToggleForm={() => {
          if (showForm) {
            resetForm();
            setShowForm(false);
          } else {
            handleAddModule();
          }
        }}
      />

      {/* Modules Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border-2 border-dashed border-slate-300">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 bg-slate-100 rounded-full">
              <Folder className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-1 sm:mb-2">
                {search ? "Tidak Ada Hasil" : "Belum Ada Modul"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {search
                  ? `Tidak ditemukan modul dengan kata kunci "${search}"`
                  : 'Klik "Tambah Modul" untuk membuat modul pertama'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {filtered.map(m => (
            <ModuleCard
              key={m.id}
              module={m}
              materialsCount={modulesCounts[String(m.id)]?.materials ?? m.materiCount ?? m.materials_count ?? 0}
              quizCount={modulesCounts[String(m.id)]?.quiz ?? m.quizCount ?? m.quiz_count ?? 0}
              onEdit={() => handleEditModule(m)}
              onDelete={() => handleDeleteModule(m)}
            />
          ))}
        </div>
      )}

      {/* Module Form Modal */}
      <ModuleFormModal
        isOpen={showForm}
        isEditMode={isEditMode}
        formData={formData}
        formErrors={formErrors}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        onSubmit={handleSubmitForm}
        onChange={handleFormChange}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Modul?"
        userName={moduleToDelete?.title || ""}
        userEmail={moduleToDelete?.description || "Modul ini akan dihapus beserta semua materi dan kuis"}
        onConfirm={confirmDeleteModule}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Loading Modal */}
      <LoadingModal
        isOpen={isLoadingAction}
        title={loadingMessage.title}
        message={loadingMessage.message}
      />

      {/* Custom Toast Container */}
      <ToastContainer />
    </div>
  );
}
