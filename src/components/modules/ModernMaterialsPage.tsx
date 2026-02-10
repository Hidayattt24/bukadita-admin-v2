"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
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

export default function ModernMaterialsPage({
  moduleId,
}: ModernMaterialsPageProps) {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();

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

  // State
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    material: Material | null;
  }>({ isOpen: false, material: null });
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return materials;
    return materials.filter((m) => m.title.toLowerCase().includes(query));
  }, [materials, search]);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#578FCA] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
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
                    <td colSpan={3} className="px-6 py-12 text-center">
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
                  filteredMaterials.map((material, index) => (
                    <tr
                      key={material.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {material.title}
                            </p>
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
                              router.push(
                                `/admin/modul/${moduleId}/materi/${material.id}/poin`,
                              )
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
                  ))
                )}
              </tbody>
            </table>
          </div>
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
