"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  Video,
  ImageIcon,
  MoveUp,
  MoveDown,
  X,
} from "lucide-react";
import {
  poinsAPI,
  materialsAPI,
  type Poin,
  type Material,
  type MediaItem,
} from "@/lib/api";
import { renderContent, htmlToMarkdown } from "@/lib/markdown-utils";

import MaterialPreview from "./MaterialPreview";
import RichTextEditor from "./RichTextEditor";
import MediaBlockEditor from "./MediaBlockEditor";
import LiveContentPreview from "./LiveContentPreview";

// Alias for backward compatibility
type PoinDetailRecord = Poin;
type MaterialRecordWithPoins = Material;

interface MaterialPoinManagerProps {
  materialId: string;
}

export default function MaterialPoinManager({
  materialId,
}: MaterialPoinManagerProps) {
  const router = useRouter();
  const [material, setMaterial] = useState<MaterialRecordWithPoins | null>(
    null
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

  // Backend doesn't have endpoint to get single poin, so we use data from material response
  // This function is kept for compatibility but now just returns data from state
  const findPoinById = (poinId: string | number): PoinDetailRecord | null => {
    return poins.find((p) => String(p.id) === String(poinId)) || null;
  };

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
  };

  const addMediaBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "media",
      order: contentBlocks.length,
      caption: "",
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateTextBlock = (blockId: string, content: string) => {
    setContentBlocks((blocks) =>
      blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  const updateMediaBlock = (
    blockId: string,
    file: File,
    caption: string = ""
  ) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setContentBlocks((blocks) =>
      blocks.map((block) =>
        block.id === blockId
          ? { ...block, file, caption, preview: previewUrl }
          : block
      )
    );
  };

  const removeBlock = (blockId: string) => {
    setContentBlocks((blocks) => {
      const filtered = blocks.filter((block) => block.id !== blockId);
      // Reorder remaining blocks
      return filtered.map((block, index) => ({ ...block, order: index }));
    });
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
    mediaMapping: Record<string, string>
  ) => {
    let updatedHtml = html;

    Object.entries(mediaMapping).forEach(([blockId, mediaId]) => {
      // Update both placeholder text and div attributes
      updatedHtml = updatedHtml.replace(
        new RegExp(`\\[MEDIA_PLACEHOLDER_${blockId}\\]`, "g"),
        `[MEDIA_PLACEHOLDER_${mediaId}]`
      );
      updatedHtml = updatedHtml.replace(
        new RegExp(`data-block-id="${blockId}"`, "g"),
        `data-block-id="${mediaId}"`
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
                m.id === blockId || part.includes(`MEDIA_PLACEHOLDER_${m.id}`)
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
            (b.id === mediaItem.id || b.preview === mediaItem.file_url)
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
          : media
      )
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
        }
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

  const addNewMediaToPoin = async (
    poinId: string | number,
    file: File,
    caption: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Changed from 'media' to 'file' to match backend
      // Note: Backend doesn't support caption yet, commented out to avoid "Unexpected field" error
      // if (caption.trim()) {
      //   formData.append("caption", caption.trim());
      // }

      const { apiFetch } = await import("@/lib/api/client");
      const res = await apiFetch(
        `/api/v1/materials/points/${encodeURIComponent(String(poinId))}/media`,
        {
          method: "POST",
          body: formData,
          asJson: false,
        }
      );

      if (res.ok) {
        return res.data;
      } else {
        console.error("Failed to add new media:", res);

        // Better error handling with specific messages
        if (res.error && res.error.includes("Bucket not found")) {
          throw new Error(
            "Storage bucket belum dikonfigurasi. Silakan hubungi administrator untuk setup Supabase Storage."
          );
        } else if (
          res.error &&
          res.error.includes("violates row-level security")
        ) {
          throw new Error(
            "Anda tidak memiliki izin untuk upload file. Pastikan Anda login sebagai admin."
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
        }
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
        let finalPoin = createdPoin;

        // Step 2: If there are media files, upload them one by one
        if (mediaFiles.length > 0) {
          const mediaMapping: Record<string, string> = {};
          const uploadedMedia: MediaItem[] = [];

          for (const mediaFile of mediaFiles) {
            try {
              const result = await addNewMediaToPoin(
                createdPoin.id,
                mediaFile.file,
                mediaFile.caption || ""
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
            } catch (error: any) {
              console.error("Failed to upload media:", error);

              // Show specific error to user
              await Swal.fire({
                icon: "error",
                title: "Gagal Upload Media",
                text: error.message || "Gagal mengupload file media",
                footer: error.message?.includes("bucket")
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
              mediaMapping
            );

            // Update the poin with correct HTML
            try {
              const updateRes = await poinsAPI.update(createdPoin.id, {
                content_html: updatedHtml,
              });

              if (!updateRes.ok) {
                console.warn(
                  "Failed to update poin HTML with media IDs:",
                  updateRes
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
            mediaFile.caption
          );
          if (
            newMediaResponse &&
            typeof newMediaResponse === "object" &&
            "id" in newMediaResponse
          ) {
            newMediaIds.push((newMediaResponse as { id: string }).id);
          }
        } catch (error: any) {
          console.error("Failed to upload media during update:", error);

          // Show specific error to user
          await Swal.fire({
            icon: "error",
            title: "Gagal Upload Media",
            text: error.message || "Gagal mengupload file media",
            footer: error.message?.includes("bucket")
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
            mediaMapping
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat materi...</div>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Materi tidak ditemukan</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {material.title}
          </h1>
          {material.content && (
            <div className="text-gray-600 mb-4 max-h-24 overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: material.content.slice(0, 200) + "...",
                }}
              />
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>{poins.length} Poin Materi</span>
            {material.published ? (
              <span className="text-green-600">Terbit</span>
            ) : (
              <span className="text-amber-600">Draf</span>
            )}
          </div>

          {/* Draft warning/info */}
          {!material.published && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <p className="text-sm text-amber-800">
                  <strong>Mode Draft:</strong> Materi ini belum dipublikasi,
                  namun Anda tetap bisa menambahkan dan mengelola poin-poin
                  pembelajaran. Poin akan tersimpan dan siap digunakan saat
                  materi dipublikasikan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "manage"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Kelola Poin
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Preview Materi
              {poins.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                  {poins.length} poin
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "manage" && (
        <>
          {/* Add Poin Button */}
          {!showEditPoin && (
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowAddPoin(!showAddPoin);
                  if (showAddPoin) {
                    resetForm(); // Reset form when closing
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                {showAddPoin ? "Tutup Form" : "Tambah Poin"}
              </button>
            </div>
          )}

          {/* Add/Edit Poin Form with Live Preview */}
          {(showAddPoin || showEditPoin) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Form Section */}
              <form
                onSubmit={editingPoin ? handleUpdatePoin : handleAddPoin}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingPoin ? "Edit Poin" : "Tambah Poin Baru"}
                </h2>

                <div className="space-y-4 text-black">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Poin *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan judul poin..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label Durasi
                    </label>
                    <input
                      type="text"
                      value={durationLabel}
                      onChange={(e) => setDurationLabel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contoh: Bacaan 5 menit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi (menit)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Estimasi menit"
                    />
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Media yang Sudah Ada
                    </label>

                    {/* Debug Information */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <details className="text-xs text-blue-800">
                        <summary className="cursor-pointer font-medium">
                          🔍 Debug Info (klik untuk expand)
                        </summary>
                        <div className="mt-2 space-y-2">
                          <p>
                            <strong>Media Count:</strong> {existingMedia.length}
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
                                  ? `${(media.file_size / 1024 / 1024).toFixed(
                                      2
                                    )} MB`
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
                                  alt={media.caption || media.original_filename}
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
                                      new Set(prev).add(media.id)
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
                                    <Video className="w-6 h-6 text-purple-600" />
                                  ) : media.mime_type?.startsWith("audio/") ? (
                                    <FileText className="w-6 h-6 text-blue-600" />
                                  ) : media.mime_type === "application/pdf" ? (
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
                                    : media.mime_type?.startsWith("audio/")
                                    ? "Audio"
                                    : media.mime_type === "application/pdf"
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
                                      e.target.value
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
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-700">
                        📝 <strong>Media yang Ada:</strong> Edit caption atau
                        hapus media yang tidak diperlukan. Perubahan akan
                        disimpan saat Anda menekan &quot;Perbarui Poin&quot;.
                      </p>
                    </div>
                  </div>
                )}

                {/* Block Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konten Poin *
                  </label>

                  {/* Add Block Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={addTextBlock}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors"
                    >
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
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                      Add Text
                    </button>
                    <button
                      type="button"
                      onClick={addMediaBlock}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-md text-sm font-medium transition-colors"
                    >
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Add Media
                    </button>
                  </div>

                  {/* Content Blocks */}
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
                    {contentBlocks.map((block, index) => (
                      <div key={block.id} className="group relative bg-white rounded-lg">
                        {block.type === "text" ? (
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2 px-4 pt-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Teks
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeBlock(block.id)}
                                className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                                title="Hapus blok"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="px-4 pb-4">
                              <RichTextEditor
                                value={block.content || ""}
                                onChange={(value) => updateTextBlock(block.id, value)}
                                placeholder="Tulis konten di sini..."
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <MediaBlockEditor
                              file={block.file}
                              preview={block.preview}
                              caption={block.caption}
                              alignment={block.alignment || "center"}
                              size={block.size || "medium"}
                              onFileChange={(file) => updateMediaBlock(block.id, file)}
                              onCaptionChange={(caption) => {
                                setContentBlocks((blocks) =>
                                  blocks.map((b) =>
                                    b.id === block.id ? { ...b, caption } : b
                                  )
                                );
                              }}
                              onAlignmentChange={(alignment) => {
                                setContentBlocks((blocks) =>
                                  blocks.map((b) =>
                                    b.id === block.id ? { ...b, alignment } : b
                                  )
                                );
                              }}
                              onSizeChange={(size) => {
                                setContentBlocks((blocks) =>
                                  blocks.map((b) =>
                                    b.id === block.id ? { ...b, size } : b
                                  )
                                );
                              }}
                              onRemove={() => removeBlock(block.id)}
                            />
                          </div>
                        )}

                        {/* Block Controls */}
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="flex flex-col gap-1 bg-white border border-gray-300 rounded-lg shadow-lg p-1">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => moveBlock(block.id, "up")}
                                className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded transition-colors"
                                title="Pindah ke atas"
                              >
                                <MoveUp className="w-4 h-4" />
                              </button>
                            )}
                            {index < contentBlocks.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveBlock(block.id, "down")}
                                className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded transition-colors"
                                title="Pindah ke bawah"
                              >
                                <MoveDown className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {contentBlocks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No content blocks yet.</p>
                        <p className="text-sm">
                          Click &ldquo;Add Text&rdquo; or &ldquo;Add
                          Media&rdquo; to start creating content.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Use the block editor to create content with mixed text and
                    media. Order will be preserved in the final display.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? getBlockMediaFiles().length > 0
                      ? `Mengupload ${getBlockMediaFiles().length} file...`
                      : "Menyimpan..."
                    : editingPoin
                    ? "Perbarui Poin"
                    : "Simpan Poin"}
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition-colors"
                >
                  Batal
                </button>
              </div>
              </form>

              {/* Live Preview Section */}
              <div className="lg:block">
                <LiveContentPreview
                  blocks={contentBlocks}
                  title={title || "Preview Konten"}
                />
              </div>
            </div>
          )}

          {/* Poins List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Poin ({poins.length})
              </h2>
            </div>

            {poins.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>
                  Belum ada poin. Klik &quot;Tambah Poin&quot; untuk mulai
                  membuat konten materi.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {poins
                  .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                  .map((poin, index) => (
                    <div
                      key={poin.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {index + 1}. {poin.title}
                            </h3>
                            {poin.duration_label && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                                {poin.duration_label}
                              </span>
                            )}
                            {poin.duration_minutes && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {poin.duration_minutes} menit
                              </span>
                            )}
                            {getPoinMedia(poin).length > 0 && (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                                {getPoinMedia(poin).length} Media
                              </span>
                            )}
                          </div>

                          {/* Media Preview Thumbnails */}
                          {getPoinMedia(poin).length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {getPoinMedia(poin)
                                .slice(0, 4)
                                .map((media) => (
                                  <div key={media.id} className="flex-shrink-0">
                                    {media.mime_type?.startsWith("image/") &&
                                    !imageErrors.has(media.id) ? (
                                      <Image
                                        src={media.file_url}
                                        alt={
                                          media.caption ||
                                          media.original_filename
                                        }
                                        width={60}
                                        height={60}
                                        className="w-15 h-15 object-cover rounded-lg border border-gray-200"
                                        unoptimized
                                        onError={() => {
                                          setImageErrors((prev) =>
                                            new Set(prev).add(media.id)
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
                                    ) : (
                                      <div className="w-15 h-15 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                                        {media.mime_type?.startsWith(
                                          "video/"
                                        ) ? (
                                          <Video className="w-6 h-6 text-purple-600" />
                                        ) : media.mime_type?.startsWith(
                                            "audio/"
                                          ) ? (
                                          <FileText className="w-6 h-6 text-blue-600" />
                                        ) : media.mime_type ===
                                          "application/pdf" ? (
                                          <FileText className="w-6 h-6 text-red-600" />
                                        ) : (
                                          <FileText className="w-6 h-6 text-gray-600" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              {getPoinMedia(poin).length > 4 && (
                                <div className="w-15 h-15 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-600 font-medium">
                                    +{getPoinMedia(poin).length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="prose prose-sm max-w-none text-gray-600">
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  poin.content_html.slice(0, 200) +
                                  (poin.content_html.length > 200 ? "..." : ""),
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEditPoin(poin)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePoin(poin)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Preview Tab Content */}
      {activeTab === "preview" && material && (
        <MaterialPreview poins={poins} materialTitle={material.title} />
      )}
    </div>
  );
}
