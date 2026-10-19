BEGIN;

ALTER TABLE "public"."quote"
  ADD COLUMN IF NOT EXISTS "shingle_brand" text,
  ADD COLUMN IF NOT EXISTS "shingle_model" text,
  ADD COLUMN IF NOT EXISTS "shingle_color" text DEFAULT 'TBD';

COMMENT ON COLUMN "public"."quote"."shingle_brand" IS 'Selected shingle manufacturer for the roofing proposal (e.g. Tamko, GAF, Owens Corning, CertainTeed).';
COMMENT ON COLUMN "public"."quote"."shingle_model" IS 'Selected shingle product line/model for the roofing proposal (e.g. Titan XT).';
COMMENT ON COLUMN "public"."quote"."shingle_color" IS 'Selected shingle color for the roofing proposal; defaults to TBD until chosen.';

COMMIT;