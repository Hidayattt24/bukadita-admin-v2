"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, ImageIcon, Download } from "lucide-react";
import { type Poin, type MediaItem } from "@/lib/api";

interface MaterialPreviewProps {
  poins: Poin[];
  materialTitle: string;
}

export default function MaterialPreview({ poins, materialTitle }: MaterialPreviewProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const getPoinMedia = (poin: Poin): MediaItem[] => {
    return poin.poin_media || [];
  };

  // Process HTML content with media placeholders
  const processContentWithMedia = (html: string, media: MediaItem[]) => {
    if (!html) return { processedHtml: '', hasMedia: false };

    let processedHtml = html;
    let hasMediaPlaceholders = false;

    // First, try to find and replace media placeholders by matching media ID
    media.forEach((mediaItem) => {

      // Try with media ID first (for new content)
      const mediaIdPlaceholderPattern = new RegExp(`\\[MEDIA_PLACEHOLDER_${mediaItem.id}\\]`, 'g');
      const mediaIdDivPattern = new RegExp(
        `<div[^>]*data-block-id="${mediaItem.id}"[^>]*>\\[MEDIA_PLACEHOLDER_${mediaItem.id}\\]</div>`,
        'g'
      );

      if (processedHtml.includes(`MEDIA_PLACEHOLDER_${mediaItem.id}`)) {
        hasMediaPlaceholders = true;
        const mediaHtml = generateMediaHtml(mediaItem);
        processedHtml = processedHtml.replace(mediaIdDivPattern, mediaHtml);
        processedHtml = processedHtml.replace(mediaIdPlaceholderPattern, mediaHtml);
      }
    });

    // If no placeholders found with media IDs, try to find any MEDIA_PLACEHOLDER and match by order
    if (!hasMediaPlaceholders) {
      const placeholderMatches = [...processedHtml.matchAll(/<div[^>]*data-block-type="media"[^>]*data-block-order="(\d+)"[^>]*>\[MEDIA_PLACEHOLDER_([^\]]+)\]<\/div>/g)];

      if (placeholderMatches.length > 0) {
        hasMediaPlaceholders = true;

        // Sort placeholders by order and media by created_at (to maintain input order)
        const sortedMedia = [...media].sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          return 0; // Keep original order if no created_at
        });

        placeholderMatches
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1])) // Sort by data-block-order
          .forEach((match, index) => {
            if (sortedMedia[index]) {
              const mediaHtml = generateMediaHtml(sortedMedia[index]);
              processedHtml = processedHtml.replace(match[0], mediaHtml);
            }
          });
      }
    }

    // If still no placeholders found, try to find any MEDIA_PLACEHOLDER and replace sequentially
    if (!hasMediaPlaceholders) {
      const anyPlaceholderPattern = /\[MEDIA_PLACEHOLDER_[^\]]+\]/g;
      const placeholderMatches = processedHtml.match(anyPlaceholderPattern);

      if (placeholderMatches && placeholderMatches.length > 0) {
        hasMediaPlaceholders = true;

        // Sort media by created_at to maintain input order
        const sortedMedia = [...media].sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          return 0;
        });

        placeholderMatches.forEach((placeholder, index) => {
          if (sortedMedia[index]) {
            const mediaHtml = generateMediaHtml(sortedMedia[index]);
            processedHtml = processedHtml.replace(placeholder, mediaHtml);
          }
        });
      }
    }

    return { processedHtml, hasMedia: hasMediaPlaceholders || media.length > 0 };
  };

  const generateMediaHtml = (media: MediaItem): string => {
    const mimeType = media.mime_type;

    // Handle both full mime types (image/png) and simple types (image)
    const isImage = mimeType?.startsWith('image/') || mimeType === 'image';
    const isVideo = mimeType?.startsWith('video/') || mimeType === 'video';
    const isAudio = mimeType?.startsWith('audio/') || mimeType === 'audio';

    if (isImage) {
      return `
        <div class="my-4">
          <div class="relative">
            <img 
              src="${media.file_url}" 
              alt="${media.caption || 'Gambar'}"
              class="w-full max-w-3xl rounded-lg shadow-sm"
              loading="lazy"
              style="display: none;"
              onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
              onerror="this.style.display='none'; this.nextElementSibling.innerHTML='<div class=&quot;bg-gray-100 rounded-lg flex items-center justify-center h-32&quot;><div class=&quot;text-center text-gray-900&quot;><p class=&quot;text-sm&quot;>Gambar tidak dapat dimuat</p></div></div>';"
            />
            <div class="bg-gray-50 rounded-lg flex items-center justify-center h-32">
              <div class="text-center text-gray-500">
                <div class="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                <p class="text-sm">Memuat gambar...</p>
              </div>
            </div>
          </div>
          ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ''}
        </div>
      `;
    }

    if (isVideo) {
      return `
        <div class="my-4">
          <video src="${media.file_url}" controls class="w-full max-w-3xl rounded-lg shadow-sm" preload="metadata">
            Browser tidak mendukung video.
          </video>
          ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ''}
        </div>
      `;
    }

    if (isAudio) {
      return `
        <div class="my-4">
          <audio src="${media.file_url}" controls class="w-full max-w-md" preload="metadata">Browser tidak mendukung audio.</audio>
          ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ''}
        </div>
      `;
    }

    // Other file types
    return `
      <div class="my-4">
        <a href="${media.file_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          ${mimeType === 'application/pdf' ? 'Buka PDF' : 'Download File'}
        </a>
        ${media.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${media.caption}</p>` : ''}
      </div>
    `;
  };



  const renderMediaItem = (media: MediaItem) => {
    const mimeType = media.mime_type;

    // Handle both full mime types (image/png) and simple types (image)
    const isImage = mimeType?.startsWith('image/') || mimeType === 'image';
    const isVideo = mimeType?.startsWith('video/') || mimeType === 'video';
    const isAudio = mimeType?.startsWith('audio/') || mimeType === 'audio';

    if (isImage) {
      if (imageErrors.has(media.id)) {
        return (
          <div className="bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Gambar tidak dapat dimuat</p>
            </div>
          </div>
        );
      }

      return (
        <div className="relative">
          <Image
            src={media.file_url}
            alt={media.caption || 'Gambar'}
            width={800}
            height={600}
            className="w-full max-w-3xl rounded-lg shadow-sm"
            unoptimized
            onError={() => setImageErrors(prev => new Set(prev).add(media.id))}
            onLoad={() => {
              setImageErrors(prev => {
                const newSet = new Set(prev);
                newSet.delete(media.id);
                return newSet;
              });
            }}
          />
          {media.caption && <p className="text-sm text-gray-600 mt-2 italic">{media.caption}</p>}
        </div>
      );
    }

    if (isVideo) {
      return (
        <div>
          <video src={media.file_url} controls className="w-full max-w-3xl rounded-lg shadow-sm" preload="metadata">
            Browser tidak mendukung video.
          </video>
          {media.caption && <p className="text-sm text-gray-600 mt-2 italic">{media.caption}</p>}
        </div>
      );
    }

    if (isAudio) {
      return (
        <div>
          <audio src={media.file_url} controls className="w-full max-w-md" preload="metadata">Browser tidak mendukung audio.</audio>
          {media.caption && <p className="text-sm text-gray-600 mt-2 italic">{media.caption}</p>}
        </div>
      );
    }

    return (
      <div>
        <a href={media.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          {mimeType === 'application/pdf' ? 'Buka PDF' : 'Download File'}
        </a>
        {media.caption && <p className="text-sm text-gray-600 mt-2 italic">{media.caption}</p>}
      </div>
    );
  };

  const sortedPoins = [...poins].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Preview: {materialTitle}</h2>
        <p className="text-sm text-gray-600 mt-1">{poins.length} poin pembelajaran tersedia</p>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedPoins.map((poin, index) => {
          const media = getPoinMedia(poin);
          const { processedHtml, hasMedia } = processContentWithMedia(poin.content_html, media);

          return (
            <div key={poin.id} className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{index + 1}. {poin.title}</h3>
                  {poin.duration_label && (<span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">{poin.duration_label}</span>)}
                  {poin.duration_minutes && (<span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{poin.duration_minutes} menit</span>)}
                  {hasMedia && (<span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">📎 {media.length} Media</span>)}
                </div>
              </div>

              <div className="prose prose-sm max-w-none preview-content">
                {/* Always show processed HTML if it has meaningful content, otherwise use fallback */}
                {processedHtml && processedHtml !== poin.content_html ? (
                  <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                ) : (
                  // Fallback: show original content + media inline (no separate section header)
                  <>
                    <div dangerouslySetInnerHTML={{ __html: poin.content_html || '<p>Konten kosong</p>' }} />
                    {media.length > 0 && (
                      <div className="space-y-4 mt-6">
                        {/* Sort media by created_at to maintain input order */}
                        {[...media]
                          .sort((a, b) => {
                            if (a.created_at && b.created_at) {
                              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                            }
                            return 0;
                          })
                          .map((mediaItem) => (
                            <div key={mediaItem.id} className="my-4">{renderMediaItem(mediaItem)}</div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {poins.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Belum ada poin untuk ditampilkan</p>
          <p className="text-sm">Tambahkan poin di tab &quot;Kelola Poin&quot; terlebih dahulu</p>
        </div>
      )}
    </div>
  );
}