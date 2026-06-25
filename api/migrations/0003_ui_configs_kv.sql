-- Migration: Updated ui_configs to key-value structure
DROP TABLE IF EXISTS ui_configs;

CREATE TABLE ui_configs (
  config TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);