"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  FileText,
  Image,
} from "lucide-react";
import { useDeleteMaterial } from "@/hooks/useMaterials";
import { useToast } from "@/hooks/useToast";
import type { Material } from "@/lib/api";
import Swal from "sweetalert2";

interface SubMateriCardProps {
  material: Material;
  moduleId: string;
  onRefresh: () => void;
}

export default function SubMateriCard({
  material,
  moduleId,
  onRefresh,
}: SubMateriCardProps) {
  const { toast } = useToast();
  const deleteMaterialMutation = useDeleteMaterial();

  const [isDeleting, setIsDeleting] = useState(false);

  const poinCount = material.poin_details?.length || 0;
  const hasContent = material.content && material.content.length > 0;

  // Count media - safely check if media exists
  const mediaCount =
    material.poin_details?.reduce((count, poin) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const poinAny = poin as any; // Type assertion for media property
      return count + (poinAny.media?.length || 0);
    }, 0) || 0;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Sub-Materi?",
      html: `Apakah Anda yakin ingin menghapus sub-materi<br><strong class="text-red-600">"${material.title}"</strong>?<br><br><span class="text-sm text-slate-600">Tindakan ini tidak dapat dibatalkan.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-6 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-6 py-2.5 font-semibold",
      },
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteMaterialMutation.mutateAsync(material.id);
        toast.delete(
          "Berhasil Dihapus!",
          `Sub-materi <strong class="text-red-600">"${material.title}"</strong> telah dihapus`,
        );
        onRefresh();
      } catch (error) {
        console.error("Error deleting material:", error);
        toast.error(
          "Gagal Menghapus!",
          "Terjadi kesalahan saat menghapus sub-materi.",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className="relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-white transition-all duration-300 hover:-translate-y-1 group"
      style={{
        boxShadow:
          "6px 6px 0px rgba(87, 143, 202, 0.3), 0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 rounded-full blur-xl opacity-60"></div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2.5 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-xl shadow-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 line-clamp-2">
              {material.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium">
                <FileText className="w-3 h-3" />
                {poinCount} Poin
              </span>
              {mediaCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-medium">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="w-3 h-3" aria-hidden="true" />
                  {mediaCount} Media
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ml-2 ${
            material.published
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}
        >
          {material.published ? (
            <>
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Terbit</span>
            </>
          ) : (
            <>
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Draft</span>
            </>
          )}
        </div>
      </div>

      {/* Content Preview */}
      {hasContent && (
        <div className="relative mb-4 p-3 rounded-lg bg-slate-50/50 border border-slate-200">
          <p className="text-xs text-slate-600 line-clamp-2">
            {material.content?.replace(/<[^>]*>/g, "").substring(0, 100)}...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="relative grid grid-cols-2 gap-2 mb-4 pb-4 border-b-2 border-slate-100">
        <Link
          href={`/admin/modul/${moduleId}/materi/${material.id}/poin`}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-semibold text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Kelola Poin</span>
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-semibold text-xs disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>

      {/* Edit Link */}
      <Link
        href={`/admin/modul/${moduleId}/materi/${material.id}/edit`}
        className="relative flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Sub-Materi</span>
      </Link>

      {/* Additional Info */}
      <div className="relative mt-4 pt-4 border-t border-slate-200">
        <div className="text-[10px] text-slate-500">
          Terakhir diupdate:{" "}
          {material.updated_at
            ? new Date(material.updated_at).toLocaleDateString("id-ID")
            : "-"}
        </div>
      </div>
    </div>
  );
}
