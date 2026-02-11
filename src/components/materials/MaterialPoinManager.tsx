"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  Trash2,
  FileText,
  Video,
  ImageIcon,
  MoveUp,
  MoveDown,
} from "lucide-react";
import {
  poinsAPI,
  materialsAPI,
  type Poin,
  type Material,
  type MediaItem,
} from "@/lib/api";
import { renderContent, htmlToMarkdown } from "@/lib/markdown-utils";

import MaterialPreview from "@/components/materials/MaterialPreview";
import RichTextEditor from "@/components/shared/RichTextEditor";
import MediaBlockEditor from "@/components/materials/MediaBlockEditor";
import LiveContentPreview from "@/components/materials/LiveContentPreview";

// Import poin management sub-components
import {
  MaterialHeader,
  TabsNavigation,
  AddPoinButton,
  PoinList,
} from "@/components/materials/poin";

// Alias for backward compatibility
type PoinDetailRecord = Poin;
type MaterialRecordWithPoins = Material;

interface MaterialPoinManagerProps {
  materialId: string;
}

export default function MaterialPoinManager({
  materialId,
}: MaterialPoinManagerProps) {
  const [material, setMaterial] = useState<MaterialRecordWithPoins | null>(
    null,
  );
  const [poins, setPoins] = useState<PoinDetailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPoin, setShowAddPoin] = useState(false);
  const [showEditPoin, setShowEditPoin] = useState(false);
  const [editingPoin, setEditingPoin] = useState<PoinDetailRecord | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Block-based editor interfaces
  interface ContentBlock {
    id: string;
    type: "text" | "media";
    order: number;
    content?: string; // for text blocks
    file?: File; // for media blocks
    caption?: string; // for media blocks
    preview?: string; // for media blocks preview
    alignment?: "left" | "center" | "right"; // for media blocks
    size?: "small" | "medium" | "large" | "full"; // for media blocks
  }

  // Add/Edit poin form state
  const [title, setTitle] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: "1", type: "text", order: 0, content: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Edit form existing media state
  interface EditableMediaItem extends MediaItem {
    captionChanged?: boolean;
  }
  const [existingMedia, setExistingMedia] = useState<EditableMediaItem[]>([]);
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);

  // Tab state
  const [activeTab, setActiveTab] = useState<"manage" | "preview">("manage");

  // Ref for scrolling to newly added blocks
  const contentBlocksContainerRef = useRef<HTMLDivElement>(null);
  const latestBlockRef = useRef<HTMLDivElement>(null);

  // Helper function to get media from poin (backend now consistently uses poin_media)
  const getPoinMedia = (poin: PoinDetailRecord): MediaItem[] => {
    return poin.poin_media || [];
  };

  // Block editor functions
  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "text",
      order: contentBlocks.length,
      content: "",
    };
    setContentBlocks([...contentBlocks, newBlock]);

    // Smooth scroll to the new block
    setTimeout(() => {
      latestBlockRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const addMediaBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "media",
      order: contentBlocks.length,
      caption: "",
    };
    setContentBlocks([...contentBlocks, newBlock]);

    // Smooth scroll to the new block
    setTimeout(() => {
      latestBlockRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const updateTextBlock = (blockId: string, content: string) => {
    setContentBlocks((blocks) =>
      blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block,
      ),
    );
  };

  const updateMediaBlock = (
    blockId: string,
    file: File,
    caption: string = "",
  ) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setContentBlocks((blocks) =>
      blocks.map((block) =>
        block.id === blockId
          ? { ...block, file, caption, preview: previewUrl }
          : block,
      ),
    );
  };

  const removeBlock = async (blockId: string) => {
    const result = await Swal.fire({
      title:
        '<span style="color: #1f2937; font-size: 24px; font-weight: 700;">Hapus Blok? 🗑️</span>',
      html: '<p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Apakah Anda yakin ingin menghapus blok ini? Tindakan ini tidak dapat dibatalkan.</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: '<span style="font-weight: 600;">✓ Ya, Hapus</span>',
      cancelButtonText: '<span style="font-weight: 600;">✕ Batal</span>',
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl shadow-2xl border-2 border-gray-100",
        title: "text-2xl font-bold",
        htmlContainer: "text-base",
        confirmButton:
          "px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
        cancelButton:
          "px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300",
      },
      buttonsStyling: true,
    });

    if (result.isConfirmed) {
      setContentBlocks((blocks) => {
        const filtered = blocks.filter((block) => block.id !== blockId);
        // Reorder remaining blocks
        return filtered.map((block, index) => ({ ...block, order: index }));
      });

      Swal.fire({
        title:
          '<span style="color: #059669; font-size: 24px; font-weight: 700;">Berhasil! ✓</span>',
        html: '<p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Blok telah dihapus dari konten</p>',
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl border-2 border-green-100",
        },
      });
    }
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    setContentBlocks((blocks) => {
      const index = blocks.findIndex((b) => b.id === blockId);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === blocks.length - 1)
      ) {
        return blocks;
      }

      const newBlocks = [...blocks];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      // Swap elements
      [newBlocks[index], newBlocks[newIndex]] = [
        newBlocks[newIndex],
        newBlocks[index],
      ];

      // Update order indices
      return newBlocks.map((block, idx) => ({ ...block, order: idx }));
    });
  };

  // Convert blocks to HTML for backend storage
  const convertBlocksToHTML = () => {
    return contentBlocks
      .sort((a, b) => a.order - b.order) // Ensure correct order
      .map((block) => {
        if (block.type === "text" && block.content?.trim()) {
          // Convert markdown to HTML with preserved newlines
          const contentHtml = renderContent(block.content, true);
          return `<div data-block-id="${block.id}" data-block-type="text" data-block-order="${block.order}">${contentHtml}</div>`;
        } else if (block.type === "media") {
          // Create placeholder for media that will be replaced during preview
          return `<div data-block-id="${
            block.id
          }" data-block-type="media" data-block-order="${
            block.order
          }" data-media-caption="${
            block.caption || ""
          }" class="media-placeholder">[MEDIA_PLACEHOLDER_${block.id}]</div>`;
        }
        return "";
      })
      .filter((html) => html.trim())
      .join("\n\n");
  };

  // Get media files from blocks for upload
  const getBlockMediaFiles = () => {
    return contentBlocks
      .filter((block) => block.type === "media" && block.file)
      .map((block) => ({
        file: block.file!,
        caption: block.caption || "",
        blockId: block.id,
        order: block.order,
      }));
  };

  // Update HTML content to replace block IDs with actual media IDs after upload
  const updateHtmlWithMediaIds = (
    html: string,
    mediaMapping: Record<string, string>,
  ) => {
    let updatedHtml = html;

    Object.entries(mediaMapping).forEach(([blockId, mediaId]) => {
      // Update both placeholder text and div attributes
      updatedHtml = updatedHtml.replace(
        new RegExp(`\\[MEDIA_PLACEHOLDER_${blockId}\\]`, "g"),
        `[MEDIA_PLACEHOLDER_${mediaId}]`,
      );
      updatedHtml = updatedHtml.replace(
        new RegExp(`data-block-id="${blockId}"`, "g"),
        `data-block-id="${mediaId}"`,
      );
    });

    return updatedHtml;
  };

  // Parse existing HTML content back to blocks (for editing)
  const parseHTMLToBlocks = (html: string, media: MediaItem[] = []) => {
    const blocks: ContentBlock[] = [];

    if (html) {
      // Split by double newlines to get individual block parts
      const parts = html.split("\n\n").filter((part) => part.trim());

      parts.forEach((part) => {
        // Check if this is a media placeholder
        if (
          part.includes('data-block-type="media"') &&
          part.includes("MEDIA_PLACEHOLDER_")
        ) {
          // Extract media block info from placeholder
          const blockIdMatch = part.match(/data-block-id="([^"]+)"/);
          const orderMatch = part.match(/data-block-order="([^"]+)"/);
          const captionMatch = part.match(/data-media-caption="([^"]*)"/);
          const placeholderMatch = part.match(/\[MEDIA_PLACEHOLDER_([^\]]+)\]/);

          if (blockIdMatch && placeholderMatch) {
            const blockId = blockIdMatch[1];
            const order = orderMatch ? parseInt(orderMatch[1]) : blocks.length;
            const caption = captionMatch ? captionMatch[1] : "";

            // Try to find matching media item
            const mediaItem = media.find(
              (m) =>
                m.id === blockId || part.includes(`MEDIA_PLACEHOLDER_${m.id}`),
            );

            blocks.push({
              id: blockId,
              type: "media",
              order: order,
              caption: caption,
              preview: mediaItem?.file_url,
            });
          }
        } else if (
          part.includes('data-block-type="text"') ||
          !part.includes("data-block-type=")
        ) {
          // This is a text block
          const blockIdMatch = part.match(/data-block-id="([^"]+)"/);
          const orderMatch = part.match(/data-block-order="([^"]+)"/);

          const blockId = blockIdMatch
            ? blockIdMatch[1]
            : `text-${blocks.length}`;
          const order = orderMatch ? parseInt(orderMatch[1]) : blocks.length;

          // Remove outer div tags and convert HTML back to markdown/plain text
          let content = part.replace(/<div[^>]*>|<\/div>/g, "").trim();

          // Convert HTML back to markdown for editing (removes HTML tags, preserves markdown syntax)
          content = htmlToMarkdown(content);

          if (content) {
            blocks.push({
              id: blockId,
              type: "text",
              order: order,
              content: content,
            });
          }
        }
      });

      // Add any remaining media items that weren't found in placeholders
      media.forEach((mediaItem) => {
        const existingBlock = blocks.find(
          (b) =>
            b.type === "media" &&
            (b.id === mediaItem.id || b.preview === mediaItem.file_url),
        );

        if (!existingBlock) {
          blocks.push({
            id: `existing-media-${mediaItem.id}`,
            type: "media",
            order: blocks.length,
            caption: mediaItem.caption || "",
            preview: mediaItem.file_url,
          });
        }
      });
    } else {
      // No HTML content, just add media blocks if any
      media.forEach((mediaItem, index) => {
        blocks.push({
          id: `media-${mediaItem.id}`,
          type: "media",
          order: index,
          caption: mediaItem.caption || "",
          preview: mediaItem.file_url,
        });
      });
    }

    // Sort blocks by order
    blocks.sort((a, b) => a.order - b.order);

    // If no blocks, add an empty text block
    if (blocks.length === 0) {
      blocks.push({
        id: "1",
        type: "text",
        order: 0,
        content: "",
      });
    }

    return blocks;
  };

  // Load material and poin details
  useEffect(() => {
    const loadMaterial = async () => {
      setLoading(true);
      try {
        const res = await materialsAPI.get(materialId);

        if (res.ok) {
          // Backend already includes poin data with media references
          setMaterial(res.data);
          setPoins(res.data.poin_details || []);
        } else {
          console.error("Failed to load material:", res);
          let errorMsg = "Gagal memuat materi";

          if (res.status === 403) {
            errorMsg =
              "Akses ditolak. Materi mungkin masih dalam status draft atau Anda tidak memiliki izin admin. Coba gunakan endpoint admin.";
          } else if (res.status === 401) {
            errorMsg = "Sesi login sudah berakhir. Silakan login ulang.";
          } else if (res.status === 404) {
            errorMsg =
              "Materi tidak ditemukan. Periksa apakah ID materi benar.";
          }

          await Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMsg,
            footer: `Status: ${res.status} - ${res.error}`,
          });
        }
      } catch (error) {
        console.error("Error loading material:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan saat memuat materi",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [materialId]);

  const resetForm = () => {
    setTitle("");
    setDurationLabel("");
    setDurationMinutes("");
    setEditingPoin(null);
    setExistingMedia([]);
    setMediaToDelete([]);

    // Reset to single empty text block
    setContentBlocks([
      {
        id: "1",
        type: "text",
        order: 0,
        content: "",
      },
    ]);

    // Cleanup preview URLs to prevent memory leaks
    contentBlocks.forEach((block) => {
      if (block.preview && block.preview.startsWith("blob:")) {
        URL.revokeObjectURL(block.preview);
      }
    });
  };

  const loadPoinToForm = async (poin: PoinDetailRecord) => {
    setTitle(poin.title);
    setDurationLabel(poin.duration_label || "");
    const durationValue =
      poin.duration_minutes !== null && poin.duration_minutes !== undefined
        ? String(poin.duration_minutes)
        : "";
    setDurationMinutes(durationValue);
    setEditingPoin(poin);

    // Convert existing content to blocks
    const media = getPoinMedia(poin);
    const blocks = parseHTMLToBlocks(poin.content_html, media);
    setContentBlocks(blocks);

    // Load existing media from poin data
    const poinMedia = getPoinMedia(poin);
    setExistingMedia(poinMedia);
    setMediaToDelete([]);
  };

  // Existing media management functions
  const updateExistingMediaCaption = (mediaId: string, caption: string) => {
    setExistingMedia((prev) =>
      prev.map((media) =>
        media.id === mediaId
          ? { ...media, caption, captionChanged: true }
          : media,
      ),
    );
  };

  const markMediaForDeletion = (mediaId: string) => {
    setMediaToDelete((prev) => [...prev, mediaId]);
    setExistingMedia((prev) => prev.filter((media) => media.id !== mediaId));
  };

  const deleteMediaFromServer = async (mediaId: string) => {
    try {
      const { apiFetch } = await import("@/lib/api/client");
      const res = await apiFetch(
        `/api/v1/materials/points/media/${encodeURIComponent(mediaId)}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        return true;
      } else {
        console.error("Failed to delete media:", res);
        return false;
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      return false;
    }
  };

  const addNewMediaToPoin = async (poinId: string | number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Changed from 'media' to 'file' to match backend
      // Note: Backend doesn't support caption yet

      const { apiFetch } = await import("@/lib/api/client");
      const res = await apiFetch(
        `/api/v1/materials/points/${encodeURIComponent(String(poinId))}/media`,
        {
          method: "POST",
          body: formData,
          asJson: false,
        },
      );

      if (res.ok) {
        return res.data;
      } else {
        console.error("Failed to add new media:", res);

        // Better error handling with specific messages
        if (res.error && res.error.includes("Bucket not found")) {
          throw new Error(
            "Storage bucket belum dikonfigurasi. Silakan hubungi administrator untuk setup Supabase Storage.",
          );
        } else if (
          res.error &&
          res.error.includes("violates row-level security")
        ) {
          throw new Error(
            "Anda tidak memiliki izin untuk upload file. Pastikan Anda login sebagai admin.",
          );
        } else if (res.status === 413) {
          throw new Error("Ukuran file terlalu besar. Maksimal 50MB per file.");
        }

        throw new Error(res.error || "Gagal mengupload media");
      }
    } catch (error) {
      console.error("Error adding new media:", error);
      throw error; // Re-throw untuk ditangani di level atas
    }
  };

  const updateMediaCaption = async (mediaId: string, caption: string) => {
    try {
      const { apiFetch } = await import("@/lib/api/client");
      const res = await apiFetch(
        `/api/v1/materials/points/media/${encodeURIComponent(mediaId)}`,
        {
          method: "PUT",
          body: { caption },
        },
      );

      if (res.ok) {
        return true;
      } else {
        console.error("Failed to update media caption:", res);
        return false;
      }
    } catch (error) {
      console.error("Error updating media caption:", error);
      return false;
    }
  };

  const handleAddPoin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    const trimmedTitle = title.trim();

    // Convert blocks to HTML and get media files
    const contentHtml = convertBlocksToHTML();
    const mediaFiles = getBlockMediaFiles();
    const trimmedContentHtml = contentHtml.trim();

    if (!trimmedTitle) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Judul poin harus diisi",
      });
      return;
    }

    if (!trimmedContentHtml) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Konten poin harus diisi",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Prepare payload for creating poin
      const payload = {
        title: trimmedTitle,
        content_html: contentHtml,
        duration_label: durationLabel.trim() || undefined,
        order_index: poins.length + 1,
        duration_minutes: durationMinutes ? Number(durationMinutes) : undefined,
      };

      // Step 1: Create the poin first (without media)
      const res = await poinsAPI.create(String(materialId), payload);

      if (res.ok) {
        const createdPoin = res.data;

        // Step 2: If there are media files, upload them one by one
        if (mediaFiles.length > 0) {
          const mediaMapping: Record<string, string> = {};
          const uploadedMedia: MediaItem[] = [];

          for (const mediaFile of mediaFiles) {
            try {
              const result = await addNewMediaToPoin(
                createdPoin.id,
                mediaFile.file,
              );
              if (result) {
                // Backend returns array of media items
                const uploadedMediaItem = Array.isArray(result)
                  ? result[0]
                  : result;
                if (uploadedMediaItem) {
                  uploadedMedia.push(uploadedMediaItem);
                  mediaMapping[mediaFile.blockId] = uploadedMediaItem.id;
                }
              }
            } catch (error: unknown) {
              console.error("Failed to upload media:", error);

              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Gagal mengupload file media";
              const isStorageError =
                error instanceof Error && error.message?.includes("bucket");

              // Show specific error to user
              await Swal.fire({
                icon: "error",
                title: "Gagal Upload Media",
                text: errorMessage,
                footer: isStorageError
                  ? '<a href="https://github.com/yourusername/bukadita/blob/main/bukadita-api-v2/SETUP_STORAGE.md" target="_blank">Lihat panduan setup storage</a>'
                  : undefined,
              });

              // Stop creating poin if media upload fails
              setSubmitting(false);
              return;
            }
          }

          // Step 3: Update the poin's content_html with correct media IDs
          if (Object.keys(mediaMapping).length > 0) {
            const updatedHtml = updateHtmlWithMediaIds(
              createdPoin.content_html,
              mediaMapping,
            );

            // Update the poin with correct HTML
            try {
              const updateRes = await poinsAPI.update(createdPoin.id, {
                content_html: updatedHtml,
              });

              if (!updateRes.ok) {
                console.warn(
                  "Failed to update poin HTML with media IDs:",
                  updateRes,
                );
              }
            } catch (updateError) {
              console.warn("Error updating poin HTML:", updateError);
            }
          }
        }

        // Reload material to get updated poins
        const materialRes = await materialsAPI.get(materialId);
        if (materialRes.ok) {
          setMaterial(materialRes.data);
          setPoins(materialRes.data.poin_details || []);
        }
        resetForm();
        setShowAddPoin(false);

        const mediaCount = mediaFiles.length;
        const successMessage =
          mediaCount > 0
            ? `Poin berhasil ditambahkan dengan ${mediaCount} file media`
            : "Poin berhasil ditambahkan";

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: successMessage,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Enhanced error handling based on backend documentation
        let errorTitle = "Gagal Menambah Poin";
        let errorMessage = "Terjadi kesalahan saat menambah poin";

        if (res.status === 401) {
          errorTitle = "Akses Ditolak";
          errorMessage = "Sesi login telah berakhir. Silakan login kembali.";
        } else if (res.status === 413) {
          errorTitle = "File Terlalu Besar";
          errorMessage = "Ukuran file melebihi batas maksimal 50MB per file.";
        } else if (res.status === 400) {
          errorTitle = "Data Tidak Valid";
          errorMessage =
            res.error ||
            "Data yang dikirim tidak valid. Periksa kembali form Anda.";
        } else if (res.status === 500) {
          errorTitle = "Server Error";
          errorMessage =
            "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
        }

        await Swal.fire({
          icon: "error",
          title: errorTitle,
          text: errorMessage,
          footer:
            mediaFiles.length > 0
              ? "Tip: Coba kurangi jumlah atau ukuran file yang diunggah"
              : undefined,
        });
      }
    } catch (error) {
      console.error("Error adding poin:", error);

      // Enhanced catch error handling
      let errorMessage = "Terjadi kesalahan saat menambah poin";

      if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.";
        } else if (error.message.includes("timeout")) {
          errorMessage =
            "Upload memakan waktu terlalu lama. Coba kurangi ukuran file atau jumlah file.";
        }
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        footer:
          mediaFiles.length > 0
            ? `Mencoba upload ${mediaFiles.length} file`
            : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPoin = async (poin: PoinDetailRecord) => {
    await loadPoinToForm(poin);
    setShowEditPoin(true);
    setShowAddPoin(false); // Hide add form if open
  };

  const handleUpdatePoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPoin) return;

    // Convert blocks to HTML and get media files for update
    const contentHtml = convertBlocksToHTML();
    const mediaFiles = getBlockMediaFiles();

    if (!title.trim() || !contentHtml.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Judul dan konten harus diisi",
      });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update poin text fields
      const payload = {
        title: title.trim(),
        content_html: contentHtml.trim(),
        duration_label: durationLabel.trim() || undefined,
        duration_minutes: durationMinutes ? Number(durationMinutes) : undefined,
      };

      const res = await poinsAPI.update(editingPoin.id, payload);
      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal memperbarui poin",
        });
        return;
      }

      // 2. Delete marked media
      for (const mediaId of mediaToDelete) {
        await deleteMediaFromServer(mediaId);
      }

      // 3. Update existing media captions that were changed
      for (const media of existingMedia) {
        if (media.captionChanged) {
          await updateMediaCaption(media.id, media.caption || "");
        }
      }

      // 4. Add new media files from blocks
      const newMediaIds: string[] = [];
      for (const mediaFile of mediaFiles) {
        try {
          const newMediaResponse = await addNewMediaToPoin(
            editingPoin.id,
            mediaFile.file,
          );
          if (
            newMediaResponse &&
            typeof newMediaResponse === "object" &&
            "id" in newMediaResponse
          ) {
            newMediaIds.push((newMediaResponse as { id: string }).id);
          }
        } catch (error: unknown) {
          console.error("Failed to upload media during update:", error);

          const errorMessage =
            error instanceof Error
              ? error.message
              : "Gagal mengupload file media";
          const isStorageError =
            error instanceof Error && error.message?.includes("bucket");

          // Show specific error to user
          await Swal.fire({
            icon: "error",
            title: "Gagal Upload Media",
            text: errorMessage,
            footer: isStorageError
              ? '<a href="https://github.com/yourusername/bukadita/blob/main/bukadita-api-v2/SETUP_STORAGE.md" target="_blank">Lihat panduan setup storage</a>'
              : undefined,
          });

          // Stop update if media upload fails
          setSubmitting(false);
          return;
        }
      }

      // 5. Update HTML with new media IDs if any new media was added
      if (mediaFiles.length > 0 && newMediaIds.length > 0) {
        const mediaMapping: Record<string, string> = {};
        mediaFiles.forEach((mediaFile, index) => {
          if (newMediaIds[index]) {
            mediaMapping[mediaFile.blockId] = newMediaIds[index];
          }
        });

        if (Object.keys(mediaMapping).length > 0) {
          // Use current content_html from the response
          const updatedHtml = updateHtmlWithMediaIds(
            res.data.content_html,
            mediaMapping,
          );

          await poinsAPI.update(editingPoin.id, {
            content_html: updatedHtml,
          });
        }
      }

      // Reload material to get updated poins
      const materialRes = await materialsAPI.get(materialId);
      if (materialRes.ok) {
        setMaterial(materialRes.data);
        setPoins(materialRes.data.poin_details || []);
      }

      resetForm();
      setShowEditPoin(false);

      const mediaChanges =
        mediaToDelete.length +
        mediaFiles.length +
        existingMedia.filter((m) => m.captionChanged).length;
      const successMessage =
        mediaChanges > 0
          ? "Poin berhasil diperbarui dengan perubahan media"
          : "Poin berhasil diperbarui";

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: successMessage,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating poin:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memperbarui poin",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowEditPoin(false);
  };

  const handleDeletePoin = async (poin: PoinDetailRecord) => {
    const result = await Swal.fire({
      title: "Hapus Poin?",
      text: `Poin "${poin.title}" akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await poinsAPI.remove(poin.id);
        if (res.ok) {
          // Reload material
          const materialRes = await materialsAPI.get(materialId);
          if (materialRes.ok) {
            setMaterial(materialRes.data);
            setPoins(materialRes.data.poin_details || []);
          }
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Poin berhasil dihapus",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Gagal menghapus poin",
          });
        }
      } catch (error) {
        console.error("Error deleting poin:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan saat menghapus poin",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Poin Items Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 border border-gray-200">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border-3 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-3 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Memuat materi...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-red-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Materi Tidak Ditemukan
            </h3>
            <p className="text-gray-600">
              Materi yang Anda cari tidak tersedia atau telah dihapus
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <MaterialHeader material={material} poinsCount={poins.length} />

        {/* Tabs Navigation */}
        <TabsNavigation
          activeTab={activeTab}
          poinsCount={poins.length}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "manage" && (
          <>
            {/* Add Poin Button */}
            {!showEditPoin && (
              <AddPoinButton
                showForm={showAddPoin}
                onToggle={() => {
                  setShowAddPoin(!showAddPoin);
                  if (showAddPoin) {
                    resetForm();
                  }
                }}
              />
            )}

            {/* Add/Edit Poin Form with Live Preview */}
            {(showAddPoin || showEditPoin) && (
              <div className="mb-6">
                {/* Form Section - Full Width for Better Writing Experience */}
                <form
                  onSubmit={editingPoin ? handleUpdatePoin : handleAddPoin}
                  className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50 overflow-hidden"
                >
                  {/* Decorative background */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#27548A] via-[#578FCA] to-[#27548A]"></div>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/5 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#27548A] to-[#578FCA] flex items-center justify-center shadow-lg">
                          {editingPoin ? (
                            <svg
                              className="w-7 h-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-7 h-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#27548A] to-[#578FCA] bg-clip-text text-transparent">
                            {editingPoin ? "Edit Poin" : "Tambah Poin Baru"}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Buat konten pembelajaran yang menarik
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-gradient-to-r from-[#27548A]/10 to-[#578FCA]/10 border border-[#27548A]/20 rounded-xl flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#27548A]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-[#27548A]">
                          Mode Editor
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6 text-black">
                      <div>
                        <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-[#27548A]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </div>
                          Judul Poin
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA]/50 focus:border-[#27548A] transition-all duration-300 bg-white hover:border-gray-300 placeholder-gray-400"
                          placeholder="Masukkan judul poin yang menarik..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-[#27548A]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            Label Durasi
                          </label>
                          <input
                            type="text"
                            value={durationLabel}
                            onChange={(e) => setDurationLabel(e.target.value)}
                            className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA]/50 focus:border-[#27548A] transition-all duration-300 bg-white hover:border-gray-300 placeholder-gray-400"
                            placeholder="contoh: Bacaan 5 menit"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-[#27548A]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            Durasi (menit)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value)}
                            className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA]/50 focus:border-[#27548A] transition-all duration-300 bg-white hover:border-gray-300 placeholder-gray-400"
                            placeholder="Estimasi waktu dalam menit"
                          />
                        </div>
                      </div>

                      {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Media <span className="text-xs text-gray-500">(Max 10 files, 50MB per file)</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg,video/avi,video/mov,audio/*,.pdf"
                      onChange={handleFileSelection}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Supported: Images (JPEG, PNG, GIF, WebP), Videos (MP4, WebM, OGG, AVI, MOV), Audio (all formats), PDF
                    </div>
                  </div> */}
                    </div>

                    {/* Existing Media (for Edit mode) */}
                    {editingPoin && existingMedia.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600"
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
                          Media yang Sudah Ada
                        </label>

                        {/* Debug Information */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <details className="text-xs text-blue-800">
                            <summary className="cursor-pointer font-medium flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                              Debug Info (klik untuk expand)
                            </summary>
                            <div className="mt-2 space-y-2">
                              <p>
                                <strong>Media Count:</strong>{" "}
                                {existingMedia.length}
                              </p>
                              {existingMedia.map((media, idx) => (
                                <div
                                  key={media.id}
                                  className="p-2 bg-white rounded border"
                                >
                                  <p>
                                    <strong>Media #{idx + 1}:</strong>
                                  </p>
                                  <p>
                                    <strong>ID:</strong> {media.id}
                                  </p>
                                  <p>
                                    <strong>Filename:</strong>{" "}
                                    {media.original_filename}
                                  </p>
                                  <p>
                                    <strong>MIME:</strong> {media.mime_type}
                                  </p>
                                  <p>
                                    <strong>Size:</strong>{" "}
                                    {media.file_size
                                      ? `${(
                                          media.file_size /
                                          1024 /
                                          1024
                                        ).toFixed(2)} MB`
                                      : "Unknown"}
                                  </p>
                                  <p>
                                    <strong>URL:</strong>
                                    <a
                                      href={media.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline break-all"
                                    >
                                      {media.file_url}
                                    </a>
                                    {media.file_url && (
                                      <span className="ml-2">
                                        <button
                                          onClick={() => {
                                            const testImg =
                                              document.createElement("img");
                                            testImg.onload = () => {
                                              /* URL test success */
                                            };
                                            testImg.onerror = () => {
                                              /* URL test failed */
                                            };
                                            testImg.src = media.file_url;
                                          }}
                                          className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                                        >
                                          Test URL
                                        </button>
                                      </span>
                                    )}
                                  </p>
                                  <p>
                                    <strong>Caption:</strong>{" "}
                                    {media.caption || "No caption"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                        <div className="space-y-4">
                          {existingMedia.map((media) => (
                            <div
                              key={media.id}
                              className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                            >
                              <div className="flex items-start gap-4">
                                {/* Preview Media */}
                                <div className="flex-shrink-0">
                                  {media.mime_type?.startsWith("image/") &&
                                  !imageErrors.has(media.id) ? (
                                    <Image
                                      src={media.file_url}
                                      alt={
                                        media.caption || media.original_filename
                                      }
                                      width={80}
                                      height={80}
                                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                      unoptimized
                                      onError={(e) => {
                                        console.error("Image load error:", {
                                          media_id: media.id,
                                          file_url: media.file_url,
                                          mime_type: media.mime_type,
                                          original_filename:
                                            media.original_filename,
                                          error: e,
                                        });
                                        setImageErrors((prev) =>
                                          new Set(prev).add(media.id),
                                        );
                                      }}
                                      onLoad={() => {
                                        setImageErrors((prev) => {
                                          const newSet = new Set(prev);
                                          newSet.delete(media.id);
                                          return newSet;
                                        });
                                      }}
                                    />
                                  ) : media.mime_type?.startsWith("image/") &&
                                    imageErrors.has(media.id) ? (
                                    <div className="w-20 h-20 bg-red-100 border border-red-200 rounded-lg flex flex-col items-center justify-center p-1">
                                      <ImageIcon className="w-4 h-4 text-red-600 mb-1" />
                                      <a
                                        href={media.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-red-600 hover:text-red-800 text-center leading-tight"
                                      >
                                        URL Error
                                      </a>
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                                      {media.mime_type?.startsWith("video/") ? (
                                        <Video className="w-6 h-6 text-[#578FCA]" />
                                      ) : media.mime_type?.startsWith(
                                          "audio/",
                                        ) ? (
                                        <FileText className="w-6 h-6 text-[#27548A]" />
                                      ) : media.mime_type ===
                                        "application/pdf" ? (
                                        <FileText className="w-6 h-6 text-red-600" />
                                      ) : (
                                        <FileText className="w-6 h-6 text-gray-600" />
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Media Info & Caption */}
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {media.original_filename}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {media.mime_type?.startsWith("image/")
                                        ? "Gambar"
                                        : media.mime_type?.startsWith("video/")
                                          ? "Video"
                                          : media.mime_type?.startsWith(
                                                "audio/",
                                              )
                                            ? "Audio"
                                            : media.mime_type ===
                                                "application/pdf"
                                              ? "PDF"
                                              : "File"}{" "}
                                      •
                                      {media.file_size
                                        ? ` ${(
                                            media.file_size /
                                            1024 /
                                            1024
                                          ).toFixed(2)} MB`
                                        : " Unknown size"}
                                    </p>
                                  </div>

                                  {/* Caption Input */}
                                  <div>
                                    <input
                                      type="text"
                                      value={media.caption || ""}
                                      onChange={(e) =>
                                        updateExistingMediaCaption(
                                          media.id,
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Edit caption untuk media ini..."
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => markMediaForDeletion(media.id)}
                                  className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus media"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Existing Media Tips */}
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-xs text-amber-700">
                            <strong>Media yang Ada:</strong> Edit caption atau
                            hapus media yang tidak diperlukan. Perubahan akan
                            disimpan saat Anda menekan &quot;Perbarui
                            Poin&quot;.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Block Editor */}
                    <div>
                      <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-[#27548A]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        Konten Poin
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="text-sm text-gray-600 mb-4 bg-gradient-to-r from-[#27548A]/5 to-[#578FCA]/5 border-l-4 border-[#27548A] p-4 rounded-lg flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#27548A] flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <strong className="text-[#27548A]">
                            Tips Menulis:
                          </strong>{" "}
                          Gunakan editor blok untuk menulis materi yang menarik.
                          Anda bisa menambahkan teks dan media secara fleksibel.
                          Urutkan blok sesuai kebutuhan dengan tombol
                          naik/turun.
                        </div>
                      </div>

                      {/* Add Block Buttons */}
                      <div className="flex gap-3 mb-6">
                        <button
                          type="button"
                          onClick={addTextBlock}
                          className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#27548A] to-[#578FCA] hover:from-[#1e3f6b] hover:to-[#4579b0] text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-[#27548A]/30 hover:shadow-xl hover:-translate-y-0.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                              />
                            </svg>
                          </div>
                          Tambah Teks
                        </button>
                        <button
                          type="button"
                          onClick={addMediaBlock}
                          className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:from-[#4579b0] hover:to-[#1e3f6b] text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-[#578FCA]/30 hover:shadow-xl hover:-translate-y-0.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          Tambah Media
                        </button>
                      </div>

                      {/* Content Blocks */}
                      <div
                        className="space-y-4"
                        ref={contentBlocksContainerRef}
                      >
                        {contentBlocks.map((block, index) => (
                          <div
                            key={block.id}
                            ref={
                              index === contentBlocks.length - 1
                                ? latestBlockRef
                                : null
                            }
                            className="group relative bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 rounded-xl hover:border-[#578FCA]/50 hover:shadow-lg transition-all duration-300"
                          >
                            {block.type === "text" ? (
                              <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
                                      <FileText className="w-4 h-4 text-[#27548A]" />
                                    </div>
                                    <span>Blok Teks #{index + 1}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeBlock(block.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium border border-red-200 hover:border-red-300"
                                    title="Hapus blok"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                                <RichTextEditor
                                  value={block.content || ""}
                                  onChange={(content) =>
                                    updateTextBlock(block.id, content)
                                  }
                                />
                              </div>
                            ) : (
                              <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#578FCA]/10 to-[#27548A]/10 flex items-center justify-center">
                                      <ImageIcon className="w-4 h-4 text-[#578FCA]" />
                                    </div>
                                    <span>Blok Media #{index + 1}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeBlock(block.id)}
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
                                  onFileChange={(file: File) =>
                                    updateMediaBlock(block.id, file)
                                  }
                                  onCaptionChange={(caption: string) => {
                                    setContentBlocks((blocks) =>
                                      blocks.map((b) =>
                                        b.id === block.id
                                          ? { ...b, caption }
                                          : b,
                                      ),
                                    );
                                  }}
                                  onAlignmentChange={(
                                    alignment: "left" | "center" | "right",
                                  ) => {
                                    setContentBlocks((blocks) =>
                                      blocks.map((b) =>
                                        b.id === block.id
                                          ? { ...b, alignment }
                                          : b,
                                      ),
                                    );
                                  }}
                                  onSizeChange={(
                                    size: "small" | "medium" | "large" | "full",
                                  ) => {
                                    setContentBlocks((blocks) =>
                                      blocks.map((b) =>
                                        b.id === block.id ? { ...b, size } : b,
                                      ),
                                    );
                                  }}
                                />
                              </div>
                            )}

                            {/* Block Controls */}
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl shadow-xl p-1.5">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveBlock(block.id, "up")}
                                    className="p-2.5 hover:bg-[#578FCA]/10 text-gray-600 hover:text-[#27548A] rounded-lg transition-colors"
                                    title="Pindah ke atas"
                                  >
                                    <MoveUp className="w-5 h-5" />
                                  </button>
                                )}
                                {index < contentBlocks.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveBlock(block.id, "down")}
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

                        {contentBlocks.length === 0 && (
                          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-dashed border-gray-300 rounded-xl">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-semibold mb-2">
                              Belum ada konten
                            </p>
                            <p className="text-sm text-gray-500">
                              Klik &ldquo;Tambah Teks&rdquo; atau &ldquo;Tambah
                              Media&rdquo; untuk mulai membuat konten
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-900">
                              Editor Blok Fleksibel
                            </p>
                            <p className="text-xs text-emerald-700">
                              Kombinasikan teks dan media. Urutan blok akan
                              dipertahankan saat ditampilkan.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-10 pt-8 border-t-2 border-gray-200">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#27548A] to-[#578FCA] hover:from-[#1e3f6b] hover:to-[#4579b0] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#27548A]/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {getBlockMediaFiles().length > 0
                            ? `Mengupload ${getBlockMediaFiles().length} file...`
                            : "Menyimpan..."}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {editingPoin ? "Perbarui Poin" : "Simpan Poin"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={
                        editingPoin
                          ? handleCancelEdit
                          : () => {
                              resetForm();
                              setShowAddPoin(false);
                            }
                      }
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Batal
                    </button>

                    <div className="ml-auto px-5 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-bold text-emerald-800">
                        Buat materi berkualitas
                      </span>
                    </div>
                  </div>
                </form>

                {/* Live Preview Section - Below Form */}
                <div className="mt-6">
                  <LiveContentPreview
                    blocks={contentBlocks}
                    title={title || "Preview Konten"}
                  />
                </div>
              </div>
            )}

            {/* Poins List */}
            <PoinList
              poins={poins}
              onEditPoin={handleEditPoin}
              onDeletePoin={handleDeletePoin}
            />
          </>
        )}

        {/* Preview Tab Content */}
        {activeTab === "preview" && material && (
          <MaterialPreview poins={poins} materialTitle={material.title} />
        )}
      </div>
    </div>
  );
}
