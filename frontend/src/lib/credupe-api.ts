/**
 * Credupe Backend API client
 * =========================================================================
 * Thin typed fetch wrapper for the NestJS backend at `${BACKEND_URL}/api/v1`.
 * Additive-only: this file is new, nothing else in the frontend is touched.
 * Pages can opt-in to calling these helpers when they want to replace the
 * Supabase-direct flows with the real backend.
 *
 * Tokens are persisted in `localStorage` (keys `credupe_access` /
 * `credupe_refresh`). 401 responses trigger a one-time refresh-retry.
 */

const BACKEND_URL =
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL)) ||
  "";

const API_BASE = BACKEND_URL ? `${BACKEND_URL.replace(/\/+$/, "")}/api/v1` : "/api/v1";

const ACCESS_KEY = "credupe_access";
const REFRESH_KEY = "credupe_refresh";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const credupeTokens = {
  getAccess(): string | null {
    return isBrowser() ? window.localStorage.getItem(ACCESS_KEY) : null;
  },
  getRefresh(): string | null {
    return isBrowser() ? window.localStorage.getItem(REFRESH_KEY) : null;
  },
  set(access: string, refresh?: string) {
    if (!isBrowser()) return;
    window.localStorage.setItem(ACCESS_KEY, access);
    if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

export interface CredupeEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code?: string; status?: number; message: string[] } | null;
}

export class CredupeApiError extends Error {
  status: number;
  code?: string;
  messages: string[];
  constructor(status: number, messages: string[], code?: string) {
    super(messages[0] ?? `HTTP ${status}`);
    this.status = status;
    this.code = code;
    this.messages = messages;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = credupeTokens.getRefresh();
  if (!refreshToken) return false;
  try {
    const resp = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const json: CredupeEnvelope<{ accessToken: string; refreshToken: string }> = await resp.json();
    if (!json.success || !json.data) {
      credupeTokens.clear();
      return false;
    }
    credupeTokens.set(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    credupeTokens.clear();
    return false;
  }
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  opts: { auth?: boolean; retried?: boolean } = {},
): Promise<T> {
  const { auth = true, retried = false } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const tok = credupeTokens.getAccess();
    if (tok) headers["Authorization"] = `Bearer ${tok}`;
  }

  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  // 401 → try refresh once
  if (resp.status === 401 && auth && !retried && credupeTokens.getRefresh()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(method, path, body, { auth, retried: true });
  }

  const json: CredupeEnvelope<T> = await resp.json().catch(() => ({ success: false, data: null, error: { message: [`HTTP ${resp.status}`] } }));
  if (!resp.ok || !json.success) {
    const err = json.error ?? { message: [`HTTP ${resp.status}`] };
    throw new CredupeApiError(resp.status, err.message, err.code);
  }
  return (json.data as T);
}

// ─── Typed API surfaces ─────────────────────────────────────────────────────
export type LoanType =
  | "PERSONAL_LOAN" | "HOME_LOAN" | "LOAN_AGAINST_PROPERTY" | "BUSINESS_LOAN"
  | "CAR_LOAN" | "USED_CAR_LOAN" | "TWO_WHEELER_LOAN" | "EDUCATION_LOAN"
  | "GOLD_LOAN" | "MICRO_LOAN" | "CREDIT_CARD";

export type ApplicationStatus =
  | "LEAD" | "LOGIN" | "DOC_PENDING" | "UNDER_REVIEW"
  | "APPROVED" | "REJECTED" | "DISBURSED" | "CANCELLED";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string; role: "CUSTOMER" | "PARTNER" | "ADMIN" };
}

export interface Paged<T> { items: T[]; total: number; page: number; pageSize: number; totalPages?: number; }

