"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowLeft, Plus, Edit, Trash2, Eye, FileText, Video, ImageIcon } from "lucide-react";
import { poinDetailService, enhancedMaterialService, type PoinDetailRecord, type MaterialRecordWithPoins } from "@/lib/api/poin-details";

interface MaterialPoinManagerProps {
  materialId: string;
}

export default function MaterialPoinManager({ materialId }: MaterialPoinManagerProps) {
  const router = useRouter();
  const [material, setMaterial] = useState<MaterialRecordWithPoins | null>(null);
  const [poins, setPoins] = useState<PoinDetailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPoin, setShowAddPoin] = useState(false);

  // Add poin form state
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [type, setType] = useState<"text" | "video" | "image">("text");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load material and poin details
  useEffect(() => {
    const loadMaterial = async () => {
      setLoading(true);
      try {
        const res = await enhancedMaterialService.getWithPoins(materialId);
        if (res.ok) {
          setMaterial(res.data);
          setPoins(res.data.poin_details || []);
        } else {
          await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat materi' });
        }
      } catch (error) {
        console.error('Error loading material:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat memuat materi' });
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [materialId]);

  const resetForm = () => {
    setTitle("");
    setContentHtml("");
    setType("text");
    setDurationMinutes("");
  };

  const getTypeIcon = (type: "text" | "video" | "image") => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "image": return <ImageIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: "text" | "video" | "image") => {
    switch (type) {
      case "video": return "Video";
      case "image": return "Gambar";
      default: return "Teks";
    }
  };

  const getTypeColor = (type: "text" | "video" | "image") => {
    switch (type) {
      case "video": return "bg-purple-100 text-purple-800";
      case "image": return "bg-green-100 text-green-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const handleAddPoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Judul poin harus diisi' });
      return;
    }

    if (!contentHtml.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Konten poin harus diisi' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        sub_materi_id: materialId,
        title: title.trim(),
        content_html: contentHtml.trim(),
        type,
        order_index: poins.length + 1,
        duration_minutes: durationMinutes ? Number(durationMinutes) : undefined,
      };

      const res = await poinDetailService.create(payload);
      if (res.ok) {
        // Reload material to get updated poins
        const materialRes = await enhancedMaterialService.getWithPoins(materialId);
        if (materialRes.ok) {
          setMaterial(materialRes.data);
          setPoins(materialRes.data.poin_details || []);
        }
        resetForm();
        setShowAddPoin(false);
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Poin berhasil ditambahkan', timer: 1500, showConfirmButton: false });
      } else {
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menambah poin' });
      }
    } catch (error) {
      console.error('Error adding poin:', error);
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat menambah poin' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPoin = async (poin: PoinDetailRecord) => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Edit Poin',
      html: `
        <div class="text-left">
          <label class="block text-sm font-medium mb-1">Judul:</label>
          <input id="edit-title" class="swal2-input" value="${poin.title}" placeholder="Judul poin...">
          
          <label class="block text-sm font-medium mb-1 mt-3">Tipe:</label>
          <select id="edit-type" class="swal2-select">
            <option value="text" ${poin.type === 'text' ? 'selected' : ''}>Teks</option>
            <option value="video" ${poin.type === 'video' ? 'selected' : ''}>Video</option>
            <option value="image" ${poin.type === 'image' ? 'selected' : ''}>Gambar</option>
          </select>
          
          <label class="block text-sm font-medium mb-1 mt-3">Durasi (menit):</label>
          <input id="edit-duration" class="swal2-input" type="number" min="0" value="${poin.duration_minutes || ''}" placeholder="Durasi estimasi...">
          
          <label class="block text-sm font-medium mb-1 mt-3">Konten HTML:</label>
          <textarea id="edit-content" class="swal2-textarea" placeholder="Konten poin...">${poin.content_html}</textarea>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById('edit-title') as HTMLInputElement)?.value?.trim();
        const type = (document.getElementById('edit-type') as HTMLSelectElement)?.value as "text" | "video" | "image";
        const duration = (document.getElementById('edit-duration') as HTMLInputElement)?.value;
        const content = (document.getElementById('edit-content') as HTMLTextAreaElement)?.value?.trim();

        if (!title) {
          Swal.showValidationMessage('Judul harus diisi');
          return null;
        }

        if (!content) {
          Swal.showValidationMessage('Konten harus diisi');
          return null;
        }

        return {
          title,
          type,
          content_html: content,
          duration_minutes: duration ? Number(duration) : undefined,
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      width: 600,
    });

    if (isConfirmed && formValues) {
      try {
        const res = await poinDetailService.update(poin.id, formValues);
        if (res.ok) {
          // Reload material
          const materialRes = await enhancedMaterialService.getWithPoins(materialId);
          if (materialRes.ok) {
            setMaterial(materialRes.data);
            setPoins(materialRes.data.poin_details || []);
          }
          await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Poin berhasil diperbarui', timer: 1500, showConfirmButton: false });
        } else {
          await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memperbarui poin' });
        }
      } catch (error) {
        console.error('Error updating poin:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat memperbarui poin' });
      }
    }
  };

  const handleDeletePoin = async (poin: PoinDetailRecord) => {
    const result = await Swal.fire({
      title: 'Hapus Poin?',
      text: `Poin "${poin.title}" akan dihapus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await poinDetailService.remove(poin.id);
        if (res.ok) {
          // Reload material
          const materialRes = await enhancedMaterialService.getWithPoins(materialId);
          if (materialRes.ok) {
            setMaterial(materialRes.data);
            setPoins(materialRes.data.poin_details || []);
          }
          await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Poin berhasil dihapus', timer: 1500, showConfirmButton: false });
        } else {
          await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghapus poin' });
        }
      } catch (error) {
        console.error('Error deleting poin:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat menghapus poin' });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat materi...</div>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Materi tidak ditemukan</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{material.title}</h1>
          {material.content && (
            <div className="text-gray-600 mb-4 max-h-24 overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: material.content.slice(0, 200) + '...' }} />
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>{poins.length} Poin</span>
            {material.published ? (
              <span className="text-green-600">Terbit</span>
            ) : (
              <span className="text-gray-500">Draf</span>
            )}
          </div>
        </div>
      </div>

      {/* Add Poin Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddPoin(!showAddPoin)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Poin
        </button>
      </div>

      {/* Add Poin Form */}
      {showAddPoin && (
        <form onSubmit={handleAddPoin} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah Poin Baru</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul Poin *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan judul poin..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Konten *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "text" | "video" | "image")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="text">Teks</option>
                  <option value="video">Video</option>
                  <option value="image">Gambar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durasi (menit)</label>
                <input
                  type="number"
                  min="0"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Estimasi waktu baca/tonton"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konten HTML *</label>
              <textarea
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
                placeholder="Masukkan konten HTML untuk poin ini..."
                required
              />
              <div className="mt-1 text-xs text-gray-500">
                Gunakan HTML untuk format konten. Contoh: &lt;p&gt;, &lt;img&gt;, &lt;video&gt;, &lt;ul&gt;, dll.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Poin'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddPoin(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Poins List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Poin ({poins.length})</h2>
        </div>

        {poins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada poin. Klik &quot;Tambah Poin&quot; untuk mulai membuat konten materi.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {poins
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((poin, index) => (
                <div key={poin.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-md font-medium text-gray-900">
                          {index + 1}. {poin.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(poin.type)}`}>
                          {getTypeIcon(poin.type)}
                          {getTypeLabel(poin.type)}
                        </span>
                        {poin.duration_minutes && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {poin.duration_minutes} menit
                          </span>
                        )}
                      </div>

                      <div className="prose prose-sm max-w-none text-gray-600">
                        <div dangerouslySetInnerHTML={{ __html: poin.content_html.slice(0, 300) + (poin.content_html.length > 300 ? '...' : '') }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditPoin(poin)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePoin(poin)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}