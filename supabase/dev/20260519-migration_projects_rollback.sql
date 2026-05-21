-- =================================================================
-- Rollback: Projects Feature Enhancement
-- Target:    supabase/dev (Postgres 15 / Supabase)
-- Date:      2026-05-21
-- Reverses:  20260519-migration_projects.sql
--
-- WARNING: This permanently deletes data in the dropped columns and
-- tables. Only use in development, or in production when you are
-- certain the data in those columns can be discarded.
--
-- SAFE TO RE-RUN: All DROP statements use IF EXISTS.
-- Wrapped in a single transaction — if any step fails the entire
-- rollback is aborted and nothing is changed.
--
-- Phases are reversed in the opposite order of the forward migration
-- so that foreign-key dependencies don't block the drops.
-- =================================================================

BEGIN;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 16 — Drop new indexes
-- -----------------------------------------------------------------

DROP INDEX IF EXISTS "public"."idx_projects_project_type_id";
DROP INDEX IF EXISTS "public"."idx_projects_is_insurance_claim";
DROP INDEX IF EXISTS "public"."idx_projects_quote_request_id";
DROP INDEX IF EXISTS "public"."idx_projects_city";
DROP INDEX IF EXISTS "public"."idx_projects_state";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 15 — Drop defensive constraints
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP CONSTRAINT IF EXISTS "projects_dates_check";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE  conname  = 'project_status_name_key'
      AND  conrelid = 'public.project_status'::regclass
  ) THEN
    ALTER TABLE public.project_status DROP CONSTRAINT project_status_name_key;
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE  conname  = 'project_source_name_key'
      AND  conrelid = 'public.project_source'::regclass
  ) THEN
    ALTER TABLE public.project_source DROP CONSTRAINT project_source_name_key;
  END IF;
END;
$$;

-- Restore project_number to nullable (undo the NOT NULL added in Phase 15)
DO $$
DECLARE
  v_is_nullable text;
BEGIN
  SELECT is_nullable INTO v_is_nullable
  FROM   information_schema.columns
  WHERE  table_schema = 'public'
    AND  table_name   = 'projects'
    AND  column_name  = 'project_number';

  IF v_is_nullable = 'NO' THEN
    ALTER TABLE public.projects ALTER COLUMN project_number DROP NOT NULL;
  END IF;
END;
$$;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 14 — Drop financial, measurement & quote_request_id
-- (DROP COLUMN automatically removes the associated FK constraint)
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP COLUMN IF EXISTS "quote_request_id",
  DROP COLUMN IF EXISTS "estimated_value",
  DROP COLUMN IF EXISTS "contract_amount",
  DROP COLUMN IF EXISTS "sq_ft_measurement";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 13 — Drop insurance claim & permit columns
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP COLUMN IF EXISTS "is_insurance_claim",
  DROP COLUMN IF EXISTS "claim_number",
  DROP COLUMN IF EXISTS "insurance_company",
  DROP COLUMN IF EXISTS "adjuster_name",
  DROP COLUMN IF EXISTS "adjuster_phone",
  DROP COLUMN IF EXISTS "date_of_loss",
  DROP COLUMN IF EXISTS "permit_required",
  DROP COLUMN IF EXISTS "permit_number",
  DROP COLUMN IF EXISTS "permit_issued_date";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 12 — Drop structured address columns + undo status default
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP COLUMN IF EXISTS "street_address",
  DROP COLUMN IF EXISTS "city",
  DROP COLUMN IF EXISTS "state",
  DROP COLUMN IF EXISTS "zipcode",
  DROP COLUMN IF EXISTS "property_owner_name";

ALTER TABLE "public"."projects"
  ALTER COLUMN "status" DROP DEFAULT;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 11 — Drop project_type_id column + project_type table
-- Dropping the column removes the FK constraint automatically.
-- Dropping the table removes its RLS policy automatically.
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP COLUMN IF EXISTS "project_type_id";

