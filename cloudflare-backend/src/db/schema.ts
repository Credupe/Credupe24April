/**
 * Credupe D1 schema (Drizzle / SQLite dialect).
 * ---------------------------------------------------------------------------
 * Mirrors the original Postgres Prisma schema. Postgres enums are modelled as
 * SQLite CHECK constraints; JSON columns use `text` + JSON.stringify/parse
 * (D1 transparently supports JSON via text). Decimals are stored as INTEGER
 * paise (×100) to avoid floating-point drift.
 */
import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* ────────────────── shared enum lists (used in CHECK constraints) ──────── */
export const ROLES = ["CUSTOMER", "PARTNER", "ADMIN"] as const;
export const KYC_STATUSES = ["PENDING", "VERIFIED", "REJECTED"] as const;
export const EMPLOYMENT_TYPES = [
  "SALARIED", "SELF_EMPLOYED", "BUSINESS", "FREELANCER", "UNEMPLOYED", "STUDENT",
] as const;
export const LOAN_TYPES = [
  "PERSONAL_LOAN", "HOME_LOAN", "LOAN_AGAINST_PROPERTY", "BUSINESS_LOAN",
  "CAR_LOAN", "USED_CAR_LOAN", "TWO_WHEELER_LOAN", "EDUCATION_LOAN",
  "GOLD_LOAN", "MICRO_LOAN", "CREDIT_CARD",
] as const;
export const APPLICATION_STATUSES = [
  "LEAD", "LOGIN", "DOC_PENDING", "UNDER_REVIEW",
  "APPROVED", "REJECTED", "DISBURSED", "CANCELLED",
] as const;
export const LEAD_STATUSES = [
  "NEW", "CONTACTED", "QUALIFIED", "APPLICATION_CREATED", "DROPPED", "CONVERTED",
] as const;
export const COMMISSION_STATUSES = ["PENDING", "APPROVED", "PAID", "REVERSED"] as const;
export const DOCUMENT_TAGS = ["KYC", "INCOME", "PROPERTY", "BANK_STATEMENT", "OTHER"] as const;
export const DOCUMENT_STATUSES = ["UPLOADED", "VERIFIED", "REJECTED"] as const;
export const NOTIFICATION_CHANNELS = ["IN_APP", "EMAIL", "SMS"] as const;
export const NOTIFICATION_STATUSES = ["PENDING", "SENT", "FAILED", "READ"] as const;

/* ─────────────────────────── Users & Auth ─────────────────────────────── */
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    mobile: text("mobile").unique(),
    passwordHash: text("password_hash"),
    role: text("role", { enum: ROLES }).notNull().default("CUSTOMER"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    lastLoginAt: text("last_login_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (t) => ({
    roleActiveIdx: index("idx_users_role_active").on(t.role, t.isActive),
  }),
);

export const refreshTokens = sqliteTable(
  "refresh_tokens",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"),
    userAgent: text("user_agent"),
    ip: text("ip"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ userIdx: index("idx_refresh_tokens_user").on(t.userId) }),
);

export const otpCodes = sqliteTable(
  "otp_codes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    channel: text("channel").notNull(),           // "mobile" | "email"
    destination: text("destination").notNull(),
    codeHash: text("code_hash").notNull(),
    purpose: text("purpose").notNull(),           // "login" | "verify" | "reset"
    expiresAt: text("expires_at").notNull(),
    consumedAt: text("consumed_at"),
    attempts: integer("attempts").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ destIdx: index("idx_otp_dest_purpose").on(t.destination, t.purpose) }),
);

