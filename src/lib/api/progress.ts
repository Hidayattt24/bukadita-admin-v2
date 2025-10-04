import { apiFetch } from "./client";

// Types for Progress Tracking
export interface UserProgress {
  user_id: string;
  user_full_name?: string;
  user_email?: string;
  module_progress?: ModuleProgress[];
}

export interface ModuleProgress {
  module_id: string | number;
  module_title?: string;
  completed: boolean;
  completion_percentage: number;
  started_at?: string;
  completed_at?: string;
  sub_materi_progress?: SubMateriProgress[];
}

export interface SubMateriProgress {
  sub_materi_id: string | number;
  sub_materi_title?: string;
  completed: boolean;
  completion_percentage: number;
  started_at?: string;
  completed_at?: string;
  poin_progress?: PoinProgress[];
}

export interface PoinProgress {
  poin_id: string | number;
  poin_title?: string;
  completed: boolean;
  completed_at?: string;
}

export interface QuizAttemptSummary {
  id: string | number;
  quiz_id: string | number;
  quiz_title?: string;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
  score?: number;
  passed?: boolean;
  total_questions?: number;
  correct_answers?: number;
  started_at?: string;
  completed_at?: string;
  answers?: QuizAnswerDetail[];
}

export interface QuizAnswerDetail {
  question_id: string | number;
  question_text?: string;
  selected_index: number;
  selected_option?: string;
  correct_answer_index?: number; // Only shown to admins
  correct_option?: string; // Only shown to admins
  is_correct?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Progress and Attempts Service
export const progressService = {
  // Get user progress overview
  getUserProgress: async (
    userId: string,
    params: {
      module_id?: string | number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.module_id) query.set("module_id", String(params.module_id));

    return apiFetch<UserProgress>(
      `/api/v1/admin/users/${encodeURIComponent(
        userId
      )}/progress?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get all users progress summary (admin dashboard)
  getAllUsersProgress: async (
    params: {
      page?: number;
      limit?: number;
      module_id?: string | number;
      search?: string;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.module_id) query.set("module_id", String(params.module_id));
    if (params.search) query.set("search", String(params.search));

    return apiFetch<PaginatedResponse<UserProgress>>(
      `/api/v1/admin/progress?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get quiz attempts (admin view)
  getQuizAttempts: async (
    params: {
      page?: number;
      limit?: number;
      quiz_id?: string | number;
      user_id?: string;
      module_id?: string | number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.quiz_id) query.set("quiz_id", String(params.quiz_id));
    if (params.user_id) query.set("user_id", String(params.user_id));
    if (params.module_id) query.set("module_id", String(params.module_id));

    return apiFetch<PaginatedResponse<QuizAttemptSummary>>(
      `/api/v1/admin/quiz-attempts?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get detailed quiz attempt (admin view with answers)
  getQuizAttemptDetail: async (attemptId: string | number) => {
    return apiFetch<QuizAttemptSummary>(
      `/api/v1/admin/quiz-attempts/${encodeURIComponent(String(attemptId))}`,
      { method: "GET" }
    );
  },

  // Admin helper: Mark user progress as complete (override)
  markProgressComplete: async (
    userId: string,
    type: "module" | "sub_materi" | "poin",
    resourceId: string | number
  ) => {
    const payload = {
      user_id: userId,
      type,
      resource_id: resourceId,
      completed: true,
    };

    return apiFetch<{ ok: boolean; message?: string }>(
      `/api/v1/admin/progress/override`,
      {
        method: "POST",
        body: payload,
      }
    );
  },

  // Admin helper: Reset user progress
  resetUserProgress: async (
    userId: string,
    type: "module" | "sub_materi" | "poin",
    resourceId: string | number
  ) => {
    const payload = {
      user_id: userId,
      type,
      resource_id: resourceId,
      reset: true,
    };

    return apiFetch<{ ok: boolean; message?: string }>(
      `/api/v1/admin/progress/reset`,
      {
        method: "POST",
        body: payload,
      }
    );
  },

  // Get dashboard stats for progress
  getProgressStats: async () => {
    return apiFetch<{
      total_users: number;
      active_users_today: number;
      total_modules: number;
      total_quizzes: number;
      completed_quizzes_total: number;
      average_completion_rate: number;
      module_completion_stats: Array<{
        module_id: string | number;
        module_title: string;
        total_users_started: number;
        total_users_completed: number;
        completion_rate: number;
      }>;
    }>(`/api/v1/admin/progress/stats`, { method: "GET" });
  },
};
