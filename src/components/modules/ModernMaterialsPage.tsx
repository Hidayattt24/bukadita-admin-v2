"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Folder,
  Trash2,
  Eye,
  Check,
  X,
  Edit,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useModules } from "@/hooks/useModules";
import {
  useMaterials,
  useCreateMaterial,
  useDeleteMaterial,
  useUpdateMaterial,
} from "@/hooks/useMaterials";
import { useToast } from "@/hooks/useToast";
import SubMateriFormModal from "@/components/modules/SubMateriFormModal";
import SubMateriPreviewModal from "@/components/modules/SubMateriPreviewModal";
import SubMateriEditModal from "@/components/modules/SubMateriEditModal";
import LoadingModal from "@/components/ui/LoadingModal";
import type { Material } from "@/lib/api";

interface ModernMaterialsPageProps {
  moduleId: string;
}

// Sortable Row Component
interface SortableRowProps {
  material: Material;
  index: number;
  moduleId: string;
  router: ReturnType<typeof useRouter>;
  setPreviewMaterial: (material: Material) => void;
  setEditMaterial: (material: Material) => void;
  handleDelete: (material: Material) => void;
}

function SortableRow({
  material,
  index,
  moduleId,
  router,
  setPreviewMaterial,
  setEditMaterial,
  handleDelete,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: material.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 transition-all ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      } ${
        isDragging
          ? "opacity-50 shadow-2xl scale-105 bg-blue-50 z-50 ring-2 ring-[#578FCA]"
          : "hover:bg-gray-50"
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded-lg transition-all hover:scale-110"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5 text-gray-400 hover:text-[#578FCA]" />
          </button>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] text-white font-bold text-sm shadow-md">
            {index + 1}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{material.title}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            material.published
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-50 text-gray-600 border border-gray-200"
          }`}
        >
          {material.published ? (
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
            onClick={() =>
              router.push(`/admin/modul/${moduleId}/materi/${material.id}/poin`)
            }
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
            title="Kelola Poin"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewMaterial(material)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditMaterial(material)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(material)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ModernMaterialsPage({
  moduleId,
}: ModernMaterialsPageProps) {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();

  // State declarations FIRST
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    material: Material | null;
  }>({ isOpen: false, material: null });
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [localMaterials, setLocalMaterials] = useState<Material[]>([]);
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const isUpdatingOrder = useRef(false); // Flag to prevent double execution

  // DND Sensors - Added TouchSensor for mobile support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // React Query hooks
  const { data: modulesData } = useModules();
  const {
    data: materialsData,
    isLoading,
    refetch,
  } = useMaterials({ module_id: moduleId });
  const createMaterialMutation = useCreateMaterial();
  const deleteMaterialMutation = useDeleteMaterial();
  const updateMaterialMutation = useUpdateMaterial();

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

  // Transform materials data
  const materials = useMemo(() => {
    if (!materialsData) return [];
    const data = materialsData as
      | Material[]
      | { items?: Material[]; data?: Material[] };
    if (Array.isArray(data)) return data;
    return (data.items || data.data || []) as Material[];
  }, [materialsData]);

  // Sync local materials with fetched data using useEffect instead of useMemo
  useEffect(() => {
    if (materials.length > 0) {
      setLocalMaterials(materials);
    }
  }, [materials]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return localMaterials;
    return localMaterials.filter((m) => m.title.toLowerCase().includes(query));
  }, [localMaterials, search]);

  // Handle delete
  const handleDelete = (material: Material) => {
    setDeleteModal({ isOpen: true, material });
  };

  const confirmDelete = async () => {
    if (!deleteModal.material) return;

    const materialToDelete = deleteModal.material;
    setDeleteModal({ isOpen: false, material: null });
    setIsSubmitting(true);

    try {
      await deleteMaterialMutation.mutateAsync(materialToDelete.id);
      toast.delete(
        "Berhasil Dihapus!",
        `Sub-materi <strong class="text-red-600">"${materialToDelete.title}"</strong> telah dihapus`,
      );
      await refetch();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error(
        "Gagal Menghapus!",
        "Terjadi kesalahan saat menghapus sub-materi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle create material
  const handleCreateMaterial = async (data: {
    title: string;
    published: boolean;
    content?: string;
  }) => {
    setIsSubmitting(true);

    try {
      await createMaterialMutation.mutateAsync({
        title: data.title,
        module_id: moduleId,
        published: data.published,
        content: data.content || "",
      });

      setShowForm(false);
      toast.create(
        "Berhasil Ditambahkan!",
        `Sub-materi <strong class="text-emerald-600">"${data.title}"</strong> telah ditambahkan`,
      );

      await refetch();
    } catch (error) {
      console.error("Error creating material:", error);
      toast.error(
        "Gagal Menambahkan!",
        "Terjadi kesalahan saat menambahkan sub-materi. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit material
  const handleEditMaterial = async (data: {
    title: string;
    published: boolean;
    content?: string;
  }) => {
    if (!editMaterial) return;

    setIsSubmitting(true);

    try {
      await updateMaterialMutation.mutateAsync({
        id: editMaterial.id,
        data: {
          title: data.title,
          published: data.published,
          content: data.content || "",
        },
      });

      setEditMaterial(null);
      toast.success(
        "Berhasil Diupdate!",
        `Sub-materi <strong class="text-blue-600">"${data.title}"</strong> telah diperbarui`,
      );

      await refetch();
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error(
        "Gagal Mengupdate!",
        "Terjadi kesalahan saat mengupdate sub-materi. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag end - bulk update order
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      // Early return if no valid drop target or same position
      if (!over || active.id === over.id) return;

      // Prevent double execution
      if (isUpdatingOrder.current) return;

      const oldIndex = localMaterials.findIndex((m) => m.id === active.id);
      const newIndex = localMaterials.findIndex((m) => m.id === over.id);

      // Early return if indices are invalid or same
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      // Set flag to prevent double execution
      isUpdatingOrder.current = true;

      // Update local state immediately for smooth UX
      const newMaterials = arrayMove(localMaterials, oldIndex, newIndex);
      
      // Update order_index for all materials
      const updatedMaterials = newMaterials.map((material, index) => ({
        ...material,
        order_index: index,
      }));

      setLocalMaterials(updatedMaterials);

      // Bulk update backend - only update materials that changed position
      try {
        // Only update materials whose order_index actually changed
        const materialsToUpdate = updatedMaterials.filter((material, index) => {
          const originalMaterial = localMaterials.find(m => m.id === material.id);
          return originalMaterial && originalMaterial.order_index !== index;
        });

        // Update each material's order_index
        await Promise.all(
          materialsToUpdate.map((material) =>
            updateMaterialMutation.mutateAsync({
              id: String(material.id),
              data: {
                order_index: material.order_index,
              },
            })
          )
        );

        // Show success toast only once after all updates complete
        toast.success(
          "Urutan Diperbarui!",
          "Urutan sub-materi berhasil diubah",
        );

        // Refetch to ensure data consistency
        await refetch();
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error(
          "Gagal Mengupdate Urutan!",
          "Terjadi kesalahan saat mengupdate urutan. Silakan coba lagi.",
        );
        // Revert to original order on error
        setLocalMaterials(localMaterials);
      } finally {
        // Reset flag after operation completes
        isUpdatingOrder.current = false;
      }
    },
    [localMaterials, updateMaterialMutation, toast, refetch],
  );

  // Statistics
  const stats = useMemo(
    () => ({
      total: materials.length,
      published: materials.filter((m) => m.published).length,
      draft: materials.filter((m) => !m.published).length,
    }),
    [materials],
  );

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

          {/* Action Bar Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full sm:w-auto h-10 bg-gray-200 rounded-lg animate-pulse sm:w-48"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#578FCA] to-[#27548A]">
                    <th className="px-6 py-4 text-left">
                      <div className="h-4 bg-white/30 rounded w-20 animate-pulse"></div>
                    </th>
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
                        <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                      </td>
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
                {currentModule?.title || "Kelola Sub-Materi"}
              </h1>
              <p className="text-gray-600">
                Kelola dan atur sub-materi dalam modul ini
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
                  Total Sub-Materi
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
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
              <h2 className="text-xl font-bold text-white">
                Daftar Sub-Materi
              </h2>
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    placeholder="Cari sub-materi..."
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
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#578FCA] hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Sub-Materi</span>
                </button>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Urutan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Judul Sub-Materi
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
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <BookOpen className="w-12 h-12 mb-3 text-gray-300" />
                          <p className="text-lg font-medium">
                            Tidak ada sub-materi ditemukan
                          </p>
                          <p className="text-sm mt-1">
                            {search
                              ? "Coba kata kunci lain"
                              : "Mulai dengan menambah sub-materi baru"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <SortableContext
                      items={filteredMaterials.map((m) => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredMaterials.map((material, index) => (
                        <SortableRow
                          key={material.id}
                          material={material}
                          index={index}
                          moduleId={moduleId}
                          router={router}
                          setPreviewMaterial={setPreviewMaterial}
                          setEditMaterial={setEditMaterial}
                          handleDelete={handleDelete}
                        />
                      ))}
                    </SortableContext>
                  )}
                </tbody>
              </table>
            </div>
          </DndContext>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <SubMateriFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateMaterial}
          isSubmitting={isSubmitting}
        />
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
                  Apakah Anda yakin ingin menghapus sub-materi ini?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Sub-Materi:</p>
              <p className="font-semibold text-gray-800">
                {deleteModal.material?.title}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, material: null })
                }
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
      {previewMaterial && (
        <SubMateriPreviewModal
          material={previewMaterial}
          onClose={() => setPreviewMaterial(null)}
        />
      )}

      {/* Edit Modal */}
      {editMaterial && (
        <SubMateriEditModal
          material={editMaterial}
          onClose={() => setEditMaterial(null)}
          onSubmit={handleEditMaterial}
          isSubmitting={isSubmitting}
        />
      )}

      <LoadingModal
        isOpen={isSubmitting}
        title={
          deleteModal.material
            ? "Menghapus..."
            : editMaterial
              ? "Mengupdate..."
              : "Menyimpan..."
        }
        message={
          deleteModal.material
            ? "Sedang menghapus sub-materi..."
            : editMaterial
              ? "Sedang mengupdate sub-materi..."
              : "Sedang menyimpan sub-materi baru..."
        }
      />

      <ToastContainer />
    </div>
  );
}
