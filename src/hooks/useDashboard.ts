import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/lib/api";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  quizPerformance: (moduleId?: string) => 
    [...dashboardKeys.all, "quiz-performance", moduleId] as const,
};

// Hook untuk fetch dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const res = await adminAPI.dashboardStats();
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch dashboard stats");
      }
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk fetch quiz performance detailed
export function useQuizPerformance(moduleId?: string) {
  return useQuery({
    queryKey: dashboardKeys.quizPerformance(moduleId),
    queryFn: async () => {
      const res = await adminAPI.quizPerformanceDetailed(moduleId);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch quiz performance");
      }
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
