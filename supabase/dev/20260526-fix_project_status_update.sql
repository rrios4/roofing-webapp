-- 1. Drop the unique index — it causes deadlocks when swapping adjacent sort_order
--    values in parallel UPDATE calls (each sees the other's old value still present).
DROP INDEX IF EXISTS project_status_sort_order_idx;

-- 2. Replace with a plain index for ORDER BY performance (uniqueness not needed).
CREATE INDEX IF NOT EXISTS project_status_sort_order_idx ON project_status (sort_order);

-- 3. Allow authenticated users to update project_status rows (required for sort_order management).
--    Without this policy the authenticated role has no UPDATE permission and every
--    PATCH silently returns 204 with 0 rows affected.
CREATE POLICY "authenticated_can_update_project_status"
  ON project_status
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Allow authenticated users to insert new project_status rows.
CREATE POLICY "authenticated_can_insert_project_status"
  ON project_status
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Allow authenticated users to delete project_status rows.
CREATE POLICY "authenticated_can_delete_project_status"
  ON project_status
  FOR DELETE
  TO authenticated
  USING (true);
