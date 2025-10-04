import { apiFetch } from "./client";

// Types
export type Role = "pengguna" | "admin" | "superadmin";

export interface AdminUser {
  id: string;
  full_name: string;
  phone?: string;
  email: string;
  role: Role;
  created_at: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  nextPage?: number | null;
  prevPage?: number | null;
}

export interface VisibilityRules {
  caller_role: Role;
  allowed_roles: Role[];
  excluded_self: boolean;
}

export interface UsersListResponse {
  items: AdminUser[];
  pagination: PaginationMeta;
  visibility: VisibilityRules; // Backend uses 'visibility' not 'visibility_rules'
  filters?: {
    search?: string;
    role?: string;
  };
}

export const adminUsersApi = {
  list: async (
    params: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.role) query.set("role", String(params.role));
    if (params.search) query.set("search", String(params.search));
    return apiFetch<UsersListResponse>(
      `/api/v1/admin/users?${query.toString()}`,
      {
        method: "GET",
      }
    );
  },

  create: async (payload: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role: "pengguna" | "admin";
  }) => {
    return apiFetch<AdminUser>(`/api/v1/admin/users`, {
      method: "POST",
      body: payload,
    });
  },

  get: async (id: string) => {
    return apiFetch<AdminUser>(`/api/v1/admin/users/${id}`, { method: "GET" });
  },

  update: async (
    id: string,
    payload: Partial<Pick<AdminUser, "full_name" | "phone" | "email">>
  ) => {
    return apiFetch<AdminUser>(`/api/v1/admin/users/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  updateRole: async (id: string, role: "pengguna" | "admin") => {
    return apiFetch<AdminUser>(`/api/v1/admin/users/${id}/role`, {
      method: "PUT",
      body: { role },
    });
  },

  remove: async (id: string, mode?: "soft" | "hard") => {
    const query = new URLSearchParams();
    if (mode && mode === "soft") query.set("mode", "soft");
    return apiFetch<{ ok: boolean }>(
      `/api/v1/admin/users/${id}${
        query.toString() ? `?${query.toString()}` : ""
      }`,
      { method: "DELETE" }
    );
  },
};

export const adminDashboardApi = {
  stats: async () =>
    apiFetch(`/api/v1/admin/dashboard/stats`, { method: "GET" }),
};

export const adminQuizResultsApi = {
  list: async (
    params: {
      page?: number;
      limit?: number;
      quiz_id?: string;
      user_id?: string;
      module_id?: string;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.quiz_id) query.set("quiz_id", String(params.quiz_id));
    if (params.user_id) query.set("user_id", String(params.user_id));
    if (params.module_id) query.set("module_id", String(params.module_id));
    return apiFetch(`/api/v1/admin/quiz-attempts?${query.toString()}`, {
      method: "GET",
    });
  },

  getAttemptDetail: async (attemptId: string | number) => {
    return apiFetch(
      `/api/v1/admin/quiz-attempts/${encodeURIComponent(String(attemptId))}`,
      {
        method: "GET",
      }
    );
  },
};

// ================
// Materials (admin)
// ================

export interface MaterialRecord {
  id: string | number;
  title: string;
  content: string;
  slug?: string;
  published?: boolean;
  module_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialsListResponse {
  items?: MaterialRecord[];
  data?: MaterialRecord[];
  pagination?: PaginationMeta;
}

export const adminMaterialsApi = {
  list: async (params: {
    module_id: string | number;
    page?: number;
    limit?: number;
    include_drafts?: boolean; // Admin-specific parameter (kept for compatibility)
  }) => {
    const query = new URLSearchParams();
    if (params.module_id) query.set("module_id", String(params.module_id));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    // Use ADMIN endpoint as suggested by backend team
    // This endpoint returns ALL materials including unpublished (published=false)
    const endpoint = `/api/v1/admin/sub-materis?${query.toString()}`;

    return apiFetch<MaterialsListResponse>(endpoint, {
      method: "GET",
      cache: "no-store",
    });
  },

  // Create at root (requires module_id in body)
  createRoot: (payload: {
    title: string;
    content: string;
    module_id: string;
    slug?: string;
    published?: boolean;
  }) => apiFetch(`/api/v1/materials`, { method: "POST", body: payload }),

  // Nested create: module_id inferred from URL (resilient path)
  // Resilient nested create: try public path first, then admin-scoped
  createNested: async (
    moduleId: string | number,
    payload: {
      title: string;
      content: string;
      slug?: string;
      published?: boolean;
    }
  ) => {
    const pathAdmin = `/api/v1/admin/modules/${encodeURIComponent(
      String(moduleId)
    )}/materials`;
    const pathPublic = `/api/v1/modules/${encodeURIComponent(
      String(moduleId)
    )}/materials`;
    const first = await apiFetch(pathPublic, { method: "POST", body: payload });
    if (first.ok || (first.status !== 404 && first.status !== 405))
      return first;
    return apiFetch(pathAdmin, { method: "POST", body: payload });
  },

  update: (
    id: string | number,
    payload: {
      title?: string;
      content?: string;
      slug?: string;
      published?: boolean;
      module_id?: string; // allow moving material between modules
    }
  ) =>
    apiFetch(`/api/v1/materials/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      body: payload,
    }),

  remove: (id: string | number) =>
    apiFetch(`/api/v1/materials/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    }),
};

export const adminSchedulesApi = {
  create: (payload: {
    title: string;
    description?: string;
    location?: string;
    date: string;
  }) => apiFetch(`/api/v1/schedules`, { method: "POST", body: payload }),
  update: (
    id: string | number,
    payload: {
      title?: string;
      description?: string;
      location?: string;
      date?: string;
    }
  ) => apiFetch(`/api/v1/schedules/${id}`, { method: "PUT", body: payload }),
  remove: (id: string | number) =>
    apiFetch(`/api/v1/schedules/${id}`, { method: "DELETE" }),
};

// =====================
// Modules (dynamic) API
// =====================

export interface ModuleItem {
  id: string | number; // Could be slug or numeric ID depending on backend
  title: string;
  slug?: string;
  description?: string;
  published?: boolean;
  materiCount?: number;
  quizCount?: number;
  created_at?: string;
}

export interface ModulesListResponse {
  items?: ModuleItem[];
  data?: ModuleItem[];
  pagination?: PaginationMeta;
}

// Resilient modules API: try admin-scoped path first, then fallback
const MODULES_PRIMARY_PATH = "/api/v1/admin/modules" as const;
const MODULES_FALLBACK_PATH = "/api/v1/modules" as const;

export const adminModulesApi = {
  list: async () => {
    const first = await apiFetch<ModulesListResponse>(
      `${MODULES_PRIMARY_PATH}`,
      { method: "GET" }
    );
    if (first.ok || (first.status !== 404 && first.status !== 405))
      return first;
    return apiFetch<ModulesListResponse>(`${MODULES_FALLBACK_PATH}`, {
      method: "GET",
    });
  },
  create: async (payload: {
    title: string;
    description?: string;
    published?: boolean;
  }) => {
    const first = await apiFetch<ModuleItem>(`${MODULES_PRIMARY_PATH}`, {
      method: "POST",
      body: payload,
    });
    if (first.ok || (first.status !== 404 && first.status !== 405))
      return first;
    return apiFetch<ModuleItem>(`${MODULES_FALLBACK_PATH}`, {
      method: "POST",
      body: payload,
    });
  },
  update: async (
    id: string | number,
    payload: { title?: string; description?: string; published?: boolean }
  ) => {
    const path1 = `${MODULES_PRIMARY_PATH}/${encodeURIComponent(String(id))}`;
    const path2 = `${MODULES_FALLBACK_PATH}/${encodeURIComponent(String(id))}`;
    const first = await apiFetch<ModuleItem>(path1, {
      method: "PUT",
      body: payload,
    });
    if (first.ok || (first.status !== 404 && first.status !== 405))
      return first;
    return apiFetch<ModuleItem>(path2, { method: "PUT", body: payload });
  },
  remove: async (id: string | number) => {
    const path1 = `${MODULES_PRIMARY_PATH}/${encodeURIComponent(String(id))}`;
    const path2 = `${MODULES_FALLBACK_PATH}/${encodeURIComponent(String(id))}`;
    const first = await apiFetch<{ ok: boolean }>(path1, { method: "DELETE" });
    if (first.ok || (first.status !== 404 && first.status !== 405))
      return first;
    return apiFetch<{ ok: boolean }>(path2, { method: "DELETE" });
  },
};
