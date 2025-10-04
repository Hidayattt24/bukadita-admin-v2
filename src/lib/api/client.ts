// Centralized API client for calling the new Express backend
// Ensures Authorization: Bearer <access_token> and JSON headers are set.

const RAW_DEFAULT_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL)) ||
  "http://localhost:4000";

function stripTrailingSlash(u: string) {
  return u.replace(/\/$/, "");
}

export function getApiBase(): string {
  // Allow overriding at runtime via window.__API_BASE if needed
  if (typeof window !== "undefined") {
    const w = window as typeof window & { __API_BASE?: string };
    if (w.__API_BASE) return stripTrailingSlash(w.__API_BASE);
  }
  return stripTrailingSlash(RAW_DEFAULT_BASE);
}

export function getStoredAccessToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return (
      sessionStorage.getItem("admin_access_token") ||
      localStorage.getItem("admin_access_token") ||
      undefined ||
      undefined
    );
  } catch {
    return undefined;
  }
}

export type ApiFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  asJson?: boolean; // default true: serialize body and set headers
  body?: unknown; // allow plain objects to be JSON-serialized
  headers?: Record<string, string>;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string; raw?: unknown }
> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const headers: Record<string, string> = {};
  const token = getStoredAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const asJson = options.asJson !== false;
  if (asJson) headers["Content-Type"] = "application/json";

  const init: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
    body:
      asJson && options.body && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : (options.body as BodyInit | null | undefined),
    credentials: options.credentials ?? "include",
  };

  try {
    const res = await fetch(url, init);
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      // Prefer 'message' when available; handle boolean error flags gracefully
      let msg: unknown = undefined;
      if (json && typeof json === "object") {
        const j = json as Record<string, unknown>;
        msg =
          j.message ||
          (typeof j.error === "object" &&
            j.error &&
            (j.error as Record<string, unknown>).message) ||
          (typeof j.error === "string" ? j.error : undefined) ||
          j.code ||
          undefined;
      }
      if (!msg) msg = `Request failed (${res.status})`;
      return { ok: false, status: res.status, error: String(msg), raw: json };
    }
    return { ok: true, status: res.status, data: (json?.data ?? json) as T };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : String(e || "Network error");
    return { ok: false, status: 0, error: message };
  }
}
