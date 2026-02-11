"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  FileText,
  Clock,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { poinsAPI, materialsAPI, type Poin, type Material } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

interface ModernMaterialPoinPageProps {
  materialId: string;
}

export default function ModernMaterialPoinPage({
  materialId,
}: ModernMaterialPoinPageProps) {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();
  const [material, setMaterial] = useState<Material | null>(null);
  const [poins, setPoins] = useState<Poin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    poin: Poin | null;
  }>({ isOpen: false, poin: null });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materialData, poinsData] = await Promise.all([
        materialsAPI.get(materialId),
        poinsAPI.list(materialId),
      ]);

      if (materialData.ok && materialData.data) {
        setMaterial(materialData.data);
      }

      if (poinsData.ok && poinsData.data) {
        const poinsList = poinsData.data.items || [];
        setPoins(poinsList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(
        "Gagal Memuat Data",
        "Terjadi kesalahan saat memuat data poin.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (poin: Poin) => {
    setDeleteModal({ isOpen: true, poin });
  };

  const confirmDelete = async () => {
    if (!deleteModal.poin) return;

    const poinToDelete = deleteModal.poin;
    setDeleteModal({ isOpen: false, poin: null });

    try {
      const response = await poinsAPI.remove(poinToDelete.id);
      if (response.ok) {
        toast.delete(
          "Berhasil Dihapus!",
          `Poin <strong class="text-red-600">"${poinToDelete.title}"</strong> telah dihapus`,
        );
        await fetchData();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting poin:", error);
      toast.error("Gagal Menghapus!", "Terjadi kesalahan saat menghapus poin.");
    }
  };

  const filteredPoins = poins.filter((poin) =>
    poin.title.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: poins.length,
    withMedia: poins.filter((p) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const media = (p as any).poin_media || (p as any).media || [];
      return media.length > 0;
    }).length,
    videos: poins.filter((p) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const media = (p as any).poin_media || (p as any).media || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return media.some((m: any) => m.media_type === "video");
    }).length,
  };

  if (loading) {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {material?.title || "Kelola Poin"}
              </h1>
              <p className="text-gray-600">
                Kelola dan atur poin-poin pembelajaran
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
                  Total Poin
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
                  Dengan Media
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.withMedia}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Video</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.videos}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#578FCA] to-[#27548A]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-white">Daftar Poin</h2>
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    placeholder="Cari poin..."
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
                  onClick={() =>
                    router.push(
                      `/admin/modul/create-poin?materialId=${materialId}`,
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#578FCA] hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Poin</span>
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
                    Judul Poin
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Durasi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Media
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPoins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <BookOpen className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-lg font-medium">
                          Tidak ada poin ditemukan
                        </p>
                        <p className="text-sm mt-1">
                          {search
                            ? "Coba kata kunci lain"
                            : "Mulai dengan menambah poin baru"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPoins.map((poin, index) => {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const media =
                      (poin as any).poin_media || (poin as any).media || [];
                    const hasVideo = media.some(
                      (m: any) => m.media_type === "video",
                    );
                    const hasImage = media.some(
                      (m: any) => m.media_type === "image",
                    );
                    /* eslint-enable @typescript-eslint/no-explicit-any */

                    return (
                      <tr
                        key={poin.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {poin.title}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {poin.duration_minutes
                                ? `${poin.duration_minutes} menit`
                                : "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {media.length > 0 ? (
                              <>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                  {media.length} file
                                </span>
                                {hasVideo && (
                                  <Video className="w-4 h-4 text-purple-500" />
                                )}
                                {hasImage && (
                                  <ImageIcon className="w-4 h-4 text-blue-500" />
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Tidak ada media
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                router.push(`/admin/modul/edit-poin/${poin.id}`)
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
                              title="Lihat"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/admin/modul/edit-poin/${poin.id}`)
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(poin)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
                  Apakah Anda yakin ingin menghapus poin ini?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Poin:</p>
              <p className="font-semibold text-gray-800">
                {deleteModal.poin?.title}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, poin: null })}
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

      <ToastContainer />
    </div>
  );
}
