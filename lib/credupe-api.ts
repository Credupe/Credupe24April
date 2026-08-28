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
  user: { id: string; email: string; role: "CUSTOMER" | "PARTNER" | "ADMIN" | "EMPLOYEE" };
}

export interface Paged<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
// BYPASS SWITCH: Set to true to use the local frontend mock for portfolio features.
// Set to false to use the real NestJS/Hono backend endpoints.
const USE_PORTFOLIO_MOCK = true;

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
      catch (err) {
        if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
          console.warn("[credupe-api] logout request failed:", err);
        }
      }
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
    async forgotPassword(email: string) {
      return request<{ email: string; expiresInSec: number; devOtp?: string }>(
        "POST", "/auth/forgot-password", { email }, { auth: false },
      );
    },
    async resetPassword(input: { email: string; code: string; newPassword: string }) {
      return request<{ success: boolean }>(
        "POST", "/auth/reset-password", input, { auth: false },
      );
    },
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
    createPublic(input: {
      loanType: string;
      amount: number;
      tenureMonths: number;
      lenderId?: string;
      formData: Record<string, any>;
      partnerCode?: string;
    }) {
      return request<any>("POST", "/loan-applications/public", input, { auth: false });
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

  lenders: {
    get(slug: string) {
      return request<any>("GET", `/lenders/${encodeURIComponent(slug)}`, undefined, { auth: false });
    },
    list(activeOnly = true) {
      return request<{ items: any[], total: number }>("GET", `/lenders?active=${activeOnly}`, undefined, { auth: false });
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
    createPublic(input: {
      customerName: string;
      customerMobile: string;
      customerEmail?: string;
      loanType: string;
      partnerCode?: string;
    }) {
      return request<any>("POST", "/leads/public", input, { auth: false });
    },
  },

  creditScore: {
    check(input: { fullName: string; mobile: string; email?: string }) {
      return request<{ score: number; status: string; id: string }>(
        "POST",
        "/credit-score",
        input
      );
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

  portfolio: {
    // me() { return request<any>("GET", "/portfolio/me"); },
    async me() {
      if (USE_PORTFOLIO_MOCK) {
        const removedLoans = JSON.parse((typeof window !== "undefined" && window.localStorage.getItem("mock_removed_loans")) || "[]");
        const loans = [
          {
            id: "demo_home",
            source: "AA",
            lender: "Axis Bank",
            productName: "Axis Home Loan",
            loanType: "HOME_LOAN",
            outstanding: 20000000,
            emi: 215000,
            rate: 9.40,
            marketRate: 8.50,
            tenureLeftMonths: 228,
            disbursedOn: "2022-04-15",
          },
          {
            id: "demo_pl",
            source: "AA",
            lender: "ICICI Bank",
            productName: "ICICI Personal Loan",
            loanType: "PERSONAL_LOAN",
            outstanding: 1000000,
            emi: 35000,
            rate: 14.99,
            marketRate: 10.75,
            tenureLeftMonths: 34,
            disbursedOn: "2023-09-10",
          },
        ].filter(l => !removedLoans.includes(l.id));

        const totalOutstanding = loans.reduce((s, l) => s + l.outstanding, 0);
        const totalEmi = loans.reduce((s, l) => s + l.emi, 0);
        const weightedAvgRate = totalOutstanding === 0 ? 0 : loans.reduce((s, l) => s + l.rate * l.outstanding, 0) / totalOutstanding;

        return {
          loans,
          summary: {
            totalOutstanding,
            totalEmi,
            weightedAvgRate,
            lenderCount: new Set(loans.map((l) => l.lender)).size,
            loanCount: loans.length,
          },
          insights: [
            {
              loanId: "demo_pl",
              kind: "BALANCE_TRANSFER",
              loanType: "PERSONAL_LOAN",
              currentLender: "ICICI Bank",
              currentRate: 14.99,
              suggestedRate: 10.75,
              currentEmi: 35000,
              newEmi: 34260,
              monthlySaving: 740,
              lifetimeSaving: 25160,
              reason: "Your current rate is 14.99%, today's best market rate is 10.75%.",
            },
            {
              loanId: "demo_home",
              kind: "BALANCE_TRANSFER",
              loanType: "HOME_LOAN",
              currentLender: "Axis Bank",
              currentRate: 9.40,
              suggestedRate: 8.50,
              currentEmi: 215000,
              newEmi: 177382,
              monthlySaving: 37618,
              lifetimeSaving: 8576904,
              reason: "Your current rate is 9.40%, today's best market rate is 8.50%.",
            },
          ].filter(ins => loans.some(l => l.id === ins.loanId)),
          hasData: loans.length > 0,
        };
      }
      return request<any>("GET", "/portfolio/me");
    },

    // demo() { return request<any>("GET", "/portfolio/demo"); },
    async demo() {
      if (USE_PORTFOLIO_MOCK) {
        const loans = [
          {
            id: "demo_home",
            source: "DEMO",
            lender: "Axis Bank",
            productName: "Axis Home Loan",
            loanType: "HOME_LOAN",
            outstanding: 20000000,
            emi: 215000,
            rate: 9.40,
            marketRate: 8.50,
            tenureLeftMonths: 228,
            disbursedOn: "2022-04-15",
          },
          {
            id: "demo_pl",
            source: "DEMO",
            lender: "ICICI Bank",
            productName: "ICICI Personal Loan",
            loanType: "PERSONAL_LOAN",
            outstanding: 1000000,
            emi: 35000,
            rate: 14.99,
            marketRate: 10.75,
            tenureLeftMonths: 34,
            disbursedOn: "2023-09-10",
          },
        ];
        return {
          loans,
          summary: {
            totalOutstanding: loans.reduce((s, l) => s + l.outstanding, 0),
            totalEmi: loans.reduce((s, l) => s + l.emi, 0),
            weightedAvgRate: loans.reduce((s, l) => s + l.rate * l.outstanding, 0) / loans.reduce((s, l) => s + l.outstanding, 0),
            lenderCount: new Set(loans.map((l) => l.lender)).size,
            loanCount: loans.length,
          },
          insights: [
            {
              loanId: "demo_pl",
              kind: "BALANCE_TRANSFER",
              loanType: "PERSONAL_LOAN",
              currentLender: "ICICI Bank",
              currentRate: 14.99,
              suggestedRate: 10.75,
              currentEmi: 35000,
              newEmi: 34260,
              monthlySaving: 740,
              lifetimeSaving: 25160,
              reason: "Your current rate is 14.99%, today's best market rate is 10.75%.",
            },
            {
              loanId: "demo_home",
              kind: "BALANCE_TRANSFER",
              loanType: "HOME_LOAN",
              currentLender: "Axis Bank",
              currentRate: 9.40,
              suggestedRate: 8.50,
              currentEmi: 215000,
              newEmi: 177382,
              monthlySaving: 37618,
              lifetimeSaving: 8576904,
              reason: "Your current rate is 9.40%, today's best market rate is 8.50%.",
            },
          ],
          hasData: true,
          demo: true,
        };
      }
      return request<any>("GET", "/portfolio/demo");
    },

    // requestConsent() { return request<{ consentHandle: string; redirectUrl: string; status: string; expiresAt: string; mocked: boolean }>("POST", "/portfolio/aa/consent"); },
    async requestConsent() {
      if (USE_PORTFOLIO_MOCK) {
        return {
          consentHandle: "mock-consent-handle",
          redirectUrl: "https://aa-mock.credupe.local/consent/mock-consent-handle",
          status: "PENDING",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          mocked: true,
        };
      }
      return request<{ consentHandle: string; redirectUrl: string; status: string; expiresAt: string; mocked: boolean }>("POST", "/portfolio/aa/consent");
    },

    // consentStatus(handle: string) {
    //   return request<{ status: string; approvedAt?: string; consumedAt?: string; errorReason?: string }>("GET", `/portfolio/aa/consent/${encodeURIComponent(handle)}`);
    // },
    async consentStatus(handle: string) {
      if (USE_PORTFOLIO_MOCK) {
        return {
          status: "APPROVED",
          approvedAt: new Date().toISOString(),
        };
      }
      return request<{ status: string; approvedAt?: string; consumedAt?: string; errorReason?: string }>("GET", `/portfolio/aa/consent/${encodeURIComponent(handle)}`);
    },

    // sync(handle: string) {
    //   return request<{ synced: number; deactivated: number; status: string }>("POST", `/portfolio/aa/consent/${encodeURIComponent(handle)}/sync`);
    // },
    async sync(handle: string) {
      if (USE_PORTFOLIO_MOCK) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("mock_has_synced", "true");
        }
        return {
          synced: 2,
          deactivated: 0,
          status: "CONSUMED",
        };
      }
      return request<{ synced: number; deactivated: number; status: string }>("POST", `/portfolio/aa/consent/${encodeURIComponent(handle)}/sync`);
    },

    // removeLoan(id: string) { return request<{ id: string; removed: boolean }>("DELETE", `/portfolio/loans/${encodeURIComponent(id)}`); },
    async removeLoan(id: string) {
      if (USE_PORTFOLIO_MOCK) {
        if (typeof window !== "undefined") {
          const removedLoans = JSON.parse(window.localStorage.getItem("mock_removed_loans") || "[]");
          removedLoans.push(id);
          window.localStorage.setItem("mock_removed_loans", JSON.stringify(removedLoans));
        }
        return { id, removed: true };
      }
      return request<{ id: string; removed: boolean }>("DELETE", `/portfolio/loans/${encodeURIComponent(id)}`);
    },

    // applyBalanceTransfer(
    //   loanId: string,
    //   input: {
    //     targetLender?: string;
    //     targetRatePct?: number;
    //     expectedMonthlySaving?: number;
    //     expectedLifetimeSaving?: number;
    //     productId?: string;
    //   } = {},
    // ) {
    //   return request<{ application: any; sourceLoanId: string; message: string }>(
    //     "POST",
    //     `/portfolio/loans/${encodeURIComponent(loanId)}/balance-transfer`,
    //     input,
    //   );
    // },
    async applyBalanceTransfer(
      loanId: string,
      input: {
        targetLender?: string;
        targetRatePct?: number;
        expectedMonthlySaving?: number;
        expectedLifetimeSaving?: number;
        productId?: string;
      } = {},
    ) {
      if (USE_PORTFOLIO_MOCK) {
        return {
          application: {
            id: "app_mock_bt_" + Math.random().toString(36).substr(2, 9),
            referenceNo: "BT-MOCK-" + Math.floor(100000 + Math.random() * 900000),
          },
          sourceLoanId: loanId,
          message: "Balance transfer application created. Track progress in your dashboard.",
        };
      }
      return request<{ application: any; sourceLoanId: string; message: string }>(
        "POST",
        `/portfolio/loans/${encodeURIComponent(loanId)}/balance-transfer`,
        input,
      );
    },
  },

  partnerOnboarding: {
    start(input: { email: string; mobile: string; contactPerson: string }) {
      return request<{ onboardingToken: string; expiresInSec: number }>(
        "POST",
        "/partner-onboarding/start",
        input,
        { auth: false }
      );
    },
    requestOtp(input: { channel: "mobile" | "email"; destination: string; onboardingToken: string }) {
      return request<{ channel: string; destination: string; expiresInSec: number; devOtp?: string }>(
        "POST",
        "/partner-onboarding/otp/request",
        input,
        { auth: false }
      );
    },
    verifyOtp(input: { channel: "mobile" | "email"; destination: string; code: string; onboardingToken: string }) {
      return request<{ onboardingToken: string; mobileVerified: boolean; emailVerified: boolean; bothVerified: boolean }>(
        "POST",
        "/partner-onboarding/otp/verify",
        input,
        { auth: false }
      );
    },
    presignKyc(input: {
      onboardingToken: string;
      tag: string;
      fileName: string;
      mimeType?: string;
      sizeBytes?: number;
    }) {
      return request<{
        storageKey: string;
        uploadUrl: string;
        method: "PUT";
        headers: Record<string, string>;
        docId: string;
      }>("POST", "/partner-onboarding/presign-kyc", input, { auth: false });
    },
    async finalize(input: {
      onboardingToken: string;
      businessName: string;
      businessType?: string;
      gstNumber?: string;
      panNumber?: string;
      city?: string;
      state?: string;
      pincode?: string;
      address?: string;
      password?: string;
      bankName?: string;
      accountHolder?: string;
      accountNumber?: string;
      ifsc?: string;
      kycDocuments?: Array<{ tag: string; fileName: string; mimeType?: string; sizeBytes?: number; documentId?: string; storageKey?: string }>;
    }) {
      const res = await request<any>("POST", "/partner-onboarding/finalize", input, { auth: false });
      credupeTokens.set(res.accessToken, res.refreshToken);
      return res;
    },
  },

  partner: {
    me() { return request<any>("GET", "/partners/me"); },
    update(patch: Record<string, any>) { return request<any>("PATCH", "/partners/me", patch); },
    home() { return request<any>("GET", "/partner-dashboard/home"); },
    earnings() { return request<any>("GET", "/partner-dashboard/earnings"); },
    documents() { return request<any[]>("GET", "/partner-dashboard/documents"); },
    leaderboard(metric: "disbursed" | "leads" | "commission" = "disbursed", limit = 25) {
      return request<any>("GET", `/partner-dashboard/leaderboard?metric=${metric}&limit=${limit}`);
    },
  },

  uiConfig: {
    get() { return request<any>("GET", "/ui-config", undefined, { auth: false }); },
    patch(key: string, value: boolean) { return request<any>("PATCH", "/ui-config", { key, value }); },
  },

  partnerPublic: {
    getBusinessName(code: string) {
      return request<{ businessName: string }>("GET", `/partners/public/${code}`, undefined, { auth: false });
    },
  },

  health() { return request<any>("GET", "/health", undefined, { auth: false }); },
};

export type CredupeApi = typeof credupeApi;
export default credupeApi;
