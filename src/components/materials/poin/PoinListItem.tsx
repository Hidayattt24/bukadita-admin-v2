"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, FileText, Trash2, Video, Paperclip } from "lucide-react";
import type { Poin, MediaItem } from "@/lib/api";

interface PoinListItemProps {
  poin: Poin;
  index: number;
  onEdit: (poin: Poin) => void;
  onDelete: (poin: Poin) => void;
}

export default function PoinListItem({
  poin,
  index,
  onEdit,
  onDelete,
}: PoinListItemProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const getPoinMedia = (poin: Poin): MediaItem[] => {
    return poin.poin_media || [];
  };

  return (
    <div className="p-6 hover:bg-gradient-to-r hover:from-[#27548A]/5 hover:to-[#578FCA]/5 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#27548A] to-[#578FCA] flex items-center justify-center text-white font-bold shadow-md">
              {index + 1}
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#27548A] transition-colors">
              {poin.title}
            </h3>
            {poin.duration_label && (
              <span className="text-xs text-[#27548A] bg-[#578FCA]/10 px-3 py-1.5 rounded-full font-bold border border-[#27548A]/20">
                {poin.duration_label}
              </span>
            )}
            {poin.duration_minutes && (
              <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full font-semibold">
                {poin.duration_minutes} menit
              </span>
            )}
            {getPoinMedia(poin).length > 0 && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                {getPoinMedia(poin).length} Media
              </span>
            )}
          </div>

          {/* Media Preview Thumbnails */}
          {getPoinMedia(poin).length > 0 && (
            <div className="flex gap-2 mb-4">
              {getPoinMedia(poin)
                .slice(0, 4)
                .map((media) => (
                  <div key={media.id} className="flex-shrink-0">
                    {media.mime_type?.startsWith("image/") &&
                    !imageErrors.has(media.id) ? (
                      <Image
                        src={media.file_url}
                        alt={media.caption || media.original_filename}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:border-[#578FCA]/50 transition-all"
                        unoptimized
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(media.id));
                        }}
                        onLoad={() => {
                          setImageErrors((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(media.id);
                            return newSet;
                          });
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-200 flex items-center justify-center shadow-sm">
                        {media.mime_type?.startsWith("video/") ? (
                          <Video className="w-6 h-6 text-purple-600" />
                        ) : media.mime_type?.startsWith("audio/") ? (
                          <FileText className="w-6 h-6 text-blue-600" />
                        ) : media.mime_type === "application/pdf" ? (
                          <FileText className="w-6 h-6 text-red-600" />
                        ) : (
                          <FileText className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              {getPoinMedia(poin).length > 4 && (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center shadow-sm">
                  <span className="text-xs text-gray-700 font-bold">
                    +{getPoinMedia(poin).length - 4}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="prose prose-sm max-w-none text-gray-600 line-clamp-3">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  poin.content_html.slice(0, 200) +
                  (poin.content_html.length > 200 ? "..." : ""),
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(poin)}
            className="p-3 text-[#27548A] hover:text-white bg-[#578FCA]/10 hover:bg-gradient-to-r hover:from-[#27548A] hover:to-[#578FCA] rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(poin)}
            className="p-3 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            title="Hapus"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
