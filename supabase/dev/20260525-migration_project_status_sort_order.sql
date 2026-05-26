-- Add sort_order column to project_status for user-controlled kanban ordering
ALTER TABLE project_status ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Backfill: preserve current id-based order so existing data keeps its sequence
UPDATE project_status SET sort_order = id;

-- Unique index so sort_order values stay distinct and the ORDER BY is efficient
CREATE UNIQUE INDEX IF NOT EXISTS project_status_sort_order_idx ON project_status (sort_order);