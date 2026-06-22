/**
 * Upstream NestJS proxy primitives shared by every Route Handler in the BFF.
 *
 * `nestUrl()`         — build a fully-qualified URL to the NestJS API.
 * `forwardJson()`     — proxy a JSON request and return the parsed envelope.
 * `refreshUpstream()` — call NestJS /auth/refresh with a refresh token and
 *                       return the new tokens (or null if rotation failed).
 */
export const NEST_BASE = (() => {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || "";
  return raw ? `${raw.replace(/\/+$/, "")}/api/v1` : "/api/v1";
})();

export function nestUrl(path: string): string {
  return `${NEST_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface NestEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code?: string; status?: number; message: string[] } | null;
}

export async function forwardJson<T = any>(
  method: string,
  path: string,
  init: { body?: unknown; bearer?: string | null } = {},
): Promise<{ status: number; json: NestEnvelope<T> }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (init.bearer) headers["Authorization"] = `Bearer ${init.bearer}`;

  const upstream = await fetch(nestUrl(path), {
    method,
    headers,
    body: init.body != null ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await upstream.json().catch(() => null)) as NestEnvelope<T> | null;
  return {
    status: upstream.status,
    json: json ?? { success: false, data: null, error: { message: [`HTTP ${upstream.status}`] } },
  };
}

/** Calls upstream /auth/refresh; returns fresh tokens (with NestJS's `expiresIn`) or null. */
export async function refreshUpstream(refreshToken: string) {
  const { json } = await forwardJson<{ accessToken: string; refreshToken: string; expiresIn: number }>(
    "POST",
    "/auth/refresh",
    { body: { refreshToken } },
  );
  if (!json.success || !json.data) return null;
  return json.data;
}
