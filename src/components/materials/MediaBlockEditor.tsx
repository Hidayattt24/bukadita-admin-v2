"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  RefreshCw,
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
}

export default function MediaBlockEditor({
  file,
  preview,
  caption = "",
  onFileChange,
  onCaptionChange,
}: MediaBlockEditorProps) {
  const [imageError, setImageError] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Langsung set file tanpa crop modal
      onFileChange(selectedFile);
      setImageError(false);
    }
  };

  const isImage = file?.type.startsWith("image/") || preview?.includes("image");
  const isVideo = file?.type.startsWith("video/");

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-gray-900" />
        </div>
        <span className="font-semibold text-gray-900">Media</span>
      </div>

      {/* File Upload or Preview */}
      {!file && !preview ? (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#578FCA] hover:bg-gradient-to-br hover:from-[#27548A]/5 hover:to-[#578FCA]/5 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#27548A]" />
            </div>
            <p className="text-sm text-gray-900 font-semibold mb-1">
              Klik untuk upload gambar atau video
            </p>
            <p className="text-xs text-gray-600">
              PNG, JPG, GIF, MP4, WebM (Max 50MB)
            </p>
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
          {/* Preview - Centered with medium size */}
          <div className="max-w-2xl mx-auto">
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

          {/* Change File Button */}
          <div className="flex justify-center">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:from-[#4579b0] hover:to-[#1e3f6b] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg">
              <RefreshCw className="w-4 h-4" />
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
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all"
          />
        </div>
      )}
    </div>
  );
}
