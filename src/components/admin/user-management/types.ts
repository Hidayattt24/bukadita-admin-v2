import type { Profile } from "@/lib/api";

export interface User extends Profile {
  address?: string;
  date_of_birth?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserFormData {
  email: string;
  full_name: string;
  phone: string;
  role: "pengguna" | "admin";
  password: string;
  address: string;
  date_of_birth: string;
  profil_url: string;
}
