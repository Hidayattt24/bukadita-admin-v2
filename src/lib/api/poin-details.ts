import { apiFetch } from "./client";

// Types for Media Items
export interface MediaItem {
  id: string;
  poin_detail_id: string;
  file_url: string;
  mime_type: string;
  original_filename: string;
  file_size: number;
  caption?: string;
  storage_path: string;
  created_at?: string;
  updated_at?: string;
}

// Types for Poin Details Management
export interface PoinDetailRecord {
  id: string | number;
  sub_materi_id: string | number;
  title: string;
  content_html: string;
  duration_label?: string;
  order_index: number;
  duration_minutes?: number;
  created_at?: string;
  updated_at?: string;
  poin_media?: MediaItem[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Enhanced Material Record with Poin Details
export interface MaterialRecordWithPoins {
  id: string | number;
  title: string;
  content: string;
  slug?: string;
  published?: boolean;
  module_id?: string | number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  poin_details?: PoinDetailRecord[];
}

// Poin Details CRUD Operations
export const poinDetailService = {
  // List poin details for a sub_materi
  list: async (
    subMateriId: string | number,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    // Add include_drafts parameter
    query.set("include_drafts", "true");

    // Try admin endpoint first with include_drafts
    const adminResult = await apiFetch<PaginatedResponse<PoinDetailRecord>>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(
        String(subMateriId)
      )}/poins?${query.toString()}`,
      { method: "GET" }
    );

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular materials endpoint
    return apiFetch<PaginatedResponse<PoinDetailRecord>>(
      `/api/v1/sub-materis/${encodeURIComponent(
        String(subMateriId)
      )}/poins?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get single poin detail
  get: async (id: string | number) => {
    // Try admin endpoint first
    const adminResult = await apiFetch<PoinDetailRecord>(
      `/api/v1/admin/poins/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular endpoint
    return apiFetch<PoinDetailRecord>(
      `/api/v1/poins/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );
  },

  // Create new poin detail
  create: async (payload: {
    sub_materi_id: string | number;
    title: string;
    content_html: string;
    duration_label?: string;
    order_index: number;
    duration_minutes?: number;
  }) => {
    console.log("Creating poin with payload:", payload);

    // Try admin endpoint first
    const adminResult = await apiFetch<PoinDetailRecord>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(
        String(payload.sub_materi_id)
      )}/poins`,
      {
        method: "POST",
        body: payload,
      }
    );

    console.log("Admin result:", adminResult);
    if (!adminResult.ok) {
      console.error("Admin endpoint error:", adminResult.error);
      console.error("Raw response:", JSON.stringify(adminResult.raw, null, 2));
    }

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular endpoint
    return apiFetch<PoinDetailRecord>(`/api/v1/poins`, {
      method: "POST",
      body: payload,
    });
  },

  // Update poin detail
  update: async (
    id: string | number,
    payload: {
      title?: string;
      content_html?: string;
      duration_label?: string;
      order_index?: number;
      duration_minutes?: number;
    }
  ) => {
    // Filter only valid fields to prevent backend errors with non-existent columns
    const validPayload: Record<string, unknown> = {};
    if (payload.title !== undefined) validPayload.title = payload.title;
    if (payload.content_html !== undefined)
      validPayload.content_html = payload.content_html;
    if (payload.duration_label !== undefined)
      validPayload.duration_label = payload.duration_label;
    if (payload.order_index !== undefined)
      validPayload.order_index = payload.order_index;
    if (payload.duration_minutes !== undefined)
      validPayload.duration_minutes = payload.duration_minutes;

    console.log("Updating poin with ID:", id);
    console.log("Update payload:", validPayload);

    // Try admin endpoint first
    const adminResult = await apiFetch<PoinDetailRecord>(
      `/api/v1/admin/poins/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: validPayload,
      }
    );

