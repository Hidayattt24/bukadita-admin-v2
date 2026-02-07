import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modulesAPI } from "@/lib/api";

// Query Keys
export const moduleKeys = {
  all: ["modules"] as const,
  lists: () => [...moduleKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...moduleKeys.lists(), filters] as const,
  details: () => [...moduleKeys.all, "detail"] as const,
  detail: (id: string | number) => [...moduleKeys.details(), id] as const,
};

// Hook untuk fetch semua modules
export function useModules() {
  return useQuery({
    queryKey: moduleKeys.lists(),
    queryFn: async () => {
      const res = await modulesAPI.list();
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch modules");
      }
      return res.data;
    },
  });
}

// Hook untuk fetch single module
export function useModule(id: string | number) {
  return useQuery({
    queryKey: moduleKeys.detail(id),
    queryFn: async () => {
      const res = await modulesAPI.get(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch module");
      }
      return res.data;
    },
    enabled: !!id,
  });
}

// Hook untuk create module
export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      published?: boolean;
      duration_label?: string | null;
      duration_minutes?: number | null;
      lessons?: number | null;
      category?: string | null;
    }) => {
      const res = await modulesAPI.create(data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to create module");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch modules list
      queryClient.invalidateQueries({ queryKey: moduleKeys.lists() });
    },
  });
}

// Hook untuk update module
export function useUpdateModule() {
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
        published?: boolean;
      };
    }) => {
      const res = await modulesAPI.update(id, data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update module");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: moduleKeys.lists() });
    },
  });
}

// Hook untuk delete module
export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await modulesAPI.remove(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to delete module");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate modules list
      queryClient.invalidateQueries({ queryKey: moduleKeys.lists() });
    },
  });
}
