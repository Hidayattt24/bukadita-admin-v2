import { apiFetch } from "./client";

// Types for Quiz Management
export interface QuizRecord {
  id: string | number;
  sub_materi_id: string | number;
  title: string;
  description?: string;
  time_limit_seconds?: number;
  passing_score?: number;
  published?: boolean; // Preferred field per API documentation
  is_active?: boolean; // Actual field used by backend
  quiz_type?: string; // Backend includes this field
  module_id?: string | number; // Backend includes this field
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  questions?: QuizQuestion[];
  // Joined data from sub_materi and module
  sub_materi?: {
    id: string | number;
    title: string;
    published?: boolean;
  };
  module?: {
    id: string | number;
    title: string;
  };
  sub_materi_title?: string; // Legacy field
  module_title?: string; // Legacy field
}

export interface SubMateriOption {
  id: string | number;
  title: string;
  module_title: string;
  display_title: string; // "Module Title - Sub Materi Title"
}

export interface QuizQuestion {
  id: string | number;
  quiz_id: string | number;
  question_text: string;
  options: string[]; // Array of options like ["Option A", "Option B", "Option C"]
  correct_answer_index: number; // Index of correct option (0-based)
  explanation?: string;
  order_index?: number;
}

export interface QuizAttempt {
  id: string | number;
  quiz_id: string | number;
  user_id: string;
  score?: number;
  passed?: boolean;
  total_questions?: number;
  correct_answers?: number;
  answers: QuizAnswer[];
  started_at?: string;
  completed_at?: string;
}

export interface QuizAnswer {
  question_id: string | number;
  selected_index: number;
  is_correct?: boolean; // For display purposes in admin
}

// Backend API Response Structure (per API documentation)
export interface QuizApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data:
    | {
        quizzes?: T[]; // GET /api/v1/admin/quizzes returns quizzes array
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }
    | T; // Single item responses return data directly
}

// Legacy support for existing code
export interface PaginatedResponse<T> {
  items?: T[];
  quizzes?: T[]; // Support both formats
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Quiz CRUD Operations
export const quizService = {
  // Get sub materi options for dropdown
  getSubMateriOptions: async () => {
    return apiFetch<SubMateriOption[]>(`/api/v1/admin/quiz-sub-materis`, {
      method: "GET",
    });
  },

  // List quizzes with optional filtering (Admin)
  // Returns: { success: true, data: { quizzes: [...], pagination: {...} } }
  list: async (
    params: {
      sub_materi_id?: string | number;
      module_id?: string | number; // Support module_id for backward compatibility
      page?: number;
      limit?: number;
      published?: boolean;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.sub_materi_id)
      query.set("sub_materi_id", String(params.sub_materi_id));
    if (params.module_id) query.set("module_id", String(params.module_id));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.published !== undefined)
      query.set("published", String(params.published));

    // Return the response structure that matches backend API documentation
    // The apiFetch should return: { success: true, data: { quizzes: [...] } }
    return apiFetch<PaginatedResponse<QuizRecord>>(
      `/api/v1/admin/quizzes?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get single quiz with questions (Admin)
  get: async (id: string | number) => {
    return apiFetch<QuizRecord>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );
  },

  // Create new quiz (Admin)
  create: async (payload: {
    sub_materi_id?: string | number;
    module_id?: string | number; // Support module_id for backward compatibility
    title: string;
    description?: string;
    time_limit_seconds?: number;
    passing_score?: number;
    published?: boolean;
  }) => {
    return apiFetch<QuizRecord>(`/api/v1/admin/quizzes`, {
      method: "POST",
      body: payload,
    });
  },

  // Update quiz (Admin)
  update: async (
    id: string | number,
    payload: {
      title?: string;
      description?: string;
      time_limit_seconds?: number;
      passing_score?: number;
      published?: boolean;
    }
  ) => {
    return apiFetch<QuizRecord>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  // Delete quiz (Admin)
  remove: async (id: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/admin/quizzes/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  // Add question to quiz (Admin)
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

  // Update question (Admin)
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
    // Try admin endpoint first
    const adminResult = await apiFetch<QuizQuestion>(
      `/api/v1/admin/quiz-questions/${encodeURIComponent(String(questionId))}`,
      {
        method: "PUT",
        body: payload,
      }
    );

    if (
      adminResult.ok ||
      (adminResult.status !== 404 && adminResult.status !== 405)
    ) {
      return adminResult;
    }

    // Fallback to regular endpoint
    return apiFetch<QuizQuestion>(
      `/api/v1/quiz-questions/${encodeURIComponent(String(questionId))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  // Delete question (Admin)
  removeQuestion: async (questionId: string | number) => {
    // Try admin endpoint first
    const adminResult = await apiFetch<{ ok: boolean }>(
      `/api/v1/admin/quiz-questions/${encodeURIComponent(String(questionId))}`,
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
      `/api/v1/quiz-questions/${encodeURIComponent(String(questionId))}`,
      { method: "DELETE" }
    );
  },

  // Submit quiz attempt (for testing/admin preview)
  submitAttempt: async (
    quizId: string | number,
    answers: { question_id: string | number; selected_index: number }[],
    startedAt?: string
  ) => {
    const payload = {
      answers,
      ...(startedAt && { started_at: startedAt }),
    };

    return apiFetch<QuizAttempt>(
      `/api/v1/quizzes/${encodeURIComponent(String(quizId))}/attempts`,
      {
        method: "POST",
        body: payload,
      }
    );
  },

  // Get attempts for a quiz (admin only)
  getAttempts: async (
    quizId: string | number,
    params: {
      page?: number;
      limit?: number;
      user_id?: string;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.user_id) query.set("user_id", String(params.user_id));

    return apiFetch<PaginatedResponse<QuizAttempt>>(
      `/api/v1/quizzes/${encodeURIComponent(
        String(quizId)
      )}/attempts?${query.toString()}`,
      { method: "GET" }
    );
  },
};
