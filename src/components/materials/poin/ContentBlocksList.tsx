"use client";

import { FileText, ImageIcon, MoveDown, MoveUp, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import MediaBlockEditor from "@/components/materials/MediaBlockEditor";

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

interface ContentBlocksListProps {
  blocks: ContentBlock[];
  onUpdateText: (blockId: string, content: string) => void;
  onUpdateMedia: (blockId: string, file: File) => void;
  onUpdateCaption: (blockId: string, caption: string) => void;
  onUpdateAlignment: (
    blockId: string,
    alignment: "left" | "center" | "right",
  ) => void;
  onUpdateSize: (
    blockId: string,
    size: "small" | "medium" | "large" | "full",
  ) => void;
  onRemove: (blockId: string) => void;
  onMove: (blockId: string, direction: "up" | "down") => void;
}

export default function ContentBlocksList({
  blocks,
  onUpdateText,
  onUpdateMedia,
  onUpdateCaption,
  onUpdateAlignment,
  onUpdateSize,
  onRemove,
  onMove,
}: ContentBlocksListProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-dashed border-gray-300 rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-semibold mb-2">Belum ada konten</p>
        <p className="text-sm text-gray-500">
          Klik &ldquo;Tambah Teks&rdquo; atau &ldquo;Tambah Media&rdquo; untuk
          mulai membuat konten
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="group relative bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 rounded-xl hover:border-[#578FCA]/50 hover:shadow-lg transition-all duration-300"
        >
          {block.type === "text" ? (
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-900" />
                  </div>
                  <span>Blok Teks #{index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(block.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium border border-red-200 hover:border-red-300"
                  title="Hapus blok"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
              <RichTextEditor
                value={block.content || ""}
                onChange={(content) => onUpdateText(block.id, content)}
              />
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-gray-900" />
                  </div>
                  <span>Blok Media #{index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(block.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium border border-red-200 hover:border-red-300"
                  title="Hapus blok"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
              <MediaBlockEditor
                file={block.file}
                preview={block.preview}
                caption={block.caption}
                alignment={block.alignment || "center"}
                size={block.size || "medium"}
                onFileChange={(file: File) => onUpdateMedia(block.id, file)}
                onCaptionChange={(caption: string) =>
                  onUpdateCaption(block.id, caption)
                }
                onAlignmentChange={(alignment: "left" | "center" | "right") =>
                  onUpdateAlignment(block.id, alignment)
                }
                onSizeChange={(size: "small" | "medium" | "large" | "full") =>
                  onUpdateSize(block.id, size)
                }
              />
            </div>
          )}

          {/* Block Controls */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl shadow-xl p-1.5">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => onMove(block.id, "up")}
                  className="p-2.5 hover:bg-[#578FCA]/10 text-gray-600 hover:text-[#27548A] rounded-lg transition-colors"
                  title="Pindah ke atas"
                >
                  <MoveUp className="w-5 h-5" />
                </button>
              )}
              {index < blocks.length - 1 && (
                <button
                  type="button"
                  onClick={() => onMove(block.id, "down")}
                  className="p-2.5 hover:bg-[#578FCA]/10 text-gray-600 hover:text-[#27548A] rounded-lg transition-colors"
                  title="Pindah ke bawah"
                >
                  <MoveDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
