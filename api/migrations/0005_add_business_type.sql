-- Migration: Add business_type column to partner_profiles table
ALTER TABLE `partner_profiles` ADD COLUMN `business_type` text;
