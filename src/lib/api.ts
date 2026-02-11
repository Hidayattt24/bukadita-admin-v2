import { apiFetch, getApiBase } from "./api/client";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Role = "pengguna" | "admin" | "superadmin";

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  email: string;
  role: Role;
  created_at: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  address?: string;
  date_of_birth?: string;
  profil_url?: string;
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

// ============================================================================
// AUTH API
// ============================================================================

export type BackendProfile = {
  id?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
};

export type LoginSuccess = {
  access_token?: string;
  refresh_token?: string;
  profile?: BackendProfile | null;
  userId?: string | null;
  userEmail?: string | null;
  role?: string | null;
};

const API_BASE = getApiBase();
const LOGIN_URL = process.env.LOGIN_URL || `${API_BASE}/api/v1/auth/admin-login`;
const LOGOUT_URL = process.env.LOGOUT_URL || `${API_BASE}/api/v1/auth/logout`;

export const authAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<
    | { ok: true; status: number; data: LoginSuccess }
    | { ok: false; status: number; error: string }
  > => {
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier: email, password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          json?.error || json?.message || `Login gagal (${res.status})`;
        return { ok: false, status: res.status, error: String(msg) };
      }

      const root = json || {};
      const data = root?.data ?? root;
      const access_token =
        data?.access_token ||
        root?.access_token ||
        root?.accessToken ||
        root?.session?.access_token;
      const refresh_token =
        data?.refresh_token ||
        root?.refresh_token ||
        root?.refreshToken ||
        root?.session?.refresh_token;

      const userObj = data?.user || root?.user || null;
      const profileFromUser =
        userObj?.profile || root?.user?.profile || data?.user?.profile;
      const profileFromData = data?.profile || root?.profile;
      const profile: BackendProfile | null =
        profileFromUser || profileFromData || null;

      const userId = userObj?.id || data?.user_id || data?.id || null;
      const userEmail = userObj?.email || data?.email || null;
      const role =
        (profile as BackendProfile | null)?.role ||
        data?.role ||
        userObj?.role ||
        null;

      return {
        ok: true,
        status: res.status,
        data: {
          access_token,
          refresh_token,
          profile,
          userId,
          userEmail,
          role,
        },
      };
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : String(e || "Tidak dapat terhubung ke server login");
      return { ok: false, status: 0, error: message };
    }
  },

  logout: async (
    accessToken?: string,
    refreshToken?: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(LOGOUT_URL, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(
          refreshToken ? { refresh_token: refreshToken } : {}
        ),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        return {
          ok: false,
          error: json?.error || json?.message || `Logout gagal (${res.status})`,
        };
      }
      return { ok: true };
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : String(e || "Tidak dapat terhubung ke server logout");
      return { ok: false, error: message };
    }
  },
};

// ============================================================================
// USER MANAGEMENT API
// ============================================================================

export interface UsersListResponse {
  items: Profile[];
  pagination: PaginationMeta;
  visibility: VisibilityRules;
  filters?: {
    search?: string;
    role?: string;
  };
}

