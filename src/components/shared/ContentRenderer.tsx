"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

interface MediaItem {
  id: string;
  file_url: string;
  mime_type: string;
  original_filename?: string;
}

interface ContentRendererProps {
  htmlContent: string;
  mediaItems?: MediaItem[];
  className?: string;
}

/**
 * ContentRenderer - Render HTML content with media placeholders replaced
 * Simplified version for admin preview
 */
export default function ContentRenderer({
  htmlContent,
  mediaItems = [],
  className = "",
}: ContentRendererProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const processedContent = useMemo(() => {
    let processed = htmlContent || "";

    // Replace media placeholders
    if (mediaItems && mediaItems.length > 0) {
      mediaItems.forEach((media) => {
        const placeholderFormats = [
          `[MEDIA_PLACEHOLDER_${media.id}]`,
          `[MEDIA_PLACEHOLDER${media.id}]`,
          `[MEDIAPLACEHOLDER_${media.id}]`,
          `[MEDIAPLACEHOLDER${media.id}]`,
        ];

        let placeholderFound = "";
        for (const format of placeholderFormats) {
          if (processed.includes(format)) {
            placeholderFound = format;
            break;
          }
        }

        if (placeholderFound) {
          let mediaHtml = "";

          if (media.mime_type.startsWith("image/")) {
            mediaHtml = `
              <div class="media-item image-wrapper my-3">
                <div class="relative group max-w-xs">
                  <img
                    src="${media.file_url}"
                    alt="Gambar ilustrasi"
                    class="w-full h-auto rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                    loading="lazy"
                    data-zoomable-image="${media.file_url}"
                  />
                  <button
                    class="absolute bottom-2 right-2 w-8 h-8 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                    data-zoom-button="${media.file_url}"
                    title="Klik untuk memperbesar gambar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                      <line x1="11" x2="11" y1="8" y2="14"></line>
                      <line x1="8" x2="14" y1="11" y2="11"></line>
                    </svg>
                  </button>
                </div>
              </div>
            `;
          } else if (media.mime_type.startsWith("video/")) {
            mediaHtml = `
              <div class="media-item video-wrapper my-6">
                <video
                  controls
                  class="w-full rounded-lg shadow-md border border-gray-200"
                  preload="metadata"
                >
                  <source src="${media.file_url}" type="${media.mime_type}" />
                  Browser Anda tidak mendukung video HTML5.
                </video>
              </div>
            `;
          } else if (media.mime_type.startsWith("audio/")) {
            mediaHtml = `
              <div class="media-item audio-wrapper my-6">
                <audio
                  controls
                  class="w-full rounded-lg shadow-sm border border-gray-200"
                  preload="metadata"
                >
                  <source src="${media.file_url}" type="${media.mime_type}" />
                  Browser Anda tidak mendukung audio HTML5.
                </audio>
              </div>
            `;
          }

          processed = processed.replace(placeholderFound, mediaHtml);
        }
      });
    }

    // Convert markdown to HTML
    if (
      processed.includes("###") ||
      processed.includes("##") ||
      processed.includes("#")
    ) {
      processed = processed.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
      processed = processed.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
      processed = processed.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
      processed = processed.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");
    }

    // Convert **bold** and __bold__ to <strong>
    processed = processed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    processed = processed.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Convert *italic* and _italic_ to <em>
    processed = processed.replace(/\*(.+?)\*/g, "<em>$1</em>");
    processed = processed.replace(/_(.+?)_/g, "<em>$1</em>");

    return processed;
  }, [htmlContent, mediaItems]);

  // Handle zoom functionality
  React.useEffect(() => {
    const handleZoomClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("[data-zoom-button]") as HTMLElement;
      if (button) {
        e.preventDefault();
        const imageUrl = button.getAttribute("data-zoom-button");
        if (imageUrl) {
          setSelectedImage(imageUrl);
        }
      }
    };

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const img = target.closest("[data-zoomable-image]") as HTMLElement;
      if (img) {
        const imageUrl = img.getAttribute("data-zoomable-image");
        if (imageUrl) {
          setSelectedImage(imageUrl);
        }
      }
    };

    document.addEventListener("click", handleZoomClick);
    document.addEventListener("click", handleImageClick);

    return () => {
      document.removeEventListener("click", handleZoomClick);
      document.removeEventListener("click", handleImageClick);
    };
  }, []);

  if (!htmlContent) {
    return (
      <div className={className}>
        <p className="text-gray-500 italic text-center py-8">Konten kosong</p>
      </div>
    );
  }

  return (
    <>
      <div className={`learning-content ${className}`}>
        <style jsx>{`
          .learning-content {
            line-height: 1.8;
            color: #374151;
          }

          .learning-content :global(h1) {
            font-size: 1.75rem;
            font-weight: 800;
            color: #27548a;
            margin: 1.5rem 0 1rem;
          }

          .learning-content :global(h2) {
            font-size: 1.5rem;
            font-weight: 700;
            color: #578fca;
            margin: 1.25rem 0 0.75rem;
          }

          .learning-content :global(h3) {
            font-size: 1.25rem;
            font-weight: 600;
            color: #578fca;
            margin: 1rem 0 0.5rem;
          }

          .learning-content :global(p) {
            margin: 0.75rem 0;
            text-align: justify;
          }

          .learning-content :global(strong) {
            font-weight: 700;
            color: #1f2937;
          }

          .learning-content :global(em) {
            font-style: italic;
          }

          .learning-content :global(ul),
          .learning-content :global(ol) {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }

          .learning-content :global(li) {
            margin: 0.5rem 0;
          }

          .learning-content :global(blockquote) {
            border-left: 4px solid #578fca;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #4b5563;
            font-style: italic;
          }
        `}</style>
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt="Gambar diperbesar"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
