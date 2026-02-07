import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/lib/api";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string | number) => [...userKeys.details(), id] as const,
};

// Hook untuk fetch semua users
export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const res = await usersAPI.list(params);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch users");
      }
      return res.data;
    },
  });
}

// Hook untuk fetch single user
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const res = await usersAPI.get(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to fetch user");
      }
      return res.data;
    },
    enabled: !!id,
  });
}

// Hook untuk create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email?: string;
      password: string;
      full_name: string;
      phone?: string;
      role: "pengguna" | "admin";
      address?: string;
      date_of_birth?: string;
      profil_url?: string;
    }) => {
      const res = await usersAPI.create(data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to create user");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Hook untuk update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: Partial<{
        full_name: string;
        email: string;
        phone: string;
        address: string;
        date_of_birth: string;
        profil_url: string;
      }>;
    }) => {
      const res = await usersAPI.update(id, data);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update user");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Hook untuk update user role
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "pengguna" | "admin" }) => {
      const res = await usersAPI.updateRole(id, role);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update user role");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Hook untuk delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await usersAPI.remove(id);
      if (!res.ok) {
        throw new Error(res.error || "Failed to delete user");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
