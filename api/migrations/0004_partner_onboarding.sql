-- Migration: Add Partner Onboarding & Dashboard support

-- 1. Create commission_rules table
CREATE TABLE IF NOT EXISTS `commission_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`loan_type` text NOT NULL,
	`rule_type` text DEFAULT 'PERCENT' NOT NULL,
	`payout_bps` integer,
	`flat_amount_paise` integer,
	`min_amount_paise` integer,
	`max_amount_paise` integer,
	`notes` text,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `commission_rules_loan_type_unique` ON `commission_rules` (`loan_type`);

-- 2. Alter partner_profiles to add columns
ALTER TABLE `partner_profiles` ADD COLUMN `partner_code` text NOT NULL DEFAULT '';
ALTER TABLE `partner_profiles` ADD COLUMN `email` text;
ALTER TABLE `partner_profiles` ADD COLUMN `mobile` text;
ALTER TABLE `partner_profiles` ADD COLUMN `address` text;
ALTER TABLE `partner_profiles` ADD COLUMN `pan_number` text;
ALTER TABLE `partner_profiles` ADD COLUMN `aadhaar_last4` text;
ALTER TABLE `partner_profiles` ADD COLUMN `bank_account_json` text;
ALTER TABLE `partner_profiles` ADD COLUMN `tier` text DEFAULT 'BRONZE' NOT NULL;
ALTER TABLE `partner_profiles` ADD COLUMN `onboarding_step` text DEFAULT 'CONTACT' NOT NULL;
ALTER TABLE `partner_profiles` ADD COLUMN `mobile_verified_at` text;
ALTER TABLE `partner_profiles` ADD COLUMN `email_verified_at` text;
ALTER TABLE `partner_profiles` ADD COLUMN `agreement_signed_at` text;
ALTER TABLE `partner_profiles` ADD COLUMN `activated_at` text;

-- Create unique index on partner_code
CREATE UNIQUE INDEX IF NOT EXISTS `partner_profiles_partner_code_unique` ON `partner_profiles` (`partner_code`);
