# Projects Feature

## Overview

The projects feature allows roofing jobs to be organized into tracked projects with statuses, source tracking, Google Drive folder linking, team assignees, and direct relationships to quotes and invoices.

The feature is built on an enhanced version of the existing `projects` table in Supabase, with three new lookup tables, a junction table, and FK columns added to `invoice` and `quote`.

### Design Principle: Address-First

Projects are identified primarily by **property address**, not by customer. A roofing company almost always knows the job site before they know the billing customer (walk-arounds, adjuster referrals, cold leads).

- `street_address` is required when creating a project; `customer` is always optional.
- A project can exist with no customer — use `property_owner_name` (free-text) to capture the contact name until a full Customer record is created.
- Project lists, search, and display all lead with address. `project_number` is a secondary reference (for contracts/invoices).
- This mirrors how tools like Roofr structure their workflow.

---

## Database Schema

### New Tables

#### `project_status`
Lookup table for project lifecycle statuses.

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` IDENTITY PK | |
| `name` | `text` NOT NULL | |
| `description` | `text` | |
| `created_at` | `timestamptz` | Defaults to `now()` |
| `updated_at` | `timestamp` | Defaults to `now()` |

**Seed data**

| id | name | Description |
|---|---|---|
| 1 | Lead | Potential customer — not yet committed. |
| 2 | Estimate Sent | Quote/proposal delivered, awaiting customer response. |
| 3 | Approved / Booked | Customer said yes — job is scheduled. |
| 4 | In Progress | Crew is actively working on the roof. |
| 5 | Inspection / Punch List | Work done — final walkthrough or touch-ups needed. |
| 6 | Invoice Sent | Waiting on payment. |
| 7 | Completed | Paid and closed. |

---

#### `project_source`
Lookup table for how a project was acquired.

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` IDENTITY PK | |
| `name` | `text` NOT NULL | |
| `description` | `text` | |
| `created_at` | `timestamptz` | Defaults to `now()` |
| `updated_at` | `timestamp` | Defaults to `now()` |

**Seed data**

| id | name |
|---|---|
| 1 | Referral |
| 2 | Repeat Customer |
| 3 | Quote Request / Web Form |
| 4 | Walk-in |
| 5 | Social Media |
| 6 | Other |

---

#### `project_type`

