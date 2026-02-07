import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizzesAPI } from "@/lib/api";

// Query Keys
export const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...quizKeys.lists(), filters] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string | number) => [...quizKeys.details(), id] as const,
  byModule: (moduleId: string | number) => [...quizKeys.all, "module", moduleId] as const,
};

// Hook untuk fetch quizzes
export function useQuizzes(params?: { 
  module_id?: string | number; 
  sub_materi_id?: string | number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: quizKeys.list(params),
    queryFn: async () => {
      const res = await quizzesAPI.list(params || {});
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch quizzes");
      }
      return res.data;
    },
    enabled: !!(params?.module_id || params?.sub_materi_id), // Only fetch if filter is provided
  });
}

// Hook untuk fetch single quiz
export function useQuiz(id: string | number) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: async () => {
      const res = await quizzesAPI.get(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch quiz");
      }
      return res.data;
    },
    enabled: !!id,
  });
}

// Hook untuk create quiz
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      module_id: string | number;
      sub_materi_id?: string | number;
      title: string;
      description?: string;
      time_limit_seconds?: number;
      passing_score?: number;
      published?: boolean;
    }) => {
      const res = await quizzesAPI.create(data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to create quiz");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

// Hook untuk update quiz
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string | number; 
      data: {
        title?: string;
        description?: string;
        time_limit_seconds?: number;
        passing_score?: number;
        published?: boolean;
      };
    }) => {
      const res = await quizzesAPI.update(id, data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update quiz");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

// Hook untuk delete quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await quizzesAPI.remove(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to delete quiz");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}