export const credupeApi = {
  base: API_BASE,
  tokens: credupeTokens,

  auth: {
    async register(input: {
      email: string; password: string; firstName?: string; lastName?: string;
      mobile?: string; role?: "CUSTOMER" | "PARTNER"; businessName?: string;
    }) {
      const res = await request<AuthTokens>("POST", "/auth/register", input, { auth: false });
      credupeTokens.set(res.accessToken, res.refreshToken);
      return res;
    },
    async login(email: string, password: string) {
      const res = await request<AuthTokens>("POST", "/auth/login", { email, password }, { auth: false });
      credupeTokens.set(res.accessToken, res.refreshToken);
      return res;
    },
    async logout() {
      try { await request("POST", "/auth/logout", { refreshToken: credupeTokens.getRefresh() }); }
      catch { /* non-fatal */ }
      credupeTokens.clear();
    },
    async requestOtp(mobile: string) {
      return request<{ destination: string; expiresInSec: number; devOtp?: string }>(
        "POST", "/auth/otp/request", { destination: mobile }, { auth: false },
      );
    },
    async verifyOtp(mobile: string, code: string) {
      const res = await request<AuthTokens>("POST", "/auth/otp/verify", { destination: mobile, code }, { auth: false });
      credupeTokens.set(res.accessToken, res.refreshToken);
      return res;
    },
    me() { return request<{ sub: string; email: string; role: string }>("GET", "/auth/me"); },
    isAuthenticated() { return Boolean(credupeTokens.getAccess()); },
  },

  customers: {
    me() { return request<any>("GET", "/customers/me"); },
    update(patch: Record<string, any>) { return request<any>("PATCH", "/customers/me", patch); },
  },

  loanProducts: {
    list(q: { loanType?: LoanType; page?: number; pageSize?: number; search?: string } = {}) {
      const qs = new URLSearchParams(q as any).toString();
      return request<Paged<any>>("GET", `/loan-products${qs ? `?${qs}` : ""}`, undefined, { auth: false });
    },
    eligibility(input: {
      loanType: LoanType; amount: number; tenureMonths?: number;
      monthlyIncome?: number; cibilScore?: number; city?: string; state?: string;
    }) {
      return request<{ count: number; offers: any[] }>("POST", "/loan-products/eligibility", input, { auth: false });
    },
  },

  quotes: {
    create(input: {
      loanType: LoanType; amount: number; tenureMonths: number;
      monthlyIncome?: number; cibilScore?: number; city?: string; state?: string;
      fullName?: string; mobile?: string; email?: string;
    }) {
      return request<any>("POST", "/quotes", input, { auth: false });
    },
    get(id: string) { return request<any>("GET", `/quotes/${id}`, undefined, { auth: false }); },
    apply(id: string, input: { productId?: string; purpose?: string } = {}) {
      return request<any>("POST", `/quotes/${id}/apply`, input);
    },
  },

  applications: {
    create(input: {
      loanType: LoanType; amountRequested: number; tenureMonths: number;
      productId?: string; purpose?: string; formData?: Record<string, any>;
    }) {
      return request<any>("POST", "/loan-applications", input);
    },
    mine(q: { page?: number; pageSize?: number; status?: ApplicationStatus } = {}) {
      const qs = new URLSearchParams(q as any).toString();
      return request<Paged<any>>("GET", `/loan-applications/mine${qs ? `?${qs}` : ""}`);
    },
    get(id: string) { return request<any>("GET", `/loan-applications/${id}`); },
    cancel(id: string, note?: string) {
      return request<any>("POST", `/loan-applications/${id}/transition`, { toStatus: "CANCELLED", note });
    },
  },

  leads: {
    create(input: {
      customerName: string; customerMobile: string; customerEmail?: string;
      loanType: LoanType; amountRequested?: number; productId?: string;
      city?: string; notes?: string;
    }) { return request<any>("POST", "/leads", input); },
    list(q: { page?: number; pageSize?: number; status?: string } = {}) {
      const qs = new URLSearchParams(q as any).toString();
      return request<Paged<any>>("GET", `/leads${qs ? `?${qs}` : ""}`);
    },
  },

  documents: {
    presign(input: { fileName: string; mimeType?: string; tag?: string; applicationId?: string }) {
      return request<{ storageKey: string; key: string; uploadUrl: string; method: "PUT"; headers: Record<string, string>; expiresInSec: number }>(
        "POST", "/documents/presign", input,
      );
    },
    register(input: { storageKey: string; fileName: string; mimeType?: string; sizeBytes?: number; tag?: string; applicationId?: string }) {
      return request<any>("POST", "/documents", input);
    },
    list(applicationId?: string) {
      return request<any[]>("GET", `/documents${applicationId ? `?applicationId=${encodeURIComponent(applicationId)}` : ""}`);
    },
  },

  notifications: {
    list(unreadOnly = false) {
      return request<Paged<any>>("GET", `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`);
    },
    markRead(id: string) { return request<any>("PATCH", `/notifications/${id}/read`); },
    markAllRead() { return request<any>("PATCH", "/notifications/read-all"); },
  },

  health() { return request<any>("GET", "/health", undefined, { auth: false }); },
};

export type CredupeApi = typeof credupeApi;
export default credupeApi;