/* ─────────────────────────── Customer profile ─────────────────────────── */
export const customerProfiles = sqliteTable("customer_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dob: text("dob"),
  gender: text("gender"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  panLast4: text("pan_last4"),
  aadhaarLast4: text("aadhaar_last4"),
  employmentType: text("employment_type", { enum: EMPLOYMENT_TYPES }),
  monthlyIncomePaise: integer("monthly_income_paise"),
  employerName: text("employer_name"),
  cibilRange: text("cibil_range"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

/* ─────────────────────────── Partner profile ──────────────────────────── */
export const partnerProfiles = sqliteTable("partner_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  gstNumber: text("gst_number"),
  panLast4: text("pan_last4"),
  kycStatus: text("kyc_status", { enum: KYC_STATUSES }).notNull().default("PENDING"),
  parentPartnerId: text("parent_partner_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

/* ─────────────────────────── Lenders & Products ───────────────────────── */
export const lenders = sqliteTable("lenders", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  integrationMode: text("integration_mode").notNull().default("mock"),
  webhookUrl: text("webhook_url"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

export const loanProducts = sqliteTable(
  "loan_products",
  {
    id: text("id").primaryKey(),
    lenderId: text("lender_id").notNull().references(() => lenders.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    loanType: text("loan_type", { enum: LOAN_TYPES }).notNull(),
    version: integer("version").notNull().default(1),
    minAmountPaise: integer("min_amount_paise").notNull(),
    maxAmountPaise: integer("max_amount_paise").notNull(),
    minTenureMonths: integer("min_tenure_months").notNull(),
    maxTenureMonths: integer("max_tenure_months").notNull(),
    minInterestRateBps: integer("min_interest_rate_bps").notNull(),  // basis points ×100 → 10.50% = 1050
    maxInterestRateBps: integer("max_interest_rate_bps").notNull(),
    processingFeeBps: integer("processing_fee_bps"),
    minMonthlyIncomePaise: integer("min_monthly_income_paise"),
    minCibilScore: integer("min_cibil_score"),
    allowedCitiesJson: text("allowed_cities_json").notNull().default("[]"),   // JSON array
    allowedStatesJson: text("allowed_states_json").notNull().default("[]"),
    commissionBps: integer("commission_bps"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (t) => ({ typeActiveIdx: index("idx_products_type_active").on(t.loanType, t.active) }),
);

/* ─────────────────────────── Loan Applications ────────────────────────── */
export const loanApplications = sqliteTable(
  "loan_applications",
  {
    id: text("id").primaryKey(),
    referenceNo: text("reference_no").notNull().unique(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => loanProducts.id, { onDelete: "set null" }),
    lenderId: text("lender_id").references(() => lenders.id, { onDelete: "set null" }),
    loanType: text("loan_type", { enum: LOAN_TYPES }).notNull(),
    amountRequestedPaise: integer("amount_requested_paise").notNull(),
    tenureMonths: integer("tenure_months").notNull(),
    purpose: text("purpose"),
    status: text("status", { enum: APPLICATION_STATUSES }).notNull().default("LEAD"),
    formDataJson: text("form_data_json"),                               // JSON
    rejectionReason: text("rejection_reason"),
    approvedAmountPaise: integer("approved_amount_paise"),
    approvedTenure: integer("approved_tenure"),
    approvedRateBps: integer("approved_rate_bps"),
    disbursedAt: text("disbursed_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (t) => ({
    userStatusIdx: index("idx_apps_user_status").on(t.userId, t.status),
    statusIdx: index("idx_apps_status").on(t.status),
  }),
);

export const applicationStatusHistory = sqliteTable(
  "application_status_history",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    fromStatus: text("from_status", { enum: APPLICATION_STATUSES }),
    toStatus: text("to_status", { enum: APPLICATION_STATUSES }).notNull(),
    note: text("note"),
    changedBy: text("changed_by"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ appIdx: index("idx_ash_app").on(t.applicationId) }),
);

/* ─────────────────────────── Leads (B2B) ──────────────────────────────── */
export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull().references(() => partnerProfiles.id, { onDelete: "cascade" }),
    createdById: text("created_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    customerName: text("customer_name").notNull(),
    customerMobile: text("customer_mobile").notNull(),
    customerEmail: text("customer_email"),
    loanType: text("loan_type", { enum: LOAN_TYPES }).notNull(),
    amountRequestedPaise: integer("amount_requested_paise"),
    productId: text("product_id").references(() => loanProducts.id, { onDelete: "set null" }),
    city: text("city"),
    status: text("status", { enum: LEAD_STATUSES }).notNull().default("NEW"),
    notes: text("notes"),
    applicationId: text("application_id").unique().references(() => loanApplications.id, { onDelete: "set null" }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (t) => ({ partnerStatusIdx: index("idx_leads_partner_status").on(t.partnerId, t.status) }),
);

export const leadFollowUps = sqliteTable(
  "lead_follow_ups",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    scheduledAt: text("scheduled_at").notNull(),
    note: text("note"),
    doneAt: text("done_at"),
    createdBy: text("created_by"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ leadIdx: index("idx_lfu_lead").on(t.leadId) }),
);

/* ─────────────────────────── Commissions ──────────────────────────────── */
export const commissions = sqliteTable(
  "commissions",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull().references(() => partnerProfiles.id, { onDelete: "cascade" }),
    leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
    productId: text("product_id").references(() => loanProducts.id, { onDelete: "set null" }),
    amountPaise: integer("amount_paise").notNull(),
    payoutBps: integer("payout_bps"),
    status: text("status", { enum: COMMISSION_STATUSES }).notNull().default("PENDING"),
    paidAt: text("paid_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ partnerStatusIdx: index("idx_commissions_partner_status").on(t.partnerId, t.status) }),
);

/* ─────────────────────────── Documents ────────────────────────────────── */
export const documents = sqliteTable(
  "documents",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").notNull(),
    applicationId: text("application_id").references(() => loanApplications.id, { onDelete: "cascade" }),
    tag: text("tag", { enum: DOCUMENT_TAGS }).notNull().default("OTHER"),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    storageKey: text("storage_key").notNull(),
    version: integer("version").notNull().default(1),
    status: text("status", { enum: DOCUMENT_STATUSES }).notNull().default("UPLOADED"),
    rejectionReason: text("rejection_reason"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (t) => ({
    ownerIdx: index("idx_docs_owner").on(t.ownerUserId),
    appIdx: index("idx_docs_app").on(t.applicationId),
  }),
);

/* ─────────────────────────── Notifications ────────────────────────────── */
export const notificationTemplates = sqliteTable("notification_templates", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  channel: text("channel", { enum: NOTIFICATION_CHANNELS }).notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    channel: text("channel", { enum: NOTIFICATION_CHANNELS }).notNull(),
    templateCode: text("template_code"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    status: text("status", { enum: NOTIFICATION_STATUSES }).notNull().default("PENDING"),
    readAt: text("read_at"),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ userStatusIdx: index("idx_notifs_user_status").on(t.userId, t.status) }),
);

/* ─────────────────────────── Audit log ────────────────────────────────── */
export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadataJson: text("metadata_json"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    entityIdx: index("idx_audit_entity").on(t.entityType, t.entityId),
    actorIdx: index("idx_audit_actor").on(t.actorId),
  }),
);

/* ─────────────────────────── Quotes (shareable) ───────────────────────── */
export const quotes = sqliteTable(
  "quotes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    loanType: text("loan_type", { enum: LOAN_TYPES }).notNull(),
    amountPaise: integer("amount_paise").notNull(),
    tenureMonths: integer("tenure_months").notNull(),
    monthlyIncomePaise: integer("monthly_income_paise"),
    cibilScore: integer("cibil_score"),
    city: text("city"),
    state: text("state"),
    offersJson: text("offers_json").notNull().default("[]"),
    shareSlug: text("share_slug").unique(),
    shareExpiresAt: text("share_expires_at"),
    fullName: text("full_name"),
    mobile: text("mobile"),
    email: text("email"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ slugIdx: uniqueIndex("idx_quotes_slug").on(t.shareSlug) }),
);
