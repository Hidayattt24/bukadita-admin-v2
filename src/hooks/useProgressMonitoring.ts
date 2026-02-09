import { useQuery } from "@tanstack/react-query";
import { progressMonitoringAPI } from "@/lib/api";

// Query Keys
export const progressMonitoringKeys = {
  all: ["progress-monitoring"] as const,
  stats: () => [...progressMonitoringKeys.all, "stats"] as const,
  moduleStats: () => [...progressMonitoringKeys.all, "module-stats"] as const,
  userLists: () => [...progressMonitoringKeys.all, "user-list"] as const,
  userList: (filters?: Record<string, unknown>) => [...progressMonitoringKeys.userLists(), filters] as const,
  userDetails: () => [...progressMonitoringKeys.all, "user-detail"] as const,
  userDetail: (userId: string) => [...progressMonitoringKeys.userDetails(), userId] as const,
  readingProgress: () => [...progressMonitoringKeys.all, "reading-progress"] as const,
  stuckUsers: (moduleId: string) => [...progressMonitoringKeys.all, "stuck-users", moduleId] as const,
};

// Hook untuk fetch progress monitoring stats
export function useProgressMonitoringStats() {
  return useQuery({
    queryKey: progressMonitoringKeys.stats(),
    queryFn: async () => {
      const res = await progressMonitoringAPI.getStats();
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch progress monitoring stats");
      }
      return res.data;
    },
  });
}

// Hook untuk fetch module completion stats
export function useModuleCompletionStats() {
  return useQuery({
    queryKey: progressMonitoringKeys.moduleStats(),
    queryFn: async () => {
      const res = await progressMonitoringAPI.getModuleStats();
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch module completion stats");
      }
      return res.data;
    },
  });
}

// Hook untuk fetch user progress list with pagination and filtering
export function useUserProgressList(params?: {
  search?: string;
  status?: "active" | "struggling" | "inactive" | "all";
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: progressMonitoringKeys.userList(params),
    queryFn: async () => {
      const res = await progressMonitoringAPI.getUserList(params);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch user progress list");
      }
      return res.data;
    },
  });
}

// Hook untuk fetch detailed user progress
export function useUserDetailProgress(userId: string) {
  return useQuery({
    queryKey: progressMonitoringKeys.userDetail(userId),
    queryFn: async () => {
      const res = await progressMonitoringAPI.getUserDetail(userId);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch user detail progress");
      }
      return res.data;
    },
    enabled: !!userId,
  });
}

// Hook untuk fetch reading progress stats
export function useReadingProgressStats() {
  return useQuery({
    queryKey: progressMonitoringKeys.readingProgress(),
    queryFn: async () => {
      const res = await progressMonitoringAPI.getReadingProgress();
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch reading progress stats");
      }
      return res.data;
    },
  });
}

// Hook untuk fetch stuck users by module
export function useStuckUsersByModule(moduleId: string) {
  return useQuery({
    queryKey: progressMonitoringKeys.stuckUsers(moduleId),
    queryFn: async () => {
      const res = await progressMonitoringAPI.getStuckUsers(moduleId);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch stuck users");
      }
      return res.data;
    },
    enabled: !!moduleId,
  });
}