export const usersAPI = {
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
    email?: string;
    password: string;
    full_name: string;
    phone?: string;
    role: "pengguna" | "admin";
    address?: string;
    date_of_birth?: string;
    profil_url?: string;
  }) => {
    return apiFetch<Profile>(`/api/v1/admin/users`, {
      method: "POST",
      body: payload,
    });
  },

  get: async (id: string) => {
    return apiFetch<Profile>(`/api/v1/admin/users/${id}`, { method: "GET" });
  },

  update: async (
    id: string,
    payload: Partial<
      Pick<
        Profile,
        | "full_name"
        | "email"
        | "phone"
        | "address"
        | "date_of_birth"
        | "profil_url"
      >
    >
  ) => {
    return apiFetch<Profile>(`/api/v1/admin/users/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  updateRole: async (id: string, role: "pengguna" | "admin") => {
    return apiFetch<Profile>(`/api/v1/admin/users/${id}/role`, {
      method: "PATCH",
      body: { role },
    });
  },

  remove: async (id: string) => {
    return apiFetch<{ ok: boolean }>(`/api/v1/admin/users/${id}`, {
      method: "DELETE",
    });
  },
};

// ============================================================================
// ADMIN DASHBOARD API
// ============================================================================

export const adminAPI = {
  dashboardStats: async () =>
    apiFetch(`/api/v1/admin/progress/stats`, { method: "GET" }),

  systemStats: async () =>
    apiFetch(`/api/v1/admin/progress/stats`, { method: "GET" }),

  quizResults: async (
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
    return apiFetch(`/api/v1/admin/quiz-results?${query.toString()}`, {
      method: "GET",
    });
  },

  inviteAdmin: async (payload: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) => {
    return apiFetch(`/api/v1/admin/invite`, {
      method: "POST",
      body: { ...payload, role: "admin" },
    });
  },

  quizPerformanceDetailed: async (moduleId?: string) => {
    const query = moduleId ? `?module_id=${moduleId}` : "";
    return apiFetch(`/api/v1/admin/quiz-performance-detailed${query}`, {
      method: "GET",
    });
  },

  recentActivitiesClassified: async (limit: number = 15) => {
    return apiFetch(`/api/v1/admin/recent-activities-classified?limit=${limit}`, {
      method: "GET",
    });
  },
};

// ============================================================================
// MODULES API
// ============================================================================

export interface Module {
  id: string | number;
  title: string;
  slug?: string;
  description?: string;
  published?: boolean;
  materiCount?: number;
  quizCount?: number;
  created_at?: string;
  sub_materis?: Material[]; // snake_case from API
  subMateris?: Material[]; // camelCase variant
}

export interface ModulesListResponse {
  items?: Module[];
  data?: Module[];
  pagination?: PaginationMeta;
}

export const modulesAPI = {
  list: async () => {
    return apiFetch<ModulesListResponse>(`/api/v1/modules`, {
      method: "GET",
    });
  },

  get: async (id: string | number) => {
    return apiFetch<Module>(
      `/api/v1/modules/${encodeURIComponent(String(id))}`,
      {
        method: "GET",
      }
    );
  },

  create: async (payload: {
    title: string;
    description?: string;
    published?: boolean;
  }) => {
    return apiFetch<Module>(`/api/v1/modules`, {
      method: "POST",
      body: payload,
    });
  },

  update: async (
    id: string | number,
    payload: { title?: string; description?: string; published?: boolean }
  ) => {
    return apiFetch<Module>(
      `/api/v1/modules/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  remove: async (id: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/modules/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },
};

// ============================================================================
// MATERIALS (SUB-MATERIS) API
// ============================================================================

// Helper function to normalize Material response from backend
function normalizeMaterialResponse<T extends Material | Material[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): T {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item.poinDetails && !item.poin_details) {
        item.poin_details = item.poinDetails;
        delete item.poinDetails;
      }
      return item;
    }) as T;
  } else if (data && typeof data === "object") {
    if (data.poinDetails && !data.poin_details) {
      data.poin_details = data.poinDetails;
      delete data.poinDetails;
    }
  }
  return data as T;
}

export interface Material {
  id: string | number;
  title: string;
  content: string;
  slug?: string;
  published?: boolean;
  module_id?: string;
  created_at?: string;
  updated_at?: string;
  order_index?: number;
  poin_details?: Poin[];
}

export interface MaterialsListResponse {
  items?: Material[];
  data?: Material[];
  pagination?: PaginationMeta;
}

