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

INSERT OR REPLACE INTO partner_profiles (id, user_id, business_name, kyc_status)
VALUES ('pp_demo', 'u_partner', 'Demo Partner LLP', 'VERIFIED');

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
