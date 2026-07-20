import AsyncStorage from "@react-native-async-storage/async-storage";

const RAW_BASE = process.env.EXPO_PUBLIC_BACKEND_URL ?? "";
const BASE = RAW_BASE.trim().replace(/\/+$/, "");
const API = `${BASE}/api/v1`;
const REQUEST_TIMEOUT_MS = 15000;

console.log("BASE =", BASE);
console.log("API =", API);

const ACCESS_KEY = "credupe.access";
const REFRESH_KEY = "credupe.refresh";
const USER_KEY = "credupe.user";

export interface ApiUser {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "PARTNER";
  fullName?: string;
}

export interface Envelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; status: number; message: string[] } | null;
}

export function getApiConfig() {
  return { base: BASE, api: API, timeoutMs: REQUEST_TIMEOUT_MS };
}

async function readTokens(): Promise<{ access?: string; refresh?: string }> {
  const [a, r] = await Promise.all([
    AsyncStorage.getItem(ACCESS_KEY),
    AsyncStorage.getItem(REFRESH_KEY),
  ]);
  return { access: a ?? undefined, refresh: r ?? undefined };
}

async function writeTokens(access?: string, refresh?: string) {
  if (access) await AsyncStorage.setItem(ACCESS_KEY, access);
  if (refresh) await AsyncStorage.setItem(REFRESH_KEY, refresh);
}

export async function clearSession() {
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_KEY),
    AsyncStorage.removeItem(REFRESH_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}

