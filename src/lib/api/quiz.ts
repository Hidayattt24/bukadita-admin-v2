import { apiFetch } from "./client";

// Types for Quiz Management
export interface QuizRecord {
  id: string | number;
  module_id?: string | number;
  sub_materi_id?: string | number;
  title: string;
  description?: string;
  time_limit_seconds?: number;
  passing_score?: number;
  created_at?: string;
  updated_at?: string;
  questions?: QuizQuestion[];
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

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Quiz CRUD Operations
export const quizService = {
  // List quizzes with optional filtering
  list: async (
    params: {
      module_id?: string | number;
      sub_materi_id?: string | number;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.module_id) query.set("module_id", String(params.module_id));
    if (params.sub_materi_id)
      query.set("sub_materi_id", String(params.sub_materi_id));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    return apiFetch<PaginatedResponse<QuizRecord>>(
      `/api/v1/quizzes?${query.toString()}`,
      { method: "GET" }
    );
  },

  // Get single quiz with questions
  get: async (id: string | number) => {
    return apiFetch<QuizRecord>(
      `/api/v1/quizzes/${encodeURIComponent(String(id))}`,
      { method: "GET" }
    );
  },

  // Create new quiz
  create: async (payload: {
    module_id?: string | number;
    sub_materi_id?: string | number;
    title: string;
    description?: string;
    time_limit_seconds?: number;
    passing_score?: number;
  }) => {
    return apiFetch<QuizRecord>(`/api/v1/quizzes`, {
      method: "POST",
      body: payload,
    });
  },

  // Update quiz
  update: async (
    id: string | number,
    payload: {
      title?: string;
      description?: string;
      time_limit_seconds?: number;
      passing_score?: number;
    }
  ) => {
    return apiFetch<QuizRecord>(
      `/api/v1/quizzes/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  // Delete quiz
  remove: async (id: string | number) => {
    return apiFetch<{ ok: boolean }>(
      `/api/v1/quizzes/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  // Add question to quiz
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
      `/api/v1/quizzes/${encodeURIComponent(String(quizId))}/questions`,
      {
        method: "POST",
        body: payload,
      }
    );
  },

  // Update question
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
      `/api/v1/quiz-questions/${encodeURIComponent(String(questionId))}`,
      {
        method: "PUT",
        body: payload,
      }
    );
  },

  // Delete question
  removeQuestion: async (questionId: string | number) => {
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
