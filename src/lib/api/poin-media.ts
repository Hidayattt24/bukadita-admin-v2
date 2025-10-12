import { apiFetch } from "./client";

// Types for Poin Media Management
export interface PoinMediaRecord {
  id: string;
  poin_id: string;
  type: "image" | "video" | "audio" | "pdf" | "other";
  url: string;
  caption?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export const poinMediaService = {
  // List media for a poin
  list: async (poinId: string) => {
    return apiFetch<PoinMediaRecord[]>(
      `/api/v1/admin/poins/${encodeURIComponent(poinId)}/media`,
      { method: "GET" }
    );
  },

  // Upload media files for a poin
  upload: async (poinId: string, files: File[], captions?: string[]) => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", file);
      if (captions && captions[index]) {
        formData.append(`caption_${index}`, captions[index]);
      }
    });

    return apiFetch<PoinMediaRecord[]>(
      `/api/v1/admin/poins/${encodeURIComponent(poinId)}/media`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  // Delete media
  remove: async (mediaId: string) => {
    return apiFetch<{ success: boolean }>(
      `/api/v1/admin/poins/media/${encodeURIComponent(mediaId)}`,
      { method: "DELETE" }
    );
  },
};
