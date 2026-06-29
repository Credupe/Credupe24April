-- Credupe D1 seed data. Run with:
--   npm run seed:remote     (or seed:local for the wrangler-dev shadow DB)
-- Idempotent: re-running just UPSERTs.

-- ─── Admin / Customer / Partner users ──────────────────────────────────
-- bcryptjs($2a$10$) hashes for the three demo passwords below (verified with bcrypt.compareSync):
--   Admin@12345       → $2a$10$FKCCmHhwRRnLsxHTG3hFxu/HJdZtoIpP6lUoCXp7HW2zVMi7voJSe
--   Customer@123      → $2a$10$BL0m0E1690W.TDfbgWLoIe026mvMZtH046pdbJXmeAV6UOVkq18VS
--   Partner@123       → $2a$10$DFK0lJU8P/hxNRGJNzwXu.laytf/lHmv.Zh5BdtQgA/dFJ.YUt2la
INSERT OR REPLACE INTO users (id, email, role, password_hash)
VALUES
  ('u_admin',    'admin@credupe.local',    'ADMIN',    '$2a$10$FKCCmHhwRRnLsxHTG3hFxu/HJdZtoIpP6lUoCXp7HW2zVMi7voJSe'),
  ('u_customer', 'customer@credupe.local', 'CUSTOMER', '$2a$10$BL0m0E1690W.TDfbgWLoIe026mvMZtH046pdbJXmeAV6UOVkq18VS'),
  ('u_partner',  'partner@credupe.local',  'PARTNER',  '$2a$10$DFK0lJU8P/hxNRGJNzwXu.laytf/lHmv.Zh5BdtQgA/dFJ.YUt2la');

INSERT OR REPLACE INTO customer_profiles (id, user_id, first_name, last_name, city)
VALUES ('cp_demo', 'u_customer', 'Demo', 'Customer', 'Mumbai');

INSERT OR REPLACE INTO partner_profiles (
  id, user_id, partner_code, business_name, contact_person, email, mobile,
  city, state, pincode, address, gst_number, pan_number, pan_last4, aadhaar_last4,
  bank_account_json, tier, onboarding_step, kyc_status, mobile_verified_at, email_verified_at, agreement_signed_at, activated_at
)
VALUES (
  'pp_demo', 
  'u_partner', 
  'CRD-PA00001', 
  'Demo Partner LLP', 
  'Demo Partner', 
  'partner@credupe.local', 
  '9876543210',
  'Mumbai', 
  'Maharashtra', 
  '400001', 
  '123 Business Hub, BKC', 
  '27AAAAA1111A1Z1', 
  'ABCDE1234F', 
  '1234', 
  '5678',
  '{"bankName":"HDFC Bank Ltd","accountHolder":"Demo Partner LLP","accountNumber":"50200012345678","ifsc":"HDFC0000123"}', 
  'GOLD', 
  'COMPLETE', 
  'VERIFIED', 
  '2026-06-20T10:00:00Z', 
  '2026-06-20T10:05:00Z', 
  '2026-06-20T10:10:00Z', 
  '2026-06-20T10:15:00Z'
);

-- ─── Commission Rules ──────────────────────────────────────────────────
INSERT OR REPLACE INTO commission_rules (id, loan_type, rule_type, payout_bps, flat_amount_paise, min_amount_paise, max_amount_paise, notes, active)
VALUES
  ('r_pl', 'PERSONAL_LOAN', 'PERCENT', 150, NULL, NULL, NULL, 'Standard personal loan rate (1.5%)', 1),
  ('r_hl', 'HOME_LOAN', 'PERCENT', 50, NULL, NULL, NULL, 'Standard home loan rate (0.5%)', 1),
  ('r_bl', 'BUSINESS_LOAN', 'PERCENT', 100, NULL, NULL, NULL, 'Standard business loan rate (1.0%)', 1),
  ('r_el', 'EDUCATION_LOAN', 'PERCENT', 125, NULL, NULL, NULL, 'Standard education loan rate (1.25%)', 1);