Lookup table for classifying the type of roofing project.

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` IDENTITY PK | |
| `name` | `text` NOT NULL UNIQUE | |
| `description` | `text` | |
| `created_at` | `timestamptz` | Defaults to `now()` |
| `updated_at` | `timestamp` | Defaults to `now()` |

**Seed data**

| id | name | Description |
|---|---|---|
| 1 | Residential | Single-family or multi-family residential property. |
| 2 | Commercial | Commercial or industrial building. |
| 3 | New Construction | New build — no existing roof to tear off. |
| 4 | Insurance Claim | Job driven by an insurance claim (hail, wind, storm damage). |
| 5 | Maintenance | Routine maintenance or minor repair. |

---

#### `project_assignee`

Junction table assigning app users (`auth.users`) to projects.

| Column | Type | Notes |
|---|---|---|
| `project_id` | `uuid` NOT NULL | FK → `projects(id)` ON DELETE CASCADE |
| `user_id` | `uuid` NOT NULL | FK → `auth.users(id)` ON DELETE CASCADE |
| `assigned_at` | `timestamptz` NOT NULL | Defaults to `now()` |

PK: `(project_id, user_id)`

---

### Modified Tables

#### `projects` — Pre-existing columns (enforced/documented by this migration)

These columns already exist in the base schema. The migration adds column comments and enforces the required constraint on `service`.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `created_at` | `timestamptz` NOT NULL | No | Auto-set on INSERT. |
| `updated_at` | `timestamp` NOT NULL | No | Auto-updated by the `update_projects_updated_at` trigger added in this migration. |
| `service` | `bigint` | Yes | **Optional.** FK → `service(id)`. Links the project to a service type. |
| `customer` | `bigint` | Yes | **Optional.** FK → `customer(id)`. A project may exist before a customer is assigned. |

#### `projects` — Added columns (new in this migration)

##### Address (address-first model)

| Column | Type | Notes |
|---|---|---|
| `street_address` | `text` NULL | Primary project identifier. Required on new creates; back-filled from legacy `address` column on migration. |
| `city` | `text` NULL | City of the job site. |
| `state` | `text` NULL | State of the job site (2-letter code). |
| `zipcode` | `text` NULL | Zip/postal code of the job site. |
| `property_owner_name` | `text` NULL | Free-text owner name. Used before a full Customer record exists. |

##### Lookup FKs

| Column | Type | Notes |
|---|---|---|
| `project_status_id` | `bigint` NULL | FK → `project_status(id)` ON DELETE SET NULL. Replaces the legacy `status text` column over time. |
| `project_type_id` | `bigint` NULL | FK → `project_type(id)` ON DELETE SET NULL. |
| `source_id` | `bigint` NULL | FK → `project_source(id)` ON DELETE SET NULL. |
| `quote_request_id` | `bigint` NULL | FK → `quote_request(id)` ON DELETE SET NULL. Traces project back to originating web form. |

##### Text / Scope

| Column | Type | Notes |
|---|---|---|
| `description` | `text` NULL | Short summary of project scope. |
| `notes` | `text` NULL | Internal team notes. |
| `sq_ft_measurement` | `text` NULL | Roof square footage used for estimating. |

##### Financial

| Column | Type | Notes |
|---|---|---|
| `estimated_value` | `numeric(12,2)` NULL | Estimated project value before contract is signed. |
| `contract_amount` | `numeric(12,2)` NULL | Agreed contract amount once customer approves the job. |

##### Insurance Claim

| Column | Type | Notes |
|---|---|---|
| `is_insurance_claim` | `boolean` NOT NULL | Defaults to `false`. |
| `claim_number` | `text` NULL | Insurance claim reference number. |
| `insurance_company` | `text` NULL | Name of the insurance carrier. |
| `adjuster_name` | `text` NULL | Name of the assigned adjuster. |
| `adjuster_phone` | `text` NULL | Adjuster phone number. |
| `date_of_loss` | `date` NULL | Date the damage event occurred. |

##### Permit

| Column | Type | Notes |
|---|---|---|
| `permit_required` | `boolean` NOT NULL | Defaults to `false`. |
| `permit_number` | `text` NULL | Permit number issued by local authority. |
| `permit_issued_date` | `date` NULL | Date the permit was issued. |

##### Google Drive

| Column | Type | Notes |
|---|---|---|
| `drive_folder_id` | `text` NULL | Google Drive folder resource ID (for API calls). |
| `drive_folder_name` | `text` NULL | Cached Drive folder display name. |
| `drive_folder_url` | `text` NULL | Full Drive folder URL (`https://drive.google.com/drive/folders/...`). |

##### Modified Constraints

- `project_number` now has a `UNIQUE` constraint, `GENERATED BY DEFAULT AS IDENTITY`, and `NOT NULL` — auto-increments for new projects.
- `updated_at` is now updated automatically via the `update_projects_updated_at` trigger.
- `status` column default is now `'Lead'`.
- Date ordering enforced: `end_date >= start_date` (CHECK constraint).

##### Legacy Columns Retained

- `address text NOT NULL` — kept for backward compatibility. New code writes `street_address` (and keeps `address` in sync as a formatted string).
- `status text NOT NULL` — kept for backward compatibility. New code reads from `project_status_id` / `project_status.name`.

---

#### `invoice` — Added column

| Column | Type | Notes |
|---|---|---|
| `project_id` | `uuid` NULL | FK → `projects(id)` ON DELETE SET NULL. Links an invoice to a project. |

---

#### `quote` — Added column

| Column | Type | Notes |
|---|---|---|
| `project_id` | `uuid` NULL | FK → `projects(id)` ON DELETE SET NULL. Links a quote to a project. |

---

## Row Level Security

All new and modified tables have RLS enabled. Policies mirror the existing patterns in the codebase.

| Table | Policy |
|---|---|
| `projects` | Full CRUD for `authenticated` users |
| `project_status` | SELECT only for `authenticated` users |
| `project_source` | SELECT only for `authenticated` users |
| `project_type` | SELECT only for `authenticated` users |
| `project_assignee` | Full CRUD for `authenticated` users |

---

## Indexes