export const materialsAPI = {
  list: async (params: {
    module_id?: string | number;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params.module_id) query.set("module_id", String(params.module_id));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const response = await apiFetch<MaterialsListResponse>(
      `/api/v1/materials?${query.toString()}`,
      {
        method: "GET",
      }
    );

    // Normalize response
    if (response.ok && response.data) {
      if (response.data.items) {
        response.data.items = normalizeMaterialResponse<Material[]>(
          response.data.items
        );
      }
      if (response.data.data) {
        response.data.data = normalizeMaterialResponse<Material[]>(
          response.data.data
        );
      }
    }

    return response;
  },

  get: async (id: string | number) => {
    const response = await apiFetch<Material>(
      `/api/v1/materials/${encodeURIComponent(String(id))}`,
      {
        method: "GET",
      }
    );

    // Normalize backend response: map poinDetails (camelCase) to poin_details (snake_case)
    if (response.ok && response.data) {
      response.data = normalizeMaterialResponse(response.data);
    }

    return response;
  },

  create: async (payload: {
    title: string;
    content: string;
    module_id: string;
    slug?: string;
    published?: boolean;
  }) => {
    const response = await apiFetch<Material>(`/api/v1/materials`, {
      method: "POST",
      body: payload,
    });
    if (response.ok && response.data) {
      response.data = normalizeMaterialResponse(response.data);
    }
    return response;
  },

  update: async (
    id: string | number,
    payload: {
      title?: string;
      content?: string;
      slug?: string;
      published?: boolean;
      module_id?: string;
    }
  ) => {
    const response = await apiFetch<Material>(
      `/api/v1/materials/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
    if (response.ok && response.data) {
      response.data = normalizeMaterialResponse(response.data);
    }
    return response;
  },

  remove: async (id: string | number) =>
    apiFetch<{ ok: boolean }>(
      `/api/v1/materials/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    ),
};

// ============================================================================
// POIN DETAILS API
// ============================================================================

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

export interface Poin {
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

export const poinsAPI = {
  list: async (subMateriId: string | number) => {
    return apiFetch<{ items: Poin[] }>(
      `/api/v1/materials/${encodeURIComponent(String(subMateriId))}/points`,
      { method: "GET" }
    );
  },

  get: async (id: string | number) => {
    return apiFetch<Poin>(
      `/api/v1/materials/points/${encodeURIComponent(String(id))}`,
      {
        method: "GET",
      }
    );
  },

  create: async (
    subMateriId: string | number,
    payload: {
      title: string;
      content_html: string;
      duration_label?: string;
      order_index: number;
      duration_minutes?: number;
    }
  ) => {
    return apiFetch<Poin>(`/api/v1/materials/points`, {
      method: "POST",
      body: {
        sub_materi_id: String(subMateriId),
        ...payload,
      },
    });
  },

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
    return apiFetch<Poin>(
      `/api/v1/materials/points/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  remove: async (id: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/materials/points/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  // Media management
  listMedia: async (poinId: string | number) => {
    return apiFetch<MediaItem[]>(
      `/api/v1/materials/points/${encodeURIComponent(String(poinId))}/media`,
      { method: "GET" }
    );
  },

  uploadMedia: async (
    poinId: string | number,
    files: File[],
    captions?: string[]
  ) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("file", file); // Changed from "media" to "file" to match backend
      if (captions && captions[index]) {
        formData.append(`caption_${index}`, captions[index]);
      }
    });

    return apiFetch<MediaItem[]>(
      `/api/v1/materials/points/${encodeURIComponent(String(poinId))}/media`,
      {
        method: "POST",
        body: formData,
        asJson: false,
      }
    );
  },

  updateMedia: async (
    mediaId: string | number,
    payload: { caption?: string; order_index?: number }
  ) => {
    return apiFetch<MediaItem>(
      `/api/v1/materials/points/media/${encodeURIComponent(String(mediaId))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  removeMedia: async (mediaId: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/materials/points/media/${encodeURIComponent(String(mediaId))}`,
      { method: "DELETE" }
    );
  },
};

// ============================================================================
// QUIZZES API
// ============================================================================

export interface Quiz {
  id: string | number;
  module_id: string | number;
  sub_materi_id?: string | number;
  material_id?: string | number; // Alias for backward compatibility
  quiz_type?: "module" | "sub_materi";
  title: string;
  description?: string;
  time_limit?: number; // Alias for backward compatibility (in seconds)
  time_limit_seconds?: number;
  passing_score?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
  questions?: QuizQuestion[];
  sub_materi?: {
    id: string | number;
    title: string;
  };
  module?: {
    id: string | number;
    title: string;
  };
}

export interface QuizQuestion {
  id: string | number;
  quiz_id: string | number;
  question_text: string;
  options: string[];
  correct_answer_index: number;
  explanation?: string;
  order_index?: number;
}

export interface SubMateriOption {
  id: string | number;
  title: string;
  module_title: string;
  display_title: string;
}

export const quizzesAPI = {
  getSubMateris: async () => {
    return apiFetch<SubMateriOption[]>(`/api/v1/admin/quizzes/sub-materis`, {
      method: "GET",
    });
  },

  list: async (
    params: {
      sub_materi_id?: string | number;
      module_id?: string | number;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.sub_materi_id)
      query.set("sub_materi_id", String(params.sub_materi_id));
    if (params.module_id) query.set("module_id", String(params.module_id));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    return apiFetch<{
      items?: Quiz[];
      quizzes?: Quiz[];
      pagination?: PaginationMeta;
    }>(`/api/v1/admin/quizzes?${query.toString()}`, { method: "GET" });
  },

  get: async (id: string | number) => {
    return apiFetch<Quiz>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );
  },

  getByMaterial: async (materialId: string | number) => {
    return apiFetch<Quiz>(
      `/api/v1/materials/${encodeURIComponent(String(materialId))}/quiz`,
      { method: "GET" }
    );
  },

  create: async (payload: {
    module_id: string | number;
    sub_materi_id?: string | number;
    title: string;
    description?: string;
    time_limit_seconds?: number;
    passing_score?: number;
    published?: boolean;
  }) => {
    return apiFetch<Quiz>(`/api/v1/admin/quizzes`, {
      method: "POST",
      body: payload,
    });
  },

  update: async (
    id: string | number,
    payload: {
      title?: string;
      description?: string;
      sub_materi_id?: string | number;
      time_limit_seconds?: number;
      passing_score?: number;
      published?: boolean;
    }
  ) => {
    return apiFetch<Quiz>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  remove: async (id: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  // Question management
  addQuestion: async (
    quizId: string | number,
    payload: {
      question_text: string;
      options: string[];
      correct_answer_index: number;
      explanation?: string;
      order_index?: number;
    }
  ) => {
    return apiFetch<QuizQuestion>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(quizId))}/questions`,
      {
        method: "POST",
        body: payload,
      }
    );
  },

  updateQuestion: async (
    questionId: string | number,
    payload: {
      question_text?: string;
      options?: string[];
      correct_answer_index?: number;
      explanation?: string;
      order_index?: number;
    }
  ) => {
    return apiFetch<QuizQuestion>(
      `/api/v1/admin/quizzes/questions/${encodeURIComponent(
        String(questionId)
      )}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  removeQuestion: async (questionId: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/admin/quizzes/questions/${encodeURIComponent(
        String(questionId)
      )}`,
      { method: "DELETE" }
    );
  },

  // Alias for removeQuestion
  deleteQuestion: async (questionId: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/admin/quizzes/questions/${encodeURIComponent(
        String(questionId)
      )}`,
      { method: "DELETE" }
    );
  },
};

// ============================================================================
// PROGRESS API
// ============================================================================

export const progressAPI = {
  list: async (params: { user_id?: string; module_id?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.user_id) query.set("user_id", String(params.user_id));
    if (params.module_id) query.set("module_id", String(params.module_id));

    return apiFetch(`/api/v1/progress/modules?${query.toString()}`, {
      method: "GET",
    });
  },

  getModuleProgress: async (moduleId: string) => {
    return apiFetch(
      `/api/v1/progress/modules/${encodeURIComponent(moduleId)}`,
      {
        method: "GET",
      }
    );
  },

  getSubMateriProgress: async (subMateriId: string) => {
    return apiFetch(
      `/api/v1/progress/sub-materis/${encodeURIComponent(subMateriId)}`,
      {
        method: "GET",
      }
    );
  },
};

// ============================================================================
// PROGRESS MONITORING API
// ============================================================================

export interface ProgressMonitoringStats {
  total_users: number;
  active_users: number;
  struggling_users: number;
  inactive_users: number;
}

export interface ModuleCompletionStats {
  module_id: string;
  module_title: string;
  total_completions: number;
  total_stuck: number;
  total_started: number;
  completion_rate: number;
}

export interface UserProgressItem {
  user_id: string;
  user_name: string;
  user_email: string;
  user_profil_url?: string;
  total_modules: number;
  completed_modules: number;
  in_progress_modules: number;
  not_started_modules: number;
  total_materials_read: number;
  total_quiz_attempts: number;
  total_quiz_passed: number;
  total_quiz_failed: number;
  unique_quizzes_attempted: number; // NEW: Total unique quizzes attempted
  pass_rate: number; // NEW: Pass rate percentage (0-100)
  average_quiz_score: number;
  module_quiz_summary: Array<{
    module_id: string;
    module_title: string;
    quizzes_passed: number;
    total_quizzes: number;
  }>;
  last_activity: string;
  status: "active" | "struggling" | "inactive";
}

export interface UserProgressListResponse {
  items: UserProgressItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface QuizAttemptDetail {
  quiz_id: string;
  quiz_title: string;
  score: number;
  passed: boolean;
  attempted_at: string;
  total_questions: number;
  correct_answers: number;
  is_attempted?: boolean;
  answers: Array<{
    question_id: string;
    question_text: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }>;
}

export interface ModuleProgressDetail {
  module_id: string;
  module_title: string;
  status: "not-started" | "in-progress" | "completed";
  materials_read: number;
  total_materials: number;
  quizzes_passed: number;
  total_quizzes: number;
  quiz_attempts: QuizAttemptDetail[];
  last_accessed: string;
  overall_progress: number;
  total_time_spent: number;
}

export interface UserDetailProgress {
  user_id: string;
  user_name: string;
  user_email: string;
  user_profil_url?: string;
  total_modules: number;
  completed_modules: number;
  in_progress_modules: number;
  not_started_modules: number;
  total_materials_read: number;
  total_quiz_attempts: number;
  total_quiz_passed: number;
  total_quiz_failed: number;
  unique_quizzes_attempted: number; // NEW: Total unique quizzes attempted
  pass_rate: number; // NEW: Pass rate percentage (0-100)
  average_quiz_score: number;
  last_activity: string;
  status: "active" | "struggling" | "inactive";
  modules_progress: ModuleProgressDetail[];
}

export interface ReadingProgressStats {
  user_id: string;
  user_name: string;
  user_email: string;
  module_id: string;
  module_title: string;
  sub_materis: Array<{
    sub_materi_id: string;
    sub_materi_title: string;
    total_poins: number;
    read_poins: number;
    scroll_completed_poins: number;
    read_percentage: number;
  }>;
  total_poins: number;
  read_poins: number;
  scroll_completed_poins: number;
  read_percentage: number;
}

export const progressMonitoringAPI = {
  getStats: async () => {
    return apiFetch<ProgressMonitoringStats>(
      `/api/v1/admin/progress-monitoring/stats`,
      { method: "GET" }
    );
  },

  getModuleStats: async () => {
    return apiFetch<ModuleCompletionStats[]>(
      `/api/v1/admin/progress-monitoring/module-stats`,
      { method: "GET" }
    );
  },

  getUserList: async (params: {
    search?: string;
    status?: "active" | "struggling" | "inactive" | "all";
    page?: number;
    limit?: number;
  } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    return apiFetch<UserProgressListResponse>(
      `/api/v1/admin/progress-monitoring/users?${query.toString()}`,
      { method: "GET" }
    );
  },

  getUserDetail: async (userId: string) => {
    return apiFetch<UserDetailProgress>(
      `/api/v1/admin/progress-monitoring/users/${encodeURIComponent(userId)}`,
      { method: "GET" }
    );
  },

  getReadingProgress: async () => {
    return apiFetch<ReadingProgressStats[]>(
      `/api/v1/admin/progress-monitoring/reading-progress`,
      { method: "GET" }
    );
  },

  getStuckUsers: async (moduleId: string) => {
    return apiFetch<UserDetailProgress[]>(
      `/api/v1/admin/progress-monitoring/stuck-users/${encodeURIComponent(moduleId)}`,
      { method: "GET" }
    );
  },
};
