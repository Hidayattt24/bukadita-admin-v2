"use client";

import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { renderContent } from "@/lib/markdown-utils";

interface ContentBlock {
  id: string;
  type: "text" | "media";
  order: number;
  content?: string;
  file?: File;
  caption?: string;
  preview?: string;
  alignment?: "left" | "center" | "right";
  size?: "small" | "medium" | "large" | "full";
}

interface LiveContentPreviewProps {
  blocks: ContentBlock[];
  title?: string;
}

// Mock MediaItem interface to match ContentRenderer expectations
interface MockMediaItem {
  id: string;
  file_url: string;
  mime_type: string;
  caption?: string;
  original_filename?: string;
}

export default function LiveContentPreview({
  blocks,
  title = "Preview Konten",
}: LiveContentPreviewProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  // Convert blocks to HTML content and media items for ContentRenderer
  const { htmlContent, mediaItems } = useMemo(() => {
    let html = "";
    const media: MockMediaItem[] = [];

    sortedBlocks.forEach((block) => {
      if (block.type === "text" && block.content?.trim()) {
        // Convert markdown to HTML
        const contentHtml = renderContent(block.content, true);
        html += `<div data-block-id="${block.id}" data-block-type="text" data-block-order="${block.order}">${contentHtml}</div>\n\n`;
      } else if (block.type === "media" && (block.file || block.preview)) {
        // Create media placeholder and add to media items
        const mediaId = block.id;
        html += `<div data-block-id="${mediaId}" data-block-type="media" data-block-order="${block.order}" data-media-caption="${block.caption || ""}" class="media-placeholder">[MEDIA_PLACEHOLDER_${mediaId}]</div>\n\n`;

        // Determine MIME type
        let mimeType = "image/jpeg"; // default
        if (block.file) {
          mimeType = block.file.type;
        } else if (block.preview) {
          if (block.preview.match(/\.(mp4|webm|ogg|avi|mov)$/i)) {
            mimeType = "video/mp4";
          } else if (block.preview.match(/\.(mp3|wav|ogg)$/i)) {
            mimeType = "audio/mpeg";
          } else if (block.preview.match(/\.pdf$/i)) {
            mimeType = "application/pdf";
          }
        }

        // Create mock media item
        const mockMedia: MockMediaItem = {
          id: mediaId,
          file_url: block.preview || (block.file ? URL.createObjectURL(block.file) : ""),
          mime_type: mimeType,
          caption: block.caption,
          original_filename: block.file?.name || "media",
        };

        media.push(mockMedia);
      }
    });

    return { htmlContent: html, mediaItems: media };
  }, [sortedBlocks]);

  return (
    <div className="sticky top-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Live
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
          title={isCollapsed ? "Tampilkan preview" : "Sembunyikan preview"}
        >
          {isCollapsed ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {sortedBlocks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Belum ada konten</p>
              <p className="text-xs mt-1">
                Tambahkan teks atau media untuk melihat preview
              </p>
            </div>
          ) : (
            <ContentRenderer
              htmlContent={htmlContent}
              mediaItems={mediaItems}
              className="prose prose-sm max-w-none"
            />
          )}
        </div>
      )}

      {/* Footer Info */}
      {!isCollapsed && sortedBlocks.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              {sortedBlocks.filter((b) => b.type === "text").length} Teks,{" "}
              {sortedBlocks.filter((b) => b.type === "media").length} Media
            </span>
            <span className="text-green-600 font-medium">● Live Preview</span>
          </div>
        </div>
      )}
    </div>
  );
}
