"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { type Poin, type MediaItem } from "@/lib/api";
import ContentRenderer from "@/components/shared/ContentRenderer";

interface MaterialPreviewProps {
  poins: Poin[];
  materialTitle: string;
}

export default function MaterialPreview({
  poins,
  materialTitle,
}: MaterialPreviewProps) {
  const getPoinMedia = (poin: Poin): MediaItem[] => {
    return poin.poin_media || [];
  };

  const sortedPoins = [...poins].sort(
    (a, b) => (a.order_index || 0) - (b.order_index || 0),
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Preview: {materialTitle}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {poins.length} poin pembelajaran tersedia
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedPoins.map((poin, index) => {
          const media = getPoinMedia(poin);

          return (
            <div key={poin.id} className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {index + 1}. {poin.title}
                  </h3>
                  {poin.duration_label && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                      {poin.duration_label}
                    </span>
                  )}
                  {poin.duration_minutes && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {poin.duration_minutes} menit
                    </span>
                  )}
                  {media.length > 0 && (
                    <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                      📎 {media.length} Media
                    </span>
                  )}
                </div>
              </div>

              {/* Use ContentRenderer with enhanced styling */}
              <ContentRenderer
                htmlContent={poin.content_html || "<p>Konten kosong</p>"}
                mediaItems={media}
                className="prose prose-sm max-w-none"
              />
            </div>
          );
        })}
      </div>

      {poins.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">
            Belum ada poin untuk ditampilkan
          </p>
          <p className="text-sm">
            Tambahkan poin di tab &quot;Kelola Poin&quot; terlebih dahulu
          </p>
        </div>
      )}
    </div>
  );
}