DROP TABLE IF EXISTS "public"."project_type";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 10 — Drop the RLS policy added to projects.
--
-- NOTE: RLS is NOT disabled on projects — it was already enabled in
-- the base schema.sql before this migration ran. Disabling it here
-- would change pre-migration state. The table returns to its
-- pre-migration state: RLS on, no policy (default deny).
--
-- project_status, project_source, project_assignee are dropped as
-- whole tables below; their policies are removed with the tables.
-- -----------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE  schemaname = 'public'
      AND  tablename  = 'projects'
      AND  policyname = 'Enable all operations for authenticated users only'
  ) THEN
    DROP POLICY "Enable all operations for authenticated users only" ON public.projects;
  END IF;
END;
$$;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 9 — Drop updated_at trigger on projects
-- -----------------------------------------------------------------

DROP TRIGGER IF EXISTS "update_projects_updated_at" ON "public"."projects";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 8 — Drop base indexes
-- -----------------------------------------------------------------

DROP INDEX IF EXISTS "public"."idx_projects_project_status_id";
DROP INDEX IF EXISTS "public"."idx_projects_source_id";
DROP INDEX IF EXISTS "public"."idx_projects_customer";
DROP INDEX IF EXISTS "public"."idx_projects_service";
DROP INDEX IF EXISTS "public"."idx_projects_drive_folder_id";
DROP INDEX IF EXISTS "public"."idx_invoice_project_id";
DROP INDEX IF EXISTS "public"."idx_quote_project_id";
DROP INDEX IF EXISTS "public"."idx_project_assignee_user_id";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 7 — Remove project_id FK + column from invoice & quote
-- Drop the named FK constraint before dropping the column (belt + suspenders).
-- -----------------------------------------------------------------

ALTER TABLE "public"."invoice"
  DROP CONSTRAINT IF EXISTS "invoice_project_id_fkey",
  DROP COLUMN    IF EXISTS "project_id";

ALTER TABLE "public"."quote"
  DROP CONSTRAINT IF EXISTS "quote_project_id_fkey",
  DROP COLUMN    IF EXISTS "project_id";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 6 — Drop project_assignee junction table
-- CASCADE removes both FK constraints and the RLS policy with it.
-- -----------------------------------------------------------------

DROP TABLE IF EXISTS "public"."project_assignee" CASCADE;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 5 — Drop Google Drive columns from projects
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP COLUMN IF EXISTS "drive_folder_id",
  DROP COLUMN IF EXISTS "drive_folder_name",
  DROP COLUMN IF EXISTS "drive_folder_url";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 4 — Remove UNIQUE constraint and IDENTITY from project_number
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP CONSTRAINT IF EXISTS "projects_project_number_key";

DO $$
DECLARE
  v_identity_gen text;
BEGIN
  SELECT identity_generation INTO v_identity_gen
  FROM   information_schema.columns
  WHERE  table_schema = 'public'
    AND  table_name   = 'projects'
    AND  column_name  = 'project_number';

  IF v_identity_gen IS NOT NULL THEN
    ALTER TABLE public.projects
      ALTER COLUMN project_number DROP IDENTITY IF EXISTS;
  END IF;
END;
$$;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 3b — Clear column comments added to pre-existing columns
-- -----------------------------------------------------------------

COMMENT ON COLUMN "public"."projects"."created_at" IS NULL;
COMMENT ON COLUMN "public"."projects"."updated_at" IS NULL;
COMMENT ON COLUMN "public"."projects"."customer"   IS NULL;
COMMENT ON COLUMN "public"."projects"."service"    IS NULL;

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 3 — Drop columns added to projects
-- DROP COLUMN automatically removes the FK constraints on these columns.
-- -----------------------------------------------------------------

ALTER TABLE "public"."projects"
  DROP COLUMN IF EXISTS "project_status_id",
  DROP COLUMN IF EXISTS "source_id",
  DROP COLUMN IF EXISTS "description",
  DROP COLUMN IF EXISTS "notes";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 2 — Drop project_source table
-- Dropping the table removes its RLS policy automatically.
-- -----------------------------------------------------------------

DROP TABLE IF EXISTS "public"."project_source";

-- -----------------------------------------------------------------
-- ROLLBACK PHASE 1 — Drop project_status table
-- Dropping the table removes its RLS policy automatically.
-- -----------------------------------------------------------------

DROP TABLE IF EXISTS "public"."project_status";

COMMIT;