async function rawFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<Envelope<T>> {
  const { access } = init.skipAuth ? { access: undefined } : await readTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (access) headers["Authorization"] = `Bearer ${access}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let resp: Response;
  try {
    resp = await fetch(`${API}${path}`, { ...init, headers, signal: controller.signal });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network request failed";
    return {
      success: false,
      data: null,
      error: {
        code: "NETWORK",
        status: 0,
        message: [
          `Cannot reach backend: ${BASE || "(empty EXPO_PUBLIC_BACKEND_URL)"}`,
          "For Android, localhost does not point to your computer.",
          `Original error: ${msg}`,
        ],
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
  const text = await resp.text();
  let json: Envelope<T>;
  try {
    json = text ? JSON.parse(text) : ({ success: false, data: null, error: { code: "EMPTY", status: resp.status, message: ["empty response"] } } as Envelope<T>);
  } catch {
    json = { success: false, data: null, error: { code: "NON_JSON", status: resp.status, message: [text.slice(0, 200)] } };
  }
  return json;
}

async function refresh(): Promise<boolean> {
  const { refresh } = await readTokens();
  if (!refresh) return false;
  const r = await rawFetch<{ accessToken: string; refreshToken: string }>(
    "/auth/refresh",
    { method: "POST", body: JSON.stringify({ refreshToken: refresh }), skipAuth: true },
  );
  if (r.success && r.data) {
    await writeTokens(r.data.accessToken, r.data.refreshToken);
    return true;
  }
  return false;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<Envelope<T>> {
  const first = await rawFetch<T>(path, init);
  if (first.success || init.skipAuth) return first;
  if (first.error?.status === 401) {
    const ok = await refresh();
    if (ok) return rawFetch<T>(path, init);
    await clearSession();
  }
  return first;
}

/* ─── Auth helpers ─────────────────────────────────────────────────────── */

export async function loginEmail(email: string, password: string) {
  const r = await rawFetch<{ accessToken: string; refreshToken: string; user: ApiUser }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true },
  );
  if (r.success && r.data) {
    await writeTokens(r.data.accessToken, r.data.refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(r.data.user));
  }
  return r;
}

export async function requestOtp(destination: string) {
  return rawFetch<{ destination: string; expiresInSec: number; devOtp?: string }>(
    "/auth/otp/request",
    { method: "POST", body: JSON.stringify({ destination }), skipAuth: true },
  );
}

export async function verifyOtp(destination: string, otp: string) {
  const r = await rawFetch<{ accessToken: string; refreshToken: string; user: ApiUser }>(
    "/auth/otp/verify",
    { method: "POST", body: JSON.stringify({ destination, otp }), skipAuth: true },
  );
  if (r.success && r.data) {
    await writeTokens(r.data.accessToken, r.data.refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(r.data.user));
  }
  return r;
}

export async function fetchMe() {
  return apiFetch<ApiUser>("/auth/me");
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    await clearSession();
  }
}

export async function getCachedUser(): Promise<ApiUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as ApiUser) : null;
}

/* ─── Domain endpoints ─────────────────────────────────────────────────── */

export interface LoanProduct {
  id: string;
  lender?: { id: string; name: string; slug: string; logoUrl?: string | null } | null;
  /** Legacy alias kept for backward compatibility with older mobile screens. */
  lenderId?: string;
  lenderName?: string;
  name: string;
  slug?: string;
  loanType: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  minInterestRate: number;
  maxInterestRate: number;
  /** Old alias the original LoansScreen renders. Filled below from `minInterestRate`. */
  baseRatePct?: number;
  processingFeePct?: number | null;
  minMonthlyIncome?: number | null;
  minCibilScore?: number | null;
  active?: boolean;
}

export async function fetchLoanProducts(params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  const r = await apiFetch<{ items: LoanProduct[]; total: number }>(
    `/loan-products${qs ? `?${qs}` : ""}`,
  );
  // Back-fill the convenience fields the existing screens rely on.
  if (r.success && r.data?.items) {
    r.data.items = r.data.items.map((p) => ({
      ...p,
      lenderId: p.lender?.id ?? p.lenderId,
      lenderName: p.lender?.name ?? p.lenderName,
      baseRatePct: p.minInterestRate,
    }));
  }
  return r;
}

export async function createLoanProduct(input: {
  lenderId: string;
  name: string;
  slug?: string;
  loanType: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  minInterestRate: number;
  maxInterestRate: number;
  processingFeePct?: number;
  minMonthlyIncome?: number;
  minCibilScore?: number;
  commissionPct?: number;
  active?: boolean;
}) {
  return apiFetch<{ id: string; slug: string }>("/loan-products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateLoanProduct(id: string, patch: Partial<LoanProduct> & { commissionPct?: number }) {
  return apiFetch<{ id: string; updated: boolean; version: number }>(`/loan-products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteLoanProduct(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/loan-products/${id}`, {
    method: "DELETE",
  });
}

export interface LoanApplication {
  id: string;
  referenceNo: string;
  loanType: string;
  amount: number;
  status: string;
  createdAt: string;
}

export async function fetchMyApplications() {
  return apiFetch<{ items: LoanApplication[] }>("/loan-applications/mine");
}

/* ─── Quotes ──────────────────────────────────────────────────────────── */

export interface QuoteOffer {
  productId: string;
  lender: { id: string; name: string; slug: string; logoUrl?: string | null } | null;
  productName: string;
  loanType: string;
  minRate: number;
  maxRate: number;
  processingFeePct: number | null;
  estEmi: number;
  tenureMonths: number;
  amount: number;
}

export interface Quote {
  id: string;
  loanType: string;
  amount: number;
  tenureMonths: number;
  count?: number;
  offers: QuoteOffer[];
  createdAt?: string;
}

export interface QuoteInput {
  loanType: string;
  amount: number;
  tenureMonths: number;
  monthlyIncome?: number;
  cibilScore?: number;
  city?: string;
  state?: string;
  fullName?: string;
  mobile?: string;
  email?: string;
}

export async function createQuote(input: QuoteInput) {
  return apiFetch<Quote>("/quotes", { method: "POST", body: JSON.stringify(input) });
}

export async function fetchQuote(id: string) {
  return apiFetch<Quote>(`/quotes/${id}`);
}

export async function shareQuote(id: string) {
  return apiFetch<{ slug: string; url: string; expiresAt: string }>(
    `/quotes/${id}/share`,
    { method: "POST" },
  );
}

export async function fetchSharedQuote(slug: string) {
  return apiFetch<Omit<Quote, "id">>(`/quotes/s/${slug}`, { skipAuth: true });
}

export async function applyFromQuote(quoteId: string, offer: QuoteOffer) {
  return apiFetch<{ id: string; referenceNo: string }>(
    `/loan-applications`,
    {
      method: "POST",
      body: JSON.stringify({
        loanType: offer.loanType,
        amount: offer.amount,
        tenureMonths: offer.tenureMonths,
        productId: offer.productId,
        quoteId,
      }),
    },
  );
}

/* ─── EMI helper (pure client-side) ───────────────────────────────────── */
export function calcEmi(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/* ─── Customer profile (KYC) ──────────────────────────────────────────── */

export interface CustomerProfile {
  firstName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  gender?: "M" | "F" | "O" | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  panLast4?: string | null;
  aadhaarLast4?: string | null;
  employmentType?: string | null;
  employerName?: string | null;
  cibilRange?: string | null;
  monthlyIncome?: number | null;
  kycStatus?: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED" | null;
}

export async function fetchMyProfile() {
  return apiFetch<{ profile: CustomerProfile | null }>("/customers/me");
}

export async function patchMyProfile(patch: Partial<CustomerProfile>) {
  return apiFetch<{ updated: boolean }>("/customers/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/* ─── Partner profile (KYC) ────────────────────────────────────────────── */

export interface PartnerProfile {
  id: string;
  userId: string;
  partnerCode: string;
  businessName: string;
  contactPerson?: string | null;
  email?: string | null;
  mobile?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
  panLast4?: string | null;
  aadhaarLast4?: string | null;
  bankAccount?: string | null;
  tier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  onboardingStep?: string;
  kycStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  dob?: string | null;
  gender?: "Male" | "Female" | "Other" | null;
}

export async function fetchPartnerProfile() {
  return apiFetch<{ profile: PartnerProfile | null }>("/partners/me");
}

export async function patchPartnerProfile(patch: Partial<PartnerProfile>) {
  return apiFetch<{ updated: boolean }>("/partners/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/* ─── Documents ───────────────────────────────────────────────────────── */

export type DocumentTag = "KYC" | "INCOME" | "PROPERTY" | "BANK_STATEMENT" | "OTHER";

export interface MyDocument {
  id: string;
  tag: DocumentTag;
  fileName: string;
  documentName?: string;
  mimeType: string | null;
  status: "UPLOADED" | "VERIFIED" | "REJECTED" | "PENDING";
  rejectionReason?: string | null;
  createdAt?: string;
}

export interface PresignedUpload {
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
  storageKey: string;
  expiresIn: number;
  docId: string;
  mocked: boolean;
}

export async function presignDocument(params: {
  fileName: string;
  mimeType?: string;
  sizeBytes?: number;
  tag?: DocumentTag;
  applicationId?: string;
}) {
  return apiFetch<PresignedUpload>("/documents/presign", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function registerDocument(params: {
  docId: string;
  fileName: string;
  documentName?: string;
  mimeType?: string;
  sizeBytes?: number;
  storageKey: string;
  tag?: DocumentTag;
  applicationId?: string;
}) {
  return apiFetch<{ id: string }>("/documents/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function fetchMyDocuments() {
  return apiFetch<{ items: MyDocument[]; total: number }>("/documents/mine");
}

export async function uploadDocument(
  blob: Blob,
  fileName: string,
  tag: DocumentTag = "KYC",
  applicationId?: string,
  documentName?: string,
): Promise<{ ok: boolean; docId?: string; error?: string }> {
  const presign = await presignDocument({
    fileName,
    mimeType: blob.type || "application/octet-stream",
    sizeBytes: blob.size,
    tag,
    applicationId,
  });
  if (!presign.success || !presign.data) {
    return { ok: false, error: presign.error?.message?.join("\n") ?? "presign failed" };
  }
  const { uploadUrl, method, headers, storageKey, docId } = presign.data;
  // The presign uploadUrl is relative (`/api/v1/documents/_upload/...`) — prefix with BASE
  const fullUrl = uploadUrl.startsWith("http") ? uploadUrl : `${BASE}${uploadUrl}`;
  const access = (await AsyncStorage.getItem(ACCESS_KEY)) ?? undefined;
  const putResp = await fetch(fullUrl, {
    method,
    headers: {
      ...headers,
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body: blob,
  });
  if (!putResp.ok) return { ok: false, error: `upload ${putResp.status}` };

  const reg = await registerDocument({
    docId,
    fileName,
    documentName,
    mimeType: blob.type || undefined,
    sizeBytes: blob.size,
    storageKey,
    tag,
    applicationId,
  });
  if (!reg.success || !reg.data) {
    return { ok: false, error: reg.error?.message?.join("\n") ?? "register failed" };
  }
  return { ok: true, docId: reg.data.id };
}


/* ─── Partner cockpit ─────────────────────────────────────────────────── */

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "DROPPED",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string | null;
  loanType: string;
  amount: number | null;
  amountRequestedPaise: number | null;
  city: string | null;
  notes: string | null;
  status: LeadStatus;
  productId: string | null;
  createdAt: string;
}

export async function fetchLeads(status?: LeadStatus) {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<{ items: Lead[]; total: number }>(`/leads${qs}`);
}

export async function createLead(input: {
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  loanType: string;
  amount?: number;
  city?: string;
  notes?: string;
  productId?: string;
}) {
  return apiFetch<{ id: string; status: LeadStatus }>("/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchLead(id: string, patch: { status?: LeadStatus; notes?: string }) {
  return apiFetch<{ id: string; updated: boolean }>(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function scheduleLeadFollowUp(id: string, scheduledAt: string, note?: string) {
  return apiFetch<{ id: string }>(`/leads/${id}/follow-ups`, {
    method: "POST",
    body: JSON.stringify({ scheduledAt, note }),
  });
}

export interface BulkLeadItem {
  customerName: string;
  customerMobile: string;
  loanType: string;
  amount?: number;
  customerEmail?: string;
  city?: string;
  notes?: string;
}

export async function bulkCreateLeads(items: BulkLeadItem[]) {
  return apiFetch<{ created: number; ids: string[] }>(`/leads/bulk`, {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

/* ─── Brokerage / Commissions ─────────────────────────────────────────── */

export interface BrokerageSummary {
  totalPayout: number;
  pending: number;
  approved: number;
  paid: number;
  byStatus: Record<string, { count: number; amountPaise: number }>;
}

export interface CommissionItem {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "CANCELLED";
  payoutPct: number | null;
  paidAt: string | null;
  createdAt: string;
  lead: { id: string; customer_name: string; loan_type: string } | null;
  product: { name: string; loan_type: string } | null;
}

export async function fetchBrokerageSummary() {
  return apiFetch<BrokerageSummary>("/brokerage/summary");
}

export async function fetchCommissions() {
  return apiFetch<{ items: CommissionItem[] }>("/brokerage");
}

export async function fetchPartnerAnalytics() {
  return apiFetch<{ leads: { total: number; byStatus: Record<string, number> } }>(
    "/analytics/partner/summary",
  );
}


/* ─── Admin lite ──────────────────────────────────────────────────────── */

export const APPLICATION_STATUSES = [
  "LEAD",
  "LOGIN",
  "DOC_PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "DISBURSED",
  "REJECTED",
  "CANCELLED",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface AdminApplication {
  id: string;
  referenceNo: string;
  loanType: string;
  amount: number;
  status: ApplicationStatus;
  customerUserId: string;
  partnerId: string | null;
  productId: string | null;
  createdAt: string;
  disbursedAt: string | null;
}

export async function fetchAdminFunnel() {
  return apiFetch<{ total: number; byStatus: Record<string, number> }>(
    "/analytics/admin/funnel",
  );
}

export async function fetchAdminApplications(status?: ApplicationStatus) {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<{ items: AdminApplication[]; total: number }>(`/loan-applications${qs}`);
}

export async function transitionApplication(id: string, toStatus: ApplicationStatus, note?: string) {
  return apiFetch<{ id: string; status: ApplicationStatus }>(
    `/loan-applications/${id}/transition`,
    { method: "POST", body: JSON.stringify({ toStatus, note }) },
  );
}

export interface AdminDocument {
  id: string;
  ownerUserId: string;
  ownerName?: string;
  applicationId: string | null;
  tag: DocumentTag;
  fileName: string;
  documentName?: string;
  mimeType: string | null;
  storageKey: string;
  sizeBytes: number | null;
  status: "UPLOADED" | "VERIFIED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
}

export async function fetchAdminDocuments(params: { status?: string; tag?: DocumentTag } = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => !!v).map(([k, v]) => [k, String(v)]),
  ).toString();
  return apiFetch<{ items: AdminDocument[]; total: number }>(
    `/documents${qs ? `?${qs}` : ""}`,
  );
}



export function getDocumentViewUrl(id: string): string {
  return `${API}/documents/${id}/view`;
}

export async function getDocumentViewHeaders(): Promise<Record<string, string>> {
  const { access } = await readTokens();
  return {
    Authorization: access ? `Bearer ${access}` : "",
  };
}

export async function verifyDocument(id: string, status: "VERIFIED" | "REJECTED", rejectionReason?: string) {
  return apiFetch<{ id: string; status: string }>(`/documents/${id}/verify`, {
    method: "POST",
    body: JSON.stringify({ status, rejectionReason }),
  });
}

export interface AdminUser {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "PARTNER";
  fullName: string | null;
  phone: string | null;
  createdAt: string;
  isActive?: number | boolean;
}

export async function fetchAdminUsers() {
  return apiFetch<{ items: AdminUser[]; total: number }>("/users");
}

export interface Lender {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
  active?: boolean;
  integrationMode?: "mock" | "live";
  webhookUrl?: string | null;
  productCount?: number;
}

export async function fetchLenders() {
  return apiFetch<{ items: Lender[] }>("/lenders");
}

export async function createLender(input: {
  name: string;
  slug?: string;
  logoUrl?: string;
  active?: boolean;
  integrationMode?: "mock" | "live";
  webhookUrl?: string;
}) {
  return apiFetch<{ id: string; slug: string }>("/lenders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateLender(id: string, patch: Partial<Lender>) {
  return apiFetch<{ id: string; updated: boolean }>(`/lenders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/* ─── In-app notifications ────────────────────────────────────────────── */

export interface InAppNotification {
  id: string;
  userId: string;
  channel: string;
  category: string | null;
  title: string;
  body: string;
  status: "PENDING" | "SENT" | "READ";
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export async function fetchNotifications() {
  return apiFetch<{ items: InAppNotification[]; unread: number; total: number }>("/notifications");
}

export async function markNotificationRead(id: string) {
  return apiFetch<{ id: string; read: boolean }>(`/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsRead() {
  return apiFetch<{ read: boolean }>("/notifications/read-all", { method: "POST" });
}

/* ─── Partner onboarding ────────────────────────────────────────────────── */

export interface StartOnboardingResult {
  onboardingToken: string;
  expiresInSec: number;
}

export interface RequestOtpResult {
  channel: "mobile" | "email";
  destination: string;
  expiresInSec: number;
  devOtp?: string;
}

export interface VerifyOtpResult {
  onboardingToken: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  bothVerified: boolean;
}

export interface FinalizePartnerInput {
  onboardingToken: string;
  businessName: string;
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
}

export interface FinalizePartnerResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: ApiUser;
  partner: {
    id: string;
    partnerCode: string;
    businessName: string;
    onboardingStep: string;
    tier: string;
  };
  generatedPassword?: string;
}

export async function startPartnerOnboarding(email: string, mobile: string, contactPerson: string) {
  return rawFetch<StartOnboardingResult>("/partner-onboarding/start", {
    method: "POST",
    body: JSON.stringify({ email, mobile, contactPerson }),
    skipAuth: true,
  });
}

export async function requestPartnerOtp(onboardingToken: string, channel: "mobile" | "email", destination: string) {
  return rawFetch<RequestOtpResult>("/partner-onboarding/otp/request", {
    method: "POST",
    body: JSON.stringify({ onboardingToken, channel, destination }),
    skipAuth: true,
  });
}

export async function verifyPartnerOtp(onboardingToken: string, channel: "mobile" | "email", destination: string, code: string) {
  return rawFetch<VerifyOtpResult>("/partner-onboarding/otp/verify", {
    method: "POST",
    body: JSON.stringify({ onboardingToken, channel, destination, code }),
    skipAuth: true,
  });
}

export async function finalizePartnerOnboarding(input: FinalizePartnerInput) {
  const r = await rawFetch<FinalizePartnerResult>("/partner-onboarding/finalize", {
    method: "POST",
    body: JSON.stringify(input),
    skipAuth: true,
  });
  if (r.success && r.data) {
    await writeTokens(r.data.accessToken, r.data.refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(r.data.user));
  }
  return r;
}

/* ─── Forgot/Reset Password ─────────────────────────────────────────────── */

export interface ForgotPasswordResult {
  email: string;
  expiresInSec: number;
  devOtp?: string;
}

export async function forgotPassword(email: string) {
  return rawFetch<ForgotPasswordResult>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  return rawFetch<{ success: boolean }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
    skipAuth: true,
  });
}

export async function sendOtpDirect(phone: string) {
  return rawFetch<{ destination: string; expiresInSec: number; devOtp?: string }>(
    "/auth/send-otp",
    {
      method: "POST",
      body: JSON.stringify({ phone }),
      skipAuth: true,
    }
  );
}