| Index | Table | Column(s) | Notes |
|---|---|---|---|
| `idx_projects_project_status_id` | `projects` | `project_status_id` | |
| `idx_projects_source_id` | `projects` | `source_id` | |
| `idx_projects_project_type_id` | `projects` | `project_type_id` | |
| `idx_projects_customer` | `projects` | `customer` | |
| `idx_projects_service` | `projects` | `service` | |
| `idx_projects_city` | `projects` | `city` | For geographic filtering |
| `idx_projects_state` | `projects` | `state` | For geographic filtering |
| `idx_projects_drive_folder_id` | `projects` | `drive_folder_id` | Partial: `WHERE drive_folder_id IS NOT NULL` |
| `idx_projects_is_insurance_claim` | `projects` | `is_insurance_claim` | Partial: `WHERE is_insurance_claim = true` |
| `idx_projects_quote_request_id` | `projects` | `quote_request_id` | Partial: `WHERE quote_request_id IS NOT NULL` |
| `idx_invoice_project_id` | `invoice` | `project_id` | Partial: `WHERE project_id IS NOT NULL` |
| `idx_quote_project_id` | `quote` | `project_id` | Partial: `WHERE project_id IS NOT NULL` |
| `idx_project_assignee_user_id` | `project_assignee` | `user_id` | |

---

## Google Drive Integration

The three `drive_folder_*` columns on `projects` support optional linking of a Google Drive folder to a project.

- **`drive_folder_id`** — the resource ID used for Drive API calls (e.g. `files.list` with `parents` filter)
- **`drive_folder_name`** — cached display name to avoid an extra API call on every page render
- **`drive_folder_url`** — the shareable URL opened in a browser

All three fields are set together when a folder is linked and cleared together when it is unlinked.

> **Note:** Google Drive requires the `https://www.googleapis.com/auth/drive` (or `drive.file`) scope in addition to the Gmail scope currently stored in `connected_accounts.scopes`. The Drive scope must be added to the OAuth consent flow and stored in `connected_accounts.scopes` for Drive API calls to succeed. This is outside the scope of this SQL migration.

---

## Migration File

`supabase/dev/migration_projects.sql`

The migration is additive only — no existing columns or rows are removed. All `ADD COLUMN` statements use `IF NOT EXISTS`. Constraint and identity additions are wrapped in idempotent `DO $$` blocks.

**Apply order:**

1. Creates `project_status` lookup table with 7-stage pipeline seed data (Lead → Completed)
2. Creates `project_source` lookup table with seed data
3. Adds new columns to `projects` (`project_status_id`, `source_id`, `description`, `notes`)
4. Back-fills `project_status_id` from existing `status` text values (only exact name matches apply)
5. Documents pre-existing columns (`created_at`, `updated_at`, `customer`, `service`) with column comments
6. Adds `UNIQUE` + `GENERATED BY DEFAULT AS IDENTITY` to `project_number`
7. Adds Google Drive columns
8. Creates `project_assignee` junction table
9. Adds `project_id` FK column to `invoice` and `quote`
10. Creates base indexes
11. Adds `updated_at` trigger on `projects`
12. Enables RLS and creates policies
13. Creates `project_type` lookup table with seed data; adds `project_type_id` FK to `projects`
14. Adds structured address columns (`street_address`, `city`, `state`, `zipcode`, `property_owner_name`); back-fills `street_address` from `address`; sets `status` DEFAULT to `'Lead'`
15. Adds insurance claim columns (`is_insurance_claim`, `claim_number`, `insurance_company`, `adjuster_name`, `adjuster_phone`, `date_of_loss`) and permit columns (`permit_required`, `permit_number`, `permit_issued_date`)
16. Adds financial columns (`estimated_value`, `contract_amount`, `sq_ft_measurement`) and `quote_request_id` FK
17. Adds defensive constraints (UNIQUE on lookup names, CHECK on date ordering, NOT NULL on `project_number`)
18. Creates indexes for new columns

---

## Suggested UI Conventions

- Display `project_status.name` (from the FK join) rather than the raw `projects.status` text.
- Show `drive_folder_name` as the link label with `drive_folder_url` as the `href`. Use `drive_folder_id` only for API operations.
- When creating a new project, omit `project_number` from the INSERT — the identity sequence generates it automatically.
- To convert a quote to a project (or link an existing quote), set `quote.project_id` to the project UUID.
