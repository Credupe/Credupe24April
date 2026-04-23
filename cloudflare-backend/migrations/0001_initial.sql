-- Credupe D1 initial schema (SQLite)
-- Generated to match src/db/schema.ts. Apply with:
--   wrangler d1 migrations apply credupe --remote

PRAGMA foreign_keys = ON;

-- ─── users ──────────────────────────────────────────────────────────────
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER','PARTNER','ADMIN')),
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by TEXT,
  updated_by TEXT
);
CREATE INDEX idx_users_role_active ON users(role, is_active);

CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  user_agent TEXT,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE otp_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  destination TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_otp_dest_purpose ON otp_codes(destination, purpose);

-- ─── profiles ───────────────────────────────────────────────────────────
CREATE TABLE customer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT, last_name TEXT, dob TEXT, gender TEXT,
  city TEXT, state TEXT, pincode TEXT,
  pan_last4 TEXT, aadhaar_last4 TEXT,
  employment_type TEXT CHECK (employment_type IN ('SALARIED','SELF_EMPLOYED','BUSINESS','FREELANCER','UNEMPLOYED','STUDENT')),
  monthly_income_paise INTEGER,
  employer_name TEXT,
  cibil_range TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);

CREATE TABLE partner_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_person TEXT, city TEXT, state TEXT, pincode TEXT,
  gst_number TEXT, pan_last4 TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING','VERIFIED','REJECTED')),
  parent_partner_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);

-- ─── lenders & products ────────────────────────────────────────────────
CREATE TABLE lenders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  integration_mode TEXT NOT NULL DEFAULT 'mock',
  webhook_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);

CREATE TABLE loan_products (
  id TEXT PRIMARY KEY,
  lender_id TEXT NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('PERSONAL_LOAN','HOME_LOAN','LOAN_AGAINST_PROPERTY','BUSINESS_LOAN','CAR_LOAN','USED_CAR_LOAN','TWO_WHEELER_LOAN','EDUCATION_LOAN','GOLD_LOAN','MICRO_LOAN','CREDIT_CARD')),
  version INTEGER NOT NULL DEFAULT 1,
  min_amount_paise INTEGER NOT NULL,
  max_amount_paise INTEGER NOT NULL,
  min_tenure_months INTEGER NOT NULL,
  max_tenure_months INTEGER NOT NULL,
  min_interest_rate_bps INTEGER NOT NULL,
  max_interest_rate_bps INTEGER NOT NULL,
  processing_fee_bps INTEGER,
  min_monthly_income_paise INTEGER,
  min_cibil_score INTEGER,
  allowed_cities_json TEXT NOT NULL DEFAULT '[]',
  allowed_states_json TEXT NOT NULL DEFAULT '[]',
  commission_bps INTEGER,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
CREATE INDEX idx_products_type_active ON loan_products(loan_type, active);

-- ─── applications ──────────────────────────────────────────────────────
CREATE TABLE loan_applications (
  id TEXT PRIMARY KEY,
  reference_no TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES loan_products(id) ON DELETE SET NULL,
  lender_id TEXT REFERENCES lenders(id) ON DELETE SET NULL,
  loan_type TEXT NOT NULL,
  amount_requested_paise INTEGER NOT NULL,
  tenure_months INTEGER NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'LEAD' CHECK (status IN ('LEAD','LOGIN','DOC_PENDING','UNDER_REVIEW','APPROVED','REJECTED','DISBURSED','CANCELLED')),
  form_data_json TEXT,
  rejection_reason TEXT,
  approved_amount_paise INTEGER,
  approved_tenure INTEGER,
  approved_rate_bps INTEGER,
  disbursed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
CREATE INDEX idx_apps_user_status ON loan_applications(user_id, status);
CREATE INDEX idx_apps_status ON loan_applications(status);

CREATE TABLE application_status_history (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  changed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ash_app ON application_status_history(application_id);

-- ─── leads ─────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
  created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_email TEXT,
  loan_type TEXT NOT NULL,
  amount_requested_paise INTEGER,
  product_id TEXT REFERENCES loan_products(id) ON DELETE SET NULL,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','QUALIFIED','APPLICATION_CREATED','DROPPED','CONVERTED')),
  notes TEXT,
  application_id TEXT UNIQUE REFERENCES loan_applications(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
CREATE INDEX idx_leads_partner_status ON leads(partner_id, status);

CREATE TABLE lead_follow_ups (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  scheduled_at TEXT NOT NULL,
  note TEXT,
  done_at TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_lfu_lead ON lead_follow_ups(lead_id);

-- ─── commissions ───────────────────────────────────────────────────────
CREATE TABLE commissions (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
  lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES loan_products(id) ON DELETE SET NULL,
  amount_paise INTEGER NOT NULL,
  payout_bps INTEGER,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','PAID','REVERSED')),
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_commissions_partner_status ON commissions(partner_id, status);

-- ─── documents ─────────────────────────────────────────────────────────
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  application_id TEXT REFERENCES loan_applications(id) ON DELETE CASCADE,
  tag TEXT NOT NULL DEFAULT 'OTHER' CHECK (tag IN ('KYC','INCOME','PROPERTY','BANK_STATEMENT','OTHER')),
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  storage_key TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'UPLOADED' CHECK (status IN ('UPLOADED','VERIFIED','REJECTED')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
CREATE INDEX idx_docs_owner ON documents(owner_user_id);
CREATE INDEX idx_docs_app ON documents(application_id);

-- ─── notifications ─────────────────────────────────────────────────────
CREATE TABLE notification_templates (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  channel TEXT NOT NULL CHECK (channel IN ('IN_APP','EMAIL','SMS')),
  subject TEXT,
  body TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('IN_APP','EMAIL','SMS')),
  template_code TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENT','FAILED','READ')),
  read_at TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifs_user_status ON notifications(user_id, status);

-- ─── audit ─────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);

-- ─── quotes ────────────────────────────────────────────────────────────
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  loan_type TEXT NOT NULL,
  amount_paise INTEGER NOT NULL,
  tenure_months INTEGER NOT NULL,
  monthly_income_paise INTEGER,
  cibil_score INTEGER,
  city TEXT,
  state TEXT,
  offers_json TEXT NOT NULL DEFAULT '[]',
  share_slug TEXT UNIQUE,
  share_expires_at TEXT,
  full_name TEXT,
  mobile TEXT,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_quotes_slug ON quotes(share_slug);
