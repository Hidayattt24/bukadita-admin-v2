import { adminUsersApi } from "./admin";

export interface UpdateUserPayload {
  full_name: string;
  phone: string;
  role?: "admin" | "pengguna";
  password?: string;
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const res = await adminUsersApi.update(id, payload);
  if (!res.ok) {
    throw new Error(res.error || `Update failed (${res.status})`);
  }
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await adminUsersApi.remove(id);
  if (!res.ok) {
    throw new Error(res.error || `Delete failed (${res.status})`);
  }
  return res.data;
}

export async function createUser(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: "admin" | "pengguna";
}) {
  const res = await adminUsersApi.create(payload);
  if (!res.ok) {
    throw new Error(res.error || `Create failed (${res.status})`);
  }
  return res.data;
}