    console.log("Update result:", adminResult);
    if (!adminResult.ok) {
      console.error("Update error:", adminResult.error);
      console.error("Raw response:", JSON.stringify(adminResult.raw, null, 2));
    }

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular endpoint
    return apiFetch<PoinDetailRecord>(
      `/api/v1/poins/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: validPayload,
      }
    );
  },

  // Delete poin detail
  remove: async (id: string | number) => {
    // Try admin endpoint first
    const adminResult = await apiFetch<{ ok: boolean }>(
      `/api/v1/admin/poins/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular endpoint
    return apiFetch<{ ok: boolean }>(
      `/api/v1/poins/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  // Mark poin as complete (for testing progress flow)
  markComplete: async (poinId: string | number, materiId?: string | number) => {
    // Try both admin and regular endpoints
    const endpoints = [
      `/api/v1/admin/sub-materis/${materiId}/points/${poinId}/complete`,
      `/api/v1/materials/${materiId}/points/${poinId}/complete`,
      `/api/v1/admin/points/${poinId}/complete`,
      `/api/v1/points/${poinId}/complete`,
    ];

    for (const endpoint of endpoints) {
      try {
        const result = await apiFetch<{
          ok: boolean;
          progress?: Record<string, unknown>;
        }>(endpoint, {
          method: "POST",
        });
        if (result.ok) return result;
      } catch {
        // Continue to next endpoint if this one fails
        continue;
      }
    }

    // If all fail, return error
    return {
      ok: false,
      status: 404,
      error: "Complete endpoint not found",
    } as const;
  },
};

// Enhanced Materials Service with Poin Details
export const enhancedMaterialService = {
  // Get material with poin details - try admin endpoint first, then fallback
  getWithPoins: async (id: string | number) => {
    // Try admin endpoint first with include_drafts and include_media parameters
    const adminResultWithDrafts = await apiFetch<MaterialRecordWithPoins>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(
        String(id)
      )}?include_drafts=true&include_media=true&with_media=true`,
      { method: "GET" }
    );

    if (adminResultWithDrafts.ok) {
      return adminResultWithDrafts;
    }

    // Try admin endpoint with media inclusion
    const adminResult = await apiFetch<MaterialRecordWithPoins>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(
        String(id)
      )}?include_media=true&with_media=true`,
      { method: "GET" }
    );

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Try regular materials endpoint with admin flag and media inclusion
    const regularWithAdmin = await apiFetch<MaterialRecordWithPoins>(
      `/api/v1/materials/${encodeURIComponent(
        String(id)
      )}?admin=true&include_drafts=true&include_media=true&with_media=true`,
      { method: "GET" }
    );

    if (regularWithAdmin.ok) {
      return regularWithAdmin;
    }

    // Try alternative admin endpoint for getting material with poins and media
    const altAdminWithMedia = await apiFetch<MaterialRecordWithPoins>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(String(id))}/with-media`,
      { method: "GET" }
    );

    if (altAdminWithMedia.ok) {
      return altAdminWithMedia;
    }

    // Final fallback to regular materials endpoint with media params
    return apiFetch<MaterialRecordWithPoins>(
      `/api/v1/materials/${encodeURIComponent(String(id))}?include_media=true`,
      { method: "GET" }
    );
  },

  // Update material order index - try admin endpoint first, then fallback
  updateOrder: async (id: string | number, order_index: number) => {
    // Try admin endpoint first
    const adminResult = await apiFetch<MaterialRecordWithPoins>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: { order_index },
      }
    );

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular materials endpoint
    return apiFetch<MaterialRecordWithPoins>(
      `/api/v1/materials/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: { order_index },
      }
    );
  },

  // Create poin with media files in one request
  createWithMedia: async (payload: {
    sub_materi_id: string | number;
    title: string;
    content_html: string;
    duration_label?: string;
    duration_minutes?: number;
    order_index?: number;
    files?: File[];
    captions?: string[];
  }) => {
    const formData = new FormData();

    // Append poin data
    formData.append("title", payload.title);
    formData.append("content_html", payload.content_html);
    if (payload.duration_label)
      formData.append("duration_label", payload.duration_label);
    if (payload.duration_minutes)
      formData.append("duration_minutes", String(payload.duration_minutes));
    if (payload.order_index)
      formData.append("order_index", String(payload.order_index));

    // Append media files
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("media", file);
      });

      // Append captions if provided
      if (payload.captions && payload.captions.length > 0) {
        formData.append("captions", JSON.stringify(payload.captions));
      }
    }

    console.log(
      "Creating poin with media, sub_materi_id:",
      payload.sub_materi_id
    );

    return apiFetch<PoinDetailRecord>(
      `/api/v1/admin/sub-materis/${encodeURIComponent(
        String(payload.sub_materi_id)
      )}/poins-with-media`,
      {
        method: "POST",
        body: formData,
      }
    );
  },
};
