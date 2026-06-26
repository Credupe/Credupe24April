-- Migration: Create ui_configs table
-- ─── ui_configs ─────────────────────────────────────────────────────────
CREATE TABLE ui_configs (
  id TEXT PRIMARY KEY,
  config TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
