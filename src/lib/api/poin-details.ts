import { apiFetch } from "./client";

// Types for Poin Details Management
export interface PoinDetailRecord {
  id: string | number;
  sub_materi_id: string | number;
  title: string;
  content_html: string;
  type: "text" | "video" | "image";
  order_index: number;
  duration_minutes?: number;
  created_at?: string;
  updated_at?: string;
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

    return apiFetch<PaginatedResponse<PoinDetailRecord>>(
      `/api/v1/materials/${encodeURIComponent(
        String(subMateriId)
      )}/poin-details?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get single poin detail
  get: async (id: string | number) => {
    return apiFetch<PoinDetailRecord>(
      `/api/v1/poin-details/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );
  },

  // Create new poin detail
  create: async (payload: {
    sub_materi_id: string | number;
    title: string;
    content_html: string;
    type: "text" | "video" | "image";
    order_index: number;
    duration_minutes?: number;
  }) => {
    return apiFetch<PoinDetailRecord>(`/api/v1/poin-details`, {
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
      type?: "text" | "video" | "image";
      order_index?: number;
      duration_minutes?: number;
    }
  ) => {
    return apiFetch<PoinDetailRecord>(
      `/api/v1/poin-details/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  // Delete poin detail
  remove: async (id: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/poin-details/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  // Mark poin as complete (for testing progress flow)
  markComplete: async (poinId: string | number, materiId?: string | number) => {
    // Try both possible endpoints based on backend implementation
    const endpoints = [
      `/api/v1/materials/${materiId}/points/${poinId}/complete`,
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

    // If both fail, return error
    return {
      ok: false,
      status: 404,
      error: "Complete endpoint not found",
    } as const;
  },
};

// Enhanced Materials Service with Poin Details
export const enhancedMaterialService = {
  // Get material with poin details
  getWithPoins: async (id: string | number) => {
    return apiFetch<MaterialRecordWithPoins>(
      `/api/v1/materials/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );
  },

  // Update material order index
  updateOrder: async (id: string | number, order_index: number) => {
    return apiFetch<MaterialRecordWithPoins>(
      `/api/v1/materials/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: { order_index },
      }
    );
  },
};