-- ─── Leads ─────────────────────────────────────────────────────────────
INSERT OR REPLACE INTO leads (id, partner_id, created_by_id, customer_name, customer_mobile, customer_email, loan_type, amount_requested_paise, product_id, city, status, notes)
VALUES
  ('ld_1', 'pp_demo', 'u_partner', 'Rajesh Kumar', '9811122233', 'rajesh@gmail.com', 'PERSONAL_LOAN', 50000000, 'p_hdfc_pl', 'Mumbai', 'CONVERTED', 'Approved and paid'),
  ('ld_2', 'pp_demo', 'u_partner', 'Anita Sharma', '9811122244', 'anita@gmail.com', 'HOME_LOAN', 300000000, 'p_icici_hl', 'Mumbai', 'CONVERTED', 'Approved and paid'),
  ('ld_3', 'pp_demo', 'u_partner', 'Vikram Singh', '9811122255', 'vikram@gmail.com', 'BUSINESS_LOAN', 100000000, 'p_hdfc_bl', 'Mumbai', 'APPLICATION_CREATED', 'Under review'),
  ('ld_4', 'pp_demo', 'u_partner', 'Pooja Patel', '9811122266', 'pooja@gmail.com', 'PERSONAL_LOAN', 25000000, 'p_axis_pl', 'Mumbai', 'QUALIFIED', 'Interested, documents being collected');

-- ─── Commissions ───────────────────────────────────────────────────────
INSERT OR REPLACE INTO commissions (id, partner_id, lead_id, product_id, amount_paise, payout_bps, status, paid_at)
VALUES
  ('c_1', 'pp_demo', 'ld_1', 'p_hdfc_pl', 750000, 150, 'PAID', '2026-06-28T10:00:00Z'),
  ('c_2', 'pp_demo', 'ld_2', 'p_icici_hl', 1500000, 50, 'PAID', '2026-06-28T10:00:00Z'),
  ('c_3', 'pp_demo', 'ld_3', 'p_hdfc_bl', 1000000, 100, 'APPROVED', NULL),
  ('c_4', 'pp_demo', 'ld_4', 'p_axis_pl', 375000, 150, 'PENDING', NULL);

-- ─── Documents ─────────────────────────────────────────────────────────
INSERT OR REPLACE INTO documents (id, owner_user_id, tag, file_name, mime_type, size_bytes, storage_key, status)
VALUES
  ('doc_1', 'u_partner', 'KYC', 'pan_card.pdf', 'application/pdf', 1048576, 'kyc/pp_demo/pan_card.pdf', 'VERIFIED'),
  ('doc_2', 'u_partner', 'KYC', 'gst_certificate.pdf', 'application/pdf', 2097152, 'kyc/pp_demo/gst_certificate.pdf', 'VERIFIED'),
  ('doc_3', 'u_partner', 'BANK_STATEMENT', 'cancelled_cheque.pdf', 'application/pdf', 1572864, 'kyc/pp_demo/cancelled_cheque.pdf', 'VERIFIED');

-- ─── Lenders ───────────────────────────────────────────────────────────
INSERT OR REPLACE INTO lenders (id, name, slug) VALUES
  ('l_hdfc',  'HDFC Bank',  'hdfc-bank'),
  ('l_icici', 'ICICI Bank', 'icici-bank'),
  ('l_sbi',   'State Bank of India', 'sbi'),
  ('l_axis',  'Axis Bank',  'axis-bank'),
  ('l_bajaj', 'Bajaj Finserv', 'bajaj-finserv');

