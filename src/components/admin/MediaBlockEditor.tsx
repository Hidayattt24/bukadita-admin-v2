"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";

interface MediaBlockEditorProps {
  file?: File;
  preview?: string;
  caption?: string;
  alignment?: "left" | "center" | "right";
  size?: "small" | "medium" | "large" | "full";
  onFileChange: (file: File) => void;
  onCaptionChange: (caption: string) => void;
  onAlignmentChange?: (alignment: "left" | "center" | "right") => void;
  onSizeChange?: (size: "small" | "medium" | "large" | "full") => void;
  onRemove: () => void;
}

export default function MediaBlockEditor({
  file,
  preview,
  caption = "",
  alignment = "center",
  size = "medium",
  onFileChange,
  onCaptionChange,
  onAlignmentChange,
  onSizeChange,
  onRemove,
}: MediaBlockEditorProps) {
  const [imageError, setImageError] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      setImageError(false);
    }
  };

  const isImage = file?.type.startsWith("image/") || preview?.includes("image");
  const isVideo = file?.type.startsWith("video/");

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
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-700">Media</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
          title="Hapus media"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* File Upload or Preview */}
      {!file && !preview ? (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 mb-1">
              Klik untuk upload gambar atau video
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, WebM (Max 50MB)</p>
          </div>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className={`${alignmentClasses[alignment]} ${sizeClasses[size]}`}>
            {isImage && (preview || file) && !imageError ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={preview || URL.createObjectURL(file!)}
                  alt="Preview"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              </div>
            ) : isVideo && (preview || file) ? (
              <video
                src={preview || URL.createObjectURL(file!)}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Preview tidak tersedia</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Alignment */}
            {onAlignmentChange && (
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300 p-1">
                <button
                  type="button"
                  onClick={() => onAlignmentChange("left")}
                  className={`p-1.5 rounded transition-colors ${
                    alignment === "left"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  title="Rata kiri"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onAlignmentChange("center")}
                  className={`p-1.5 rounded transition-colors ${
                    alignment === "center"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  title="Rata tengah"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onAlignmentChange("right")}
                  className={`p-1.5 rounded transition-colors ${
                    alignment === "right"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  title="Rata kanan"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Size */}
            {onSizeChange && (
              <select
                value={size}
                onChange={(e) =>
                  onSizeChange(e.target.value as "small" | "medium" | "large" | "full")
                }
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Kecil</option>
                <option value="medium">Sedang</option>
                <option value="large">Besar</option>
                <option value="full">Penuh</option>
              </select>
            )}

            {/* Change File */}
            <label className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer transition-colors">
              Ganti File
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Caption */}
          <input
            type="text"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Tambahkan caption (opsional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}
