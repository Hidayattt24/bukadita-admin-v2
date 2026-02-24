"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

interface MediaItem {
  id: string;
  file_url: string;
  mime_type: string;
  caption?: string;
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
              <div class="media-item image-wrapper my-3" data-media-id="${media.id}">
                <div class="relative group max-w-xs">
                  <img
                    src="${media.file_url}"
                    alt="${media.caption || "Gambar ilustrasi"}"
                    class="w-full h-auto rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                    loading="lazy"
                    data-zoomable-image="${media.file_url}"
                  />
                  <!-- Hover overlay with full "Perbesar" button -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      class="bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                      data-zoom-button="${media.file_url}"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                        <line x1="11" x2="11" y1="8" y2="14"></line>
                        <line x1="8" x2="14" y1="11" y2="11"></line>
                      </svg>
                      Perbesar
                    </button>
                  </div>
                  <!-- Persistent small zoom indicator (always visible) -->
                  <button
                    class="absolute bottom-2 right-2 w-8 h-8 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 z-10"
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
                ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ""}
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
                ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ""}
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
                ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ""}
              </div>
            `;
          } else {
            // Other file types - download link
            mediaHtml = `
              <div class="media-item file-wrapper my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <a
                  href="${media.file_url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  <span>Download: ${media.original_filename || "File"}</span>
                </a>
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
          /* ========================================
           ENHANCED LEARNING CONTENT STYLES
           Membuat konten pembelajaran lebih menarik
           ======================================== */

          .learning-content {
            line-height: 1.8;
            color: #374151;
          }

          /* ===== HEADINGS - Compact ===== */
          .learning-content :global(h1) {
            font-size: 1.75rem;
            font-weight: 800;
            color: #27548a;
            background: linear-gradient(135deg, #578fca 0%, #27548a 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-top: 1.75rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #e5f0ff;
            position: relative;
          }

          .learning-content :global(h1::before) {
            content: "";
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #578fca, #27548a);
            border-radius: 2px;
          }

          .learning-content :global(h2) {
            font-size: 1.5rem;
            font-weight: 700;
            color: #27548a;
            margin-top: 1.5rem;
            margin-bottom: 0.875rem;
            padding-left: 0.875rem;
            border-left: 4px solid #578fca;
            background: linear-gradient(
              90deg,
              rgba(87, 143, 202, 0.08) 0%,
              transparent 100%
            );
            padding: 0.5rem 0.875rem;
            border-radius: 0 0.5rem 0.5rem 0;
          }

          .learning-content :global(h3) {
            font-size: 1.25rem;
            font-weight: 600;
            color: #578fca;
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
            padding-left: 0.625rem;
            border-left: 3px solid #93c5fd;
          }

          .learning-content :global(h4) {
            font-size: 1.125rem;
            font-weight: 600;
            color: #60a5fa;
            margin-top: 1rem;
            margin-bottom: 0.625rem;
          }

          /* ===== BOLD - Bigger & Branded Color ===== */
          .learning-content :global(strong),
          .learning-content :global(b) {
            font-size: 1.15em;
            font-weight: 700;
            color: #27548a;
            background: linear-gradient(
              135deg,
              rgba(87, 143, 202, 0.12) 0%,
              rgba(39, 84, 138, 0.12) 100%
            );
            padding: 0.125rem 0.35rem;
            border-radius: 0.25rem;
            display: inline-block;
            line-height: 1.6;
          }

          /* ===== ITALIC - Elegant Style ===== */
          .learning-content :global(em),
          .learning-content :global(i) {
            font-style: italic;
            color: #4b5563;
            background: linear-gradient(
              135deg,
              rgba(249, 250, 251, 0.8) 0%,
              rgba(243, 244, 246, 0.8) 100%
            );
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            border-left: 2px solid #93c5fd;
          }

          /* ===== UNDERLINE ===== */
          .learning-content :global(u) {
            text-decoration: none;
            border-bottom: 2px solid #578fca;
            padding-bottom: 2px;
          }

          /* ===== PARAGRAPHS - Compact Spacing ===== */
          .learning-content :global(p) {
            margin-bottom: 0.875rem;
            font-size: 0.95rem;
            line-height: 1.7;
          }

          .learning-content :global(p:first-child) {
            font-size: 1rem;
          }

          /* ===== LISTS - Compact Styling ===== */
          .learning-content :global(ul) {
            margin: 1rem 0;
            padding-left: 0;
            list-style: none;
          }

          .learning-content :global(ul li) {
            position: relative;
            padding-left: 1.75rem;
            margin-bottom: 0.5rem;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            transition: all 0.2s ease;
          }

          .learning-content :global(ul li::before) {
            content: "";
            position: absolute;
            left: 0;
            top: 0.75rem;
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg, #578fca, #27548a);
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(87, 143, 202, 0.3);
          }

          .learning-content :global(ul li:hover) {
            background: rgba(87, 143, 202, 0.05);
            padding-left: 2.25rem;
            border-radius: 0.5rem;
          }

          /* Nested Lists */
          .learning-content :global(ul ul) {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .learning-content :global(ul ul li::before) {
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #93c5fd, #60a5fa);
          }

          /* ===== ORDERED LISTS - Compact Numbered ===== */
          .learning-content :global(ol) {
            margin: 1rem 0;
            padding-left: 0;
            counter-reset: item;
            list-style: none;
          }

          .learning-content :global(ol li) {
            position: relative;
            padding-left: 2.5rem;
            margin-bottom: 0.625rem;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            counter-increment: item;
            transition: all 0.2s ease;
          }

          .learning-content :global(ol li::before) {
            content: counter(item);
            position: absolute;
            left: 0;
            top: 0.35rem;
            width: 2rem;
            height: 2rem;
            background: linear-gradient(135deg, #578fca, #27548a);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.875rem;
            box-shadow: 0 2px 6px rgba(87, 143, 202, 0.4);
          }

          .learning-content :global(ol li:hover) {
            background: rgba(87, 143, 202, 0.05);
            padding-left: 3.25rem;
            border-radius: 0.5rem;
          }

          /* ===== BLOCKQUOTES - Highlight Important Info ===== */
          .learning-content :global(blockquote) {
            margin: 1.75rem 0;
            padding: 1.25rem 1.5rem;
            background: linear-gradient(
              135deg,
              rgba(87, 143, 202, 0.08) 0%,
              rgba(39, 84, 138, 0.08) 100%
            );
            border-left: 5px solid #578fca;
            border-radius: 0 0.75rem 0.75rem 0;
            font-size: 1.05rem;
            font-style: italic;
            color: #1f2937;
            box-shadow: 0 2px 8px rgba(87, 143, 202, 0.1);
            position: relative;
          }

          .learning-content :global(blockquote::before) {
            content: '"';
            position: absolute;
            top: -0.5rem;
            left: 1rem;
            font-size: 4rem;
            color: #578fca;
            opacity: 0.2;
            font-family: Georgia, serif;
          }

          /* ===== CODE - Inline & Block ===== */
          .learning-content :global(code) {
            background: #f3f4f6;
            color: #db2777;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-family: "Courier New", monospace;
            font-size: 0.9em;
            font-weight: 600;
            border: 1px solid #e5e7eb;
          }

          .learning-content :global(pre) {
            background: #1f2937;
            color: #f9fafb;
            padding: 1.25rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .learning-content :global(pre code) {
            background: transparent;
            color: inherit;
            padding: 0;
            border: none;
            font-size: 0.9rem;
          }

          /* ===== LINKS - Branded Style ===== */
          .learning-content :global(a) {
            color: #578fca;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
            position: relative;
          }

          .learning-content :global(a:hover) {
            color: #27548a;
            border-bottom-color: #578fca;
          }

          .learning-content :global(a::after) {
            content: "→";
            margin-left: 0.25rem;
            display: inline-block;
            transition: transform 0.3s ease;
          }

          .learning-content :global(a:hover::after) {
            transform: translateX(4px);
          }

          /* ===== HORIZONTAL RULE ===== */
          .learning-content :global(hr) {
            margin: 2.5rem 0;
            border: none;
            height: 3px;
            background: linear-gradient(
              90deg,
              transparent,
              #578fca,
              transparent
            );
            border-radius: 2px;
          }

          /* ===== TABLES - Clean Design ===== */
          .learning-content :global(table) {
            width: 100%;
            margin: 2rem 0;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }

          .learning-content :global(thead) {
            background: linear-gradient(135deg, #578fca, #27548a);
            color: white;
          }

          .learning-content :global(th) {
            padding: 1rem;
            text-align: left;
            font-weight: 700;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .learning-content :global(td) {
            padding: 0.875rem 1rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .learning-content :global(tbody tr) {
            transition: background 0.2s ease;
          }

          .learning-content :global(tbody tr:hover) {
            background: rgba(87, 143, 202, 0.05);
          }

          .learning-content :global(tbody tr:nth-child(even)) {
            background: #f9fafb;
          }

          .learning-content :global(tbody tr:nth-child(even):hover) {
            background: rgba(87, 143, 202, 0.08);
          }

          /* ===== IMAGES - Responsive & Styled ===== */
          .learning-content :global(img) {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            margin: 1.5rem 0;
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .learning-content :global(img:hover) {
            transform: scale(1.02);
            box-shadow: 0 8px 24px rgba(87, 143, 202, 0.3);
          }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 640px) {
            .learning-content :global(h1) {
              font-size: 1.75rem;
            }

            .learning-content :global(h2) {
              font-size: 1.5rem;
            }

            .learning-content :global(h3) {
              font-size: 1.25rem;
            }

            .learning-content :global(strong),
            .learning-content :global(b) {
              font-size: 1.1em;
            }

            .learning-content :global(ol li),
            .learning-content :global(ul li) {
              padding-left: 2.5rem;
            }

            .learning-content :global(ol li::before) {
              width: 1.75rem;
              height: 1.75rem;
              font-size: 0.8rem;
            }
          }
        `}</style>

        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[90vh] w-full">
            <img
              src={selectedImage}
              alt="Gambar Diperbesar"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