-- ─── Loan products (paise = ×100, bps = ×100) ───────────────────────────
-- e.g. ₹50,000 → 5_000_000 paise; 10.50% p.a. → 1050 bps
INSERT OR REPLACE INTO loan_products (
  id, lender_id, name, slug, loan_type,
  min_amount_paise, max_amount_paise,
  min_tenure_months, max_tenure_months,
  min_interest_rate_bps, max_interest_rate_bps,
  processing_fee_bps, min_monthly_income_paise, min_cibil_score
) VALUES
  ('p_hdfc_pl',  'l_hdfc',  'HDFC Personal Loan',  'hdfc-personal-loan',  'PERSONAL_LOAN',
    5000000, 400000000, 12, 60, 1050, 1799, 200, 2500000, 700),
  ('p_icici_pl', 'l_icici', 'ICICI Personal Loan', 'icici-personal-loan', 'PERSONAL_LOAN',
    5000000, 500000000, 12, 60, 1075, 1899, 200, 2500000, 680),
  ('p_sbi_pl',   'l_sbi',   'SBI Personal Loan',   'sbi-personal-loan',   'PERSONAL_LOAN',
    5000000, 200000000, 12, 72, 1100, 1499, 150, 2000000, 650),
  ('p_axis_pl',  'l_axis',  'Axis Personal Loan',  'axis-personal-loan',  'PERSONAL_LOAN',
    5000000, 400000000, 12, 60, 1049, 1799, 200, 2500000, 700),
  ('p_bajaj_pl', 'l_bajaj', 'Bajaj Personal Loan', 'bajaj-personal-loan', 'PERSONAL_LOAN',
    5000000, 350000000, 12, 84, 1100, 1999, 250, 2000000, 685),
  ('p_hdfc_hl',  'l_hdfc',  'HDFC Home Loan',      'hdfc-home-loan',      'HOME_LOAN',
    100000000, 5000000000, 60, 360, 835, 999, 50, 4000000, 720),
  ('p_icici_hl', 'l_icici', 'ICICI Home Loan',     'icici-home-loan',     'HOME_LOAN',
    100000000, 5000000000, 60, 360, 850, 999, 50, 4000000, 720),
  ('p_sbi_hl',   'l_sbi',   'SBI Home Loan',       'sbi-home-loan',       'HOME_LOAN',
    100000000, 4000000000, 60, 360, 850, 999, 35, 3500000, 700),
  ('p_hdfc_bl',  'l_hdfc',  'HDFC Business Loan',  'hdfc-business-loan',  'BUSINESS_LOAN',
    20000000, 500000000, 12, 60, 1400, 2199, 250, 5000000, 700),
  ('p_bajaj_bl', 'l_bajaj', 'Bajaj Business Loan', 'bajaj-business-loan', 'BUSINESS_LOAN',
    20000000, 800000000, 12, 60, 1400, 2299, 300, 4000000, 685);

-- ─── UI Config (Key-Value pairs) ──────────────────────────────────────────
INSERT OR REPLACE INTO ui_configs (config, value) VALUES
  ('navbar.hideCarLoan', 0),
  ('navbar.hideUsedCarLoan', 0),
  ('navbar.hideTwoWheelerLoan', 0),
  ('navbar.hideGoldLoan', 0),
  ('navbar.hideBusinessLoans', 0),
  ('sections.hidePartnerStats', 0),
  ('sections.hideWallOfWin', 0),
  ('sections.hideBankingEcosystem', 0),
  ('sections.hideStatsSection', 0),
  ('sections.hideFooterCarLoan', 0),
  ('sections.hideFooterTwoWheelerLoan', 0),
  ('sections.hideFooterBusinessLoan', 0),
  ('sections.hideFooterGoldLoan', 0),
  ('sections.hideAboutUsCompanyStats', 0),
  ('sections.hideAboutUsStats', 0),
  ('sections.hideAboutUsFounders', 0),
  ('sections.hideAboutUsAdvisors', 0),
  ('sections.hideAboutUsInvestors', 0),
  ('sections.hideAboutUsPress', 0),
  ('sections.hideCareersSalaryPerk', 0),
  ('sections.hideProductCarLoan', 0),
  ('sections.hideProductUsedCarLoan', 0),
  ('sections.hideProductTwoWheelerLoan', 0),
  ('sections.hideProductGoldLoan', 0),
  ('sections.hideProductBusinessLoan', 0),
  ('sections.hideProductMicroLoan', 0);
