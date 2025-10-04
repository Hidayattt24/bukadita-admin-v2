import { getApiBase } from "./client";

const API_BASE = getApiBase();
const LOGIN_URL = process.env.LOGIN_URL || `${API_BASE}/api/v1/auth/login`;
const LOGOUT_URL = process.env.LOGOUT_URL || `${API_BASE}/api/v1/auth/logout`;

export type BackendProfile = {
  id?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
};

export type LoginSuccess = {
  access_token?: string;
  refresh_token?: string;
  profile?: BackendProfile | null;
  userId?: string | null;
  userEmail?: string | null;
  role?: string | null;
};

export async function apiLogin(
  email: string,
  password: string
): Promise<
  | { ok: true; status: number; data: LoginSuccess }
  | { ok: false; status: number; error: string }
> {
  try {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = json?.error || json?.message || `Login gagal (${res.status})`;
      return { ok: false, status: res.status, error: String(msg) };
    }

    // Normalize different BE response shapes
    const root = json || {};
    const data = root?.data ?? root;
    const access_token =
      data?.access_token ||
      root?.access_token ||
      root?.accessToken ||
      root?.session?.access_token;
    const refresh_token =
      data?.refresh_token ||
      root?.refresh_token ||
      root?.refreshToken ||
      root?.session?.refresh_token;

    // Extract profile from multiple possible locations
    const userObj = data?.user || root?.user || null;
    const profileFromUser =
      userObj?.profile || root?.user?.profile || data?.user?.profile;
    const profileFromData = data?.profile || root?.profile;
    const profile: BackendProfile | null =
      profileFromUser || profileFromData || null;

    const userId = userObj?.id || data?.user_id || data?.id || null;
    const userEmail = userObj?.email || data?.email || null;
    const role =
      (profile as BackendProfile | null)?.role ||
      data?.role ||
      userObj?.role ||
      null;

    return {
      ok: true,
      status: res.status,
      data: {
        access_token,
        refresh_token,
        profile,
        userId,
        userEmail,
        role,
      },
    };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : String(e || "Tidak dapat terhubung ke server login");
    return { ok: false, status: 0, error: message };
  }
}

export async function apiLogout(
  accessToken?: string,
  refreshToken?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const res = await fetch(LOGOUT_URL, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      return {
        ok: false,
        error: json?.error || json?.message || `Logout gagal (${res.status})`,
      };
    }
    return { ok: true };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : String(e || "Tidak dapat terhubung ke server logout");
    return { ok: false, error: message };
  }
}
