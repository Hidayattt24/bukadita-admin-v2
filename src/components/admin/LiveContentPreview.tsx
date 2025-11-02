"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
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

export default function LiveContentPreview({
  blocks,
  title = "Preview Konten",
}: LiveContentPreviewProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "w-full",
  };

  const alignmentClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

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
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto" style={{
          color: '#111827'
        }}>
          {sortedBlocks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Belum ada konten</p>
              <p className="text-xs mt-1">
                Tambahkan teks atau media untuk melihat preview
              </p>
            </div>
          ) : (
            <div className="space-y-6 preview-content">
              {sortedBlocks.map((block) => (
                <div key={block.id}>
                  {block.type === "text" && block.content?.trim() ? (
                    <div className="prose prose-sm max-w-none" style={{ color: '#111827' }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderContent(block.content, true),
                        }}
                        style={{ color: '#111827' }}
                      />
                    </div>
                  ) : block.type === "media" && (block.file || block.preview) ? (
                    <div
                      className={`${alignmentClasses[block.alignment || "center"]} ${
                        sizeClasses[block.size || "medium"]
                      }`}
                    >
                      {/* Image Preview */}
                      {(block.file?.type.startsWith("image/") ||
                        block.preview?.includes("image") ||
                        block.preview?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) &&
                      !imageErrors.has(block.id) ? (
                        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <Image
                            src={
                              block.preview ||
                              (block.file ? URL.createObjectURL(block.file) : "")
                            }
                            alt={block.caption || "Media"}
                            width={800}
                            height={600}
                            className="w-full h-auto"
                            unoptimized
                            onError={() =>
                              setImageErrors((prev) => new Set(prev).add(block.id))
                            }
                          />
                          {block.caption && (
                            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                              <p className="text-sm text-gray-900 italic">
                                {block.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : block.file?.type.startsWith("video/") ? (
                        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <video
                            src={URL.createObjectURL(block.file)}
                            controls
                            className="w-full"
                          />
                          {block.caption && (
                            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                              <p className="text-sm text-gray-900 italic">
                                {block.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                          <div className="text-gray-400 mb-2">
                            <svg
                              className="w-12 h-12 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500">
                            {block.file
                              ? `File: ${block.file.name}`
                              : "Media akan ditampilkan di sini"}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
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
