import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsAPI } from "@/lib/api";

// Query Keys
export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: string | number) => [...materialKeys.details(), id] as const,
  byModule: (moduleId: string | number) => [...materialKeys.all, "module", moduleId] as const,
};

// Hook untuk fetch materials by module
export function useMaterials(params?: { module_id?: string | number; page?: number; limit?: number }) {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: async () => {
      const res = await materialsAPI.list(params || {});
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch materials");
      }
      return res.data;
    },
    enabled: !!params?.module_id, // Only fetch if module_id is provided
  });
}

// Hook untuk fetch single material
export function useMaterial(id: string | number) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: async () => {
      const res = await materialsAPI.get(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch material");
      }
      return res.data;
    },
    enabled: !!id,
  });
}

// Hook untuk create material
export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      module_id: string;
      slug?: string;
      published?: boolean;
    }) => {
      const res = await materialsAPI.create(data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to create material");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

// Hook untuk update material
export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string | number; 
      data: {
        title?: string;
        content?: string;
        slug?: string;
        published?: boolean;
        module_id?: string;
        order_index?: number;
      };
    }) => {
      const res = await materialsAPI.update(id, data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update material");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

// Hook untuk delete material
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await materialsAPI.remove(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to delete material");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}
