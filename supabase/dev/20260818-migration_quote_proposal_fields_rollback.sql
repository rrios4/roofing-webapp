BEGIN;
ALTER TABLE "public"."quote"
  DROP COLUMN IF EXISTS "shingle_brand",
  DROP COLUMN IF EXISTS "shingle_model",
  DROP COLUMN IF EXISTS "shingle_color";
COMMIT;