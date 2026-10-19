# Native Local-First Contractor Business App — Product Requirements Document

| | |
|---|---|
| **Status** | Draft |
| **Owner** | rxr348@gmail.com |
| **Last updated** | 2026-08-26 |
| **Version** | 0.1 |

---

## 1. Overview & Vision

This is a **new, separate product**, not a port of the existing `roofing-webapp`. It's a native desktop application for **Windows and macOS**, sold to small roofing and general-construction contractor businesses to manage their jobs — both jobs sourced from other businesses (GCs, insurance companies) and jobs the contractor gets directly from homeowners.

The core value proposition is **local-first and privacy-focused**: a contractor's business data — contacts, quotes, invoices, projects — lives on their own machine, not in a cloud account they're paying rent on and dependent on. The app should be fully usable, forever, with the network unplugged. Cloud sync and third-party integrations are optional, separately-paywalled conveniences layered on top of a complete offline product — never a requirement to do core work.

This PRD is derived from analysis of the existing `roofing-webapp` codebase (React + Supabase), which is being used as a reference for what business logic and UI patterns are worth carrying forward, and as a case study in schema problems worth fixing in a from-scratch design (see [§11 Data Model](#11-data-model)).

## 2. Problem Statement

Small contractors currently choose between: (a) general-purpose SaaS tools (QuickBooks, Buildertrend, JobNimbus) that lock their business data behind someone else's cloud, recurring fees, and internet dependency even at a job site with poor signal, or (b) spreadsheets and paper, which don't scale past a handful of jobs. There's a gap for a tool that behaves like the software they're used to owning outright — install it, your data is yours, it works offline — while still organizing quotes, invoices, contacts, and jobs around the actual unit of work: **the project**.

The existing web app also demonstrates a structural problem worth naming directly: quotes, invoices, and customers are independent, siloed sections. A user has to hop between three unrelated lists to understand the state of one job. There's no single place that answers "what does this job need next."

## 3. Goals & Non-Goals

### Goals (v1)
- Fully offline, native (Windows + macOS) desktop app.
- **Project is the mandatory central hub** — quotes, invoices, and contacts are organized around and required to belong to a project.
- Dashboard surfaces "what needs attention" across projects, not just revenue charts.
- Preserve the proven business logic from the existing app: quote → invoice conversion, line-item quoting, payment tracking, PDF generation for quotes/invoices/proposals.
- One-time purchase, zero runtime network dependency beyond a one-time/cached license check.

### Non-Goals (v1 — explicitly deferred)
- Cloud sync across devices (Phase 2).
- Multi-user accounts, roles, or permissions (Phase 2/3 — v1 is single-user per install).
- Google Workspace or Microsoft 365 integration (Phase 3).
- Multi-tenancy / supporting more than one business per install.
- Crew scheduling, material inventory, or a public lead-capture web form.

## 4. Target User & Personas

**Primary persona**: The owner-operator of a small roofing or general-construction contracting business (1-15 employees). They are the sole admin user of the app. They handle two kinds of work:
- **Direct jobs**: sourced from homeowners, where the contractor deals directly with the property owner.
- **Subcontracted jobs**: sourced from a general contractor or insurance company, where the paying party (GC, insurer) may be different from the person on-site (homeowner, tenant, property manager).

They are not necessarily technical, want the app to feel as simple as a well-organized filing system, and are skeptical of subscription software for their core operations — but are willing to pay for genuinely useful cloud/integration conveniences once the core tool has earned trust.

## 5. Business Model & Packaging

- **Core app**: one-time purchase, license-key activated. Fully functional offline forever after activation.
- **Cloud Sync add-on**: monthly subscription. Syncs local SQLite data to Supabase so the same business's data is usable across multiple devices/installs.
- **Google Workspace add-on**: monthly subscription, sold independently of Cloud Sync. Gmail send, Drive folder-per-project, Docs-based document generation.
- **Microsoft 365 add-on**: monthly subscription, sold independently. OneDrive, Outlook equivalents.

Each add-on is a distinct entitlement — a customer can buy the core app alone, or add any combination of the subscriptions.

## 6. Phased Roadmap

| Phase | Name | Deliverable | Paywall |
|---|---|---|---|
| **0** | Foundations | Tauri shell scaffolded, React app adapted to run in the Tauri webview, local SQLite DB created on first run with migration tooling in place, company-profile onboarding wizard. No business features yet. | — (internal milestone) |
| **1** | Core Local App | Full offline, single-user, single-business app: Dashboard, Projects (hub), Contacts, Quotes, Invoices, Services catalog, Company Profile/Settings, PDF generation, local backup/export. This PRD's primary scope. | **One-time purchase** |
| **2** | Cloud Sync | Supabase-backed sync of local SQLite data across a user's own multiple devices. Introduces conflict resolution and is the natural point to add multi-user/roles. | **Subscription add-on** |
| **3** | Workspace Integrations | Google Workspace (Drive, Docs, Gmail) and Microsoft 365 (OneDrive, Outlook), each independently paywalled. Reintroduces OAuth token storage, out of scope for v1. | **Subscription add-ons (sold separately)** |
| **4+** | Multi-user & roles, scheduling, mobile | Full RBAC, crew/calendar scheduling beyond the lightweight v1 task checklist, possible mobile companion. Named only to show the roadmap doesn't dead-end — not designed in this PRD. | TBD |

**Core architectural rule**: Phase 1 has **zero runtime network dependency**. The only network call anywhere in Phase 1 is the one-time (then periodically cached) license validation. All CRUD, all PDF generation, all reporting is 100% local SQLite.

## 7. Scope Summary

| Feature area | v1 (Phase 1) | Deferred |
|---|---|---|
| Projects (hub) | ✅ Full CRUD, status pipeline, tabs for quotes/invoices/tasks/contacts | Crew assignment, scheduling |
| Quotes | ✅ Created inside a project, line items, PDF export, status funnel | — |
| Invoices | ✅ Created inside a project or from a quote, payments, PDF export | — |
| Contacts | ✅ Individual/business contacts, multi-role per project | — |
| Dashboard | ✅ Projects-needing-attention, pipeline, revenue snapshot | — |
| Settings | ✅ Company profile, lookup management, local backup/restore, license | — |
| Cloud sync | ❌ | Phase 2 |
| Multi-user / roles | ❌ | Phase 2/3 |
| Google / Microsoft integration | ❌ | Phase 3 |
| Public lead-capture form | ❌ | Not planned |

## 8. Information Architecture & Navigation

Top-level navigation: **Dashboard, Projects, Quotes, Invoices, Contacts, Settings.**

**Core navigation rule**: creation of a Quote or Invoice is always initiated from within a Project. The top-level **Quotes** and **Invoices** pages are read-only, filterable, cross-project list/search views — useful for "show me everything overdue" or "show me every quote expiring this week" — that deep-link into the owning project's detail page for any edit action. There is no standalone "New Quote" or "New Invoice" button outside a project context.

## 9. Functional Requirements

### 9.1 Dashboard
- **Primary widget — "Projects needing attention"**: a prioritized list driven by quotes expiring soon and still `Sent`, invoices past due and unpaid, projects with overdue tasks, and projects whose status hasn't changed in an unusually long time (stalled).
- Secondary widgets: revenue snapshot (quoted vs. invoiced vs. collected), pipeline funnel by project status, upcoming project start dates.
- Quick actions: New Project, New Contact.
- Computed entirely from local SQLite — no external calls.

### 9.2 Projects (the hub)
- List view: filter/sort by status, type, source, contact, date range; search by address, name, or project number.
- Detail view is the hub: project info panel (address, contact(s), insurance/permit fields when applicable), a **Quotes tab** ("New Quote" lives here), an **Invoices tab** ("New Invoice" or "Convert from Quote" lives here), a **Tasks tab** (lightweight checklist), a **Contacts tab** (all linked contacts and their roles), and notes/activity.
- Create/edit: address and primary contact are required; insurance-claim and permit fields shown conditionally.
- Status changes are a first-class, low-friction action (e.g. a status dropdown or kanban drag) since they drive the Dashboard's attention logic.
- "Convert to Invoice" on a project's Quotes tab copies line items into a new invoice, links it back to the source quote, and updates the quote's status to Converted.

### 9.3 Quotes
- Top-level list: read-only, filterable by status/date/contact/project; clicking a row opens the quote inside its project.
- Within-project: line items (service, description, qty, rate or fixed amount, sq ft), shingle selection fields, public/private notes, expiration date, status funnel (Draft → Sent → Viewed → Accepted/Declined → Expired → Converted).
- PDF export with a choice of style ("Simple Quote" or "Full Proposal"), both rendered from the same quote data — see [§11.3](#113-decision-merge-proposal-into-quote).
- Duplicate/clone quote action, carried over from the current app.

### 9.4 Invoices
- Top-level list: read-only, filterable by status/date/contact/project/overdue; deep-links to the owning project.
- Within-project: standalone creation, or "Convert from Quote" (pre-fills line items).
- Payment recording (add/edit/delete payments), with the outstanding balance computed live rather than stored (see [§11.2](#112-invoice)).
- "Bill to" override for the case where the paying party (GC, insurer) differs from the project's primary contact.
- PDF export sourced from the Company Profile, not per-invoice hardcoded business info.

### 9.5 Contacts
- List/search, filterable by contact type.
- Contact detail shows every project they're associated with, across both "primary contact" and any secondary role (e.g. "GC on 3 projects, property owner on 1").
- Create/edit: individual vs. business toggle, address, phone, email, notes.
- No standalone quote/invoice creation from a contact — always routed through a project, though "Start New Project for this Contact" is a reasonable convenience action.

### 9.6 Settings / Company Profile
- Company Profile form (name, logo, address, tax rate, currency, date format) — populated via a first-run onboarding wizard before any other feature is usable.
- Services catalog CRUD.
- Lookup management: project statuses/types/sources, quote/invoice statuses, contact types, project contact roles — lets each contractor tailor their own pipeline stages.
- Local backup/export (copy the SQLite file or export to CSV/JSON) and restore.
- License/Activation panel, plus visible (grayed-out until purchased) upsell entries for Cloud Sync, Google Workspace, and Microsoft 365.

## 10. Analysis of the Existing App (Reference)

The following is a summary of what was found in the current `roofing-webapp` codebase, used to inform the requirements and schema above.

**Current tech stack**: React 18 + Vite, React Router v6 (routed inline in `src/index.tsx`, no separate `App.tsx`), TanStack React Query + React Table, React Hook Form + Zod, Radix UI/shadcn + Tailwind CSS, Tremor + Chart.js for dashboard charts, `@react-pdf/renderer` for PDF generation, `@supabase/supabase-js` called directly from `src/services/api/*` (no backend API layer), Google OAuth login with Gmail/Drive scopes.

**Current pages**: Dashboard, Projects (+ Project Settings), Sales Leads/Inbox (public quote-request intake), Quotes (list + detail), Invoices (list + detail), Customers (list + detail), a vestigial unused Jobs stub, Data Management (services, statuses, customer types), Settings/Profile, Login.

**Current data model** (Postgres/Supabase, `supabase/dev/schema.sql`): 21 tables — `customer`, `customer_type`, `quote_request`, `quote_request_status`, `invoice`, `invoice_line_service`, `invoice_payment`, `invoice_status`, `quote`, `quote_line_item`, `quote_status`, `service`, `proposal`, `proposal_template`, `proposal_variable`, `connected_accounts`, `projects`, `project_status`, `project_type`, `project_source`, `project_assignee`.

**Problems identified in the current schema**, each addressed in [§11](#11-data-model):

1. **Dual-key anti-pattern.** `quote` and `invoice` each carry a surrogate `id` *and* a separate unique business number (`quote_number`, `invoice_number`); child tables (`quote_line_item`, `invoice_line_service`, `invoice_payment`) foreign-key to the **number**, not the `id`. `proposal.quote_id` is the sole exception and FKs to `quote.id`, inconsistently. → Fixed by single-PK-per-table (§11.1).
2. **Project linkage is optional, bolted on.** `quote.project_id` / `invoice.project_id` are nullable FKs added later via migration — a quote or invoice can exist with no project at all. → Fixed by making `project_id` required (§11.2).
3. **Quote → invoice conversion has no real referential integrity.** `invoice.converted_from_quote_number` is a unique bigint with no FK constraint to `quote`, plus a separate `quote.converted` boolean. → Fixed with a real FK (§11.2).
4. **The "proposal" concept is fragmented.** A full `proposal`/`proposal_template`/`proposal_variable` system (Google-Docs-template-driven, its own status funnel) exists disconnected from newer `shingle_brand`/`shingle_model`/`shingle_color` fields bolted directly onto `quote` — evidence the product already drifted away from the template system before this PRD. → Resolved by unification (§11.3).
5. **No job/work-tracking sub-structure.** Projects have status and dates but nothing tracking day-to-day work (a checklist, a schedule). → Addressed narrowly with a lightweight task list (§11.4), while explicitly keeping crew scheduling and inventory out of scope.
6. **No multi-stakeholder contact model.** `projects.customer` is a single optional FK; there's no way to represent a GC as the paying party and a homeowner as the on-site contact on the same job. → Fixed with a generalized `contact` + `project_contact` role model (§11.5).
7. **RLS and hardcoded business identity won't carry to local-first.** Nearly every table has blanket `authenticated`-role RLS policies; the business's own name/address is hardcoded as UI text and as DB column defaults (`150 Tallant St, Houston`). → Replaced by a `company_profile` table and the absence of RLS entirely (single OS user owns the file).
8. **No multi-tenancy exists today**, and none is needed for v1 (confirmed non-goal, §3).
9. **Lookup tables** (`customer_type`, `quote_status`, `invoice_status`, `project_status`, `project_type`, `project_source`, `service`) are a sound, reusable pattern — carried forward, just re-keyed for SQLite.

## 11. Data Model

The new schema is designed for **SQLite**, single-user, single-business, v1 (Phase 1) scope. All timestamps are stored as TEXT (ISO 8601), booleans as `INTEGER` (0/1).

### 11.1 Design Principles

1. **Single PK per table.** "Business numbers" (`quote_number`, `invoice_number`, `project_number`) are display-only fields, generated via `document_sequence`, never used as join keys — fixes Problem 1.
2. **UUID (TEXT) primary keys for all business-entity tables**, even though sync isn't built until Phase 2. Lookup/enum tables keep `INTEGER PRIMARY KEY`. This costs nothing in a single-user local app today but avoids a breaking primary-key migration when Phase 2 needs globally-unique IDs across devices.
3. **`project_id` is `NOT NULL` on `quote` and `invoice`** — fixes Problem 2.
4. **Quote → invoice conversion is a real, unique foreign key** (`invoice.source_quote_id → quote.id`) — fixes Problem 3.
5. **Proposal is merged into Quote** as a status/timestamp extension, not a separate entity — fixes Problem 4 (justification in §11.3).
6. **A minimal `project_task` table** covers job-checklist tracking without scope-creeping into scheduling or inventory — addresses Problem 5.
7. **`contact` replaces `customer`**, generalized, with a `project_contact` join table for multi-stakeholder jobs — fixes Problem 6.
8. **No RLS, no `auth.users`, no policies anywhere.** A single `company_profile` singleton row replaces hardcoded business identity — fixes Problem 7.
9. **`updated_at` is maintained via SQLite `AFTER UPDATE` triggers** on every mutable table, mirroring the existing Postgres `update_updated_at_column()` convention.

### 11.2 Table Definitions

#### Lookup tables (`INTEGER PRIMARY KEY`)

```sql
CREATE TABLE contact_type (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Homeowner, Business/GC, Property Manager, Insurance Company
  description  TEXT
);

CREATE TABLE project_contact_role (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Billing Contact, Property Owner, General Contractor, Insurance Adjuster, Tenant, Other
  description  TEXT
);

CREATE TABLE project_status (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Lead, Estimate Sent, Approved/Booked, In Progress, Inspection/Punch List, Invoice Sent, Completed
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE project_type (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Residential, Commercial, New Construction, Insurance Claim, Maintenance
  description  TEXT
);

CREATE TABLE project_source (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Referral, Repeat Customer, Walk-in, Social Media, Other
  description  TEXT
);

CREATE TABLE quote_status (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Draft, Sent, Viewed, Accepted, Declined, Expired, Converted
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE invoice_status (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,   -- Draft, Sent, Partially Paid, Paid, Overdue, Void
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE service (
  id             INTEGER PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  unit           TEXT,              -- 'per sq', 'per hour', 'flat', etc.
  default_price  REAL,              -- was stored as TEXT in the old schema; fixed to numeric
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT
);
```

#### Singleton configuration tables

```sql
CREATE TABLE company_profile (
  id                INTEGER PRIMARY KEY CHECK (id = 1),
  company_name      TEXT NOT NULL,
  logo_path         TEXT,
  street_address    TEXT,
  city              TEXT,
  state             TEXT,
  zipcode           TEXT,
  phone_number      TEXT,
  email             TEXT,
  website           TEXT,
  tax_id            TEXT,
  license_number    TEXT,           -- contractor license #, distinct from the app's own license table
  default_tax_rate  REAL,
  currency_code     TEXT NOT NULL DEFAULT 'USD',
  date_format       TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
  brand_color       TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT
);

CREATE TABLE app_setting (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE license (
  id                 INTEGER PRIMARY KEY CHECK (id = 1),
  license_key        TEXT,
  status             TEXT NOT NULL DEFAULT 'unactivated'
                        CHECK (status IN ('unactivated','active','expired','revoked')),
  activated_at       TEXT,
  last_validated_at  TEXT,
  machine_id         TEXT,
  raw_response       TEXT
);

CREATE TABLE document_sequence (
  entity_name  TEXT PRIMARY KEY,     -- 'project', 'quote', 'invoice'
  prefix       TEXT NOT NULL DEFAULT '',
  next_value   INTEGER NOT NULL DEFAULT 1,
  padding      INTEGER NOT NULL DEFAULT 4
);
```

#### Contact & Project

```sql
CREATE TABLE contact (
  id                TEXT PRIMARY KEY,          -- UUID
  contact_type_id   INTEGER NOT NULL REFERENCES contact_type(id),
  is_business       INTEGER NOT NULL DEFAULT 0,
  first_name        TEXT,
  last_name         TEXT,
  company_name      TEXT,
  email             TEXT,
  phone_number      TEXT,
  street_address    TEXT,
  city              TEXT,
  state             TEXT,
  zipcode           TEXT,
  notes             TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT
);

CREATE TABLE project (
  id                   TEXT PRIMARY KEY,       -- UUID
  project_number       INTEGER NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  primary_contact_id   TEXT NOT NULL REFERENCES contact(id),
  project_status_id    INTEGER NOT NULL REFERENCES project_status(id) DEFAULT 1,
  project_type_id      INTEGER REFERENCES project_type(id),
  source_id            INTEGER REFERENCES project_source(id),
  primary_service_id   INTEGER REFERENCES service(id),
  street_address       TEXT NOT NULL,
  city                 TEXT,
  state                TEXT,
  zipcode              TEXT,
  description          TEXT,
  notes                TEXT,
  start_date           TEXT,
  end_date             TEXT,
  estimated_value      REAL,
  contract_amount      REAL,
  sq_ft_measurement    TEXT,
  is_insurance_claim   INTEGER NOT NULL DEFAULT 0,
  claim_number         TEXT,
  insurance_company    TEXT,
  adjuster_name        TEXT,
  adjuster_phone       TEXT,
  date_of_loss         TEXT,
  permit_required      INTEGER NOT NULL DEFAULT 0,
  permit_number        TEXT,
  permit_issued_date   TEXT,
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT,
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE project_contact (
  id           TEXT PRIMARY KEY,     -- UUID
  project_id   TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  contact_id   TEXT NOT NULL REFERENCES contact(id),
  role_id      INTEGER NOT NULL REFERENCES project_contact_role(id),
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (project_id, contact_id, role_id)
);

CREATE TABLE project_task (
  id             TEXT PRIMARY KEY,   -- UUID
  project_id     TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  is_complete    INTEGER NOT NULL DEFAULT 0,
  due_date       TEXT,
  completed_at   TEXT,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT
);
```

Notes on divergence from the old `projects` table: `primary_contact_id` and `street_address` are now **required** (were optional) — a project can't exist without knowing who it's for and where the work is. `drive_folder_*` columns are dropped (Phase 3 only). `quote_request_id` is dropped (no public lead-capture form in this product). `project_assignee` is dropped entirely from v1 (has no meaning until Phase 2/3 introduces more than one user per install).

#### Quote

```sql
CREATE TABLE quote (
  id                  TEXT PRIMARY KEY,        -- UUID
  quote_number        INTEGER NOT NULL UNIQUE,
  project_id          TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  status_id           INTEGER NOT NULL REFERENCES quote_status(id) DEFAULT 1,
  primary_service_id  INTEGER REFERENCES service(id),
  quote_date          TEXT NOT NULL,
  issue_date          TEXT,
  expiration_date     TEXT NOT NULL,
  subtotal            REAL,
  total                REAL,
  invoiced_total        REAL,
  note                  TEXT,
  measurement_note      TEXT,
  public_note           TEXT,
  private_note          TEXT,
  shingle_brand         TEXT,
  shingle_model         TEXT,
  shingle_color         TEXT DEFAULT 'TBD',
  sent_at               TEXT,
  viewed_at             TEXT,
  accepted_at           TEXT,
  declined_at           TEXT,
  expired_at            TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT
);

CREATE TABLE quote_line_item (
  id             TEXT PRIMARY KEY,   -- UUID
  quote_id       TEXT NOT NULL REFERENCES quote(id) ON DELETE CASCADE,
  service_id     TEXT NOT NULL REFERENCES service(id),
  description    TEXT NOT NULL,
  qty            INTEGER NOT NULL,
  sq_ft          REAL,
  rate           REAL,
  fixed_item     INTEGER NOT NULL DEFAULT 1,
  amount         REAL NOT NULL,
  subtotal       REAL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT
);
```

Notes: `project_id` is required (fixes Problem 2). `sent_at`/`viewed_at`/`accepted_at`/`declined_at`/`expired_at` absorb the deprecated `proposal` table's status-timestamp fields (fixes Problem 4). Line items FK to `quote.id`, not a business number (fixes Problem 1). The old per-quote custom-address fields are dropped — since a project now owns a required address, a quote needing a genuinely different address implies it belongs to a different project (see [§15 Open Questions](#15-open-questions--risks) for the case this may need revisiting).

#### Invoice

```sql
CREATE TABLE invoice (
  id                      TEXT PRIMARY KEY,     -- UUID
  invoice_number          INTEGER NOT NULL UNIQUE,
  project_id              TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  source_quote_id         TEXT UNIQUE REFERENCES quote(id) ON DELETE SET NULL,
  status_id               INTEGER NOT NULL REFERENCES invoice_status(id) DEFAULT 1,
  invoice_date            TEXT,
  issue_date               TEXT,
  due_date                 TEXT,
  subtotal                 REAL,
  total                     REAL,
  sq_ft_measurement         TEXT,
  bill_to_override          INTEGER NOT NULL DEFAULT 0,
  bill_to_name              TEXT,
  bill_to_street_address    TEXT,
  bill_to_city              TEXT,
  bill_to_state             TEXT,
  bill_to_zipcode           TEXT,
  public_note               TEXT,
  private_note              TEXT,
  created_at                TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at                 TEXT
);

CREATE TABLE invoice_line_item (
  id             TEXT PRIMARY KEY,   -- UUID
  invoice_id     TEXT NOT NULL REFERENCES invoice(id) ON DELETE CASCADE,
  service_id     TEXT NOT NULL REFERENCES service(id),
  description    TEXT,
  qty            INTEGER NOT NULL,
  sq_ft          REAL,
  rate           REAL,
  fixed_item     INTEGER NOT NULL DEFAULT 1,
  amount         REAL NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT
);

CREATE TABLE invoice_payment (
  id                 TEXT PRIMARY KEY,   -- UUID
  invoice_id         TEXT NOT NULL REFERENCES invoice(id) ON DELETE CASCADE,
  payment_method     TEXT NOT NULL CHECK (payment_method IN ('Cash','Check','Credit Card','ACH/Bank Transfer','Other')),
  amount             REAL NOT NULL,
  date_received      TEXT NOT NULL,
  reference_number   TEXT,
  notes              TEXT,
  created_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Replaces the old stored, driftable invoice.amount_due column
CREATE VIEW invoice_balance AS
SELECT i.id AS invoice_id,
       i.total - COALESCE(SUM(p.amount), 0) AS amount_due
FROM invoice i
LEFT JOIN invoice_payment p ON p.invoice_id = i.id
GROUP BY i.id;
```

Notes: `project_id` is required (fixes Problem 2). `source_quote_id` is a real, unique FK to `quote.id`, replacing the old naked `converted_from_quote_number` bigint (fixes Problem 3) — direction chosen so invoice points to quote (not the reverse), since a quote can exist without ever becoming an invoice, but an invoice created from a quote always has the quote first. All `bill_from_*` columns are dropped entirely — sourced from `company_profile` at PDF-render time instead (fixes Problem 7, eliminates per-row drift risk). `amount_due` is no longer stored — computed via `invoice_balance` (nothing else mutated it independently in the old schema, so this removes a class of bugs for free).

### 11.3 Decision: Merge Proposal into Quote

**Recommendation: `proposal`, `proposal_template`, and `proposal_variable` are not carried into the v1 schema.** "Proposal" becomes a **PDF export style** for a quote (e.g. "Simple Quote" vs. "Full Proposal," both rendered from the same `quote` + `quote_line_item` data), not a separate database entity.

Justification:
- The current codebase already shows drift away from the template system: the newer shingle-selection fields were added directly to `quote`, bypassing `proposal_variable` entirely.
- `proposal_template.google_doc_id` makes the old proposal system dependent on Google Workspace — a Phase 3, separately-paywalled add-on. Shipping a v1 feature that can't fully work until an optional future purchase is a bad experience.
- The proposal funnel (Draft → Sent → Viewed → Accepted/Declined → Expired) is functionally identical to what `quote_status` already needs to do. Collapsing to one status funnel on `quote` removes a duplicate, loosely-linked parallel system.
- Phase 3 can reintroduce a distinct Google-Docs-generated proposal artifact later (linked via a future `connected_accounts` table) as an export/integration layered on top of an already-complete `quote`, without touching the core schema again.

### 11.4 Decision: Lightweight Project Tasks, Not Scheduling

`project_task` is included in v1 as a flat, single-user checklist per project (e.g. "Order materials," "Schedule crew," "Final walkthrough," "Send invoice"). This is justified because the product pitch is "manage their jobs," and the Dashboard's central feature — "what needs attention" — needs something concrete to surface beyond document status.

**Explicitly out of scope for v1, as a deliberate boundary, not an oversight**: crew/personnel assignment (needs multi-user, Phase 2+), a calendar/Gantt scheduling engine, and material inventory/usage tracking. These are each a distinct product surface deserving their own future scoping, not a bolt-on table here.

### 11.5 Tables Dropped from v1

| Old table | Disposition |
|---|---|
| `customer`, `customer_type` | Replaced by `contact`, `contact_type` |
| `proposal`, `proposal_template`, `proposal_variable` | Merged into `quote` (§11.3) |
| `quote_request`, `quote_request_status` | No public-facing lead form in this product |
| `connected_accounts` | Deferred to Phase 3 |
| `project_assignee` | Deferred to Phase 2/3 |

## 12. Tech Stack & Architecture

- **Shell**: Tauri 2.x, Rust backend. The existing React frontend (Vite, React 18, Radix/shadcn, Tailwind, React Query, React Hook Form/Zod) is reused, with `src/services/api/*` (currently direct `@supabase/supabase-js` calls) replaced by Tauri IPC (`invoke()`) calls into Rust commands that talk to SQLite. React Query's caching/mutation patterns carry over unchanged — only the query functions' transport changes.
- **Local DB location** (via Tauri's `path::app_data_dir()`, resolved automatically per OS): Windows `%APPDATA%\<bundle-id>\app.db`; macOS `~/Library/Application Support/<bundle-id>/app.db`.
- **DB access**: recommend `sqlx` (async, compile-time-checked queries, built-in `sqlx migrate` tooling) for schema versioning across shipped app updates. `rusqlite` is a simpler, synchronous fallback if preferred — treat as a Phase 0 implementation decision, not fixed here.
- **Migrations**: numbered SQL migration files, mirroring the existing `supabase/dev/*.sql` convention already used in this repo, applied automatically on startup when the DB's schema version is behind the app's.
- **PDF generation**: `@react-pdf/renderer` (already a dependency, already powering the quote/invoice/proposal PDF component trees) runs as pure client-side React — no Node-specific APIs — so it should run unmodified inside the Tauri webview. **Confirm this early in Phase 0 as a smoke test**, since it's load-bearing for reusing most of the existing PDF code. Saving the generated PDF uses Tauri's file-system/save-dialog plugins in place of a browser download — the one meaningful change to the existing preview/download dialog components.
- **Licensing/activation** (one-time purchase, no runtime server dependency):
  1. Purchase issues a license key via a lightweight external fulfillment service (e.g. Stripe + a minimal license-issuing endpoint, or a third-party licensing service).
  2. First run: one network call validates + activates the key, binding it to a local machine fingerprint, cached in the `license` table.
  3. From then on the app is fully usable offline.
  4. Optional periodic re-validation (e.g. every 30 days, best-effort) — but the app must **never hard-block usage** on a failed check; degrade to a soft warning instead, since locking a user out during an outage would contradict the local-first pitch.
  5. Cloud sync / Google / Microsoft entitlements (Phase 2/3) are checked the same way but require periodic (not one-time) validation, since they're recurring billing — the one place *some* ongoing network dependency is acceptable, and only for those specific optional features.

## 13. Migration & Future Sync Considerations

- The UUID-PK decision in [§11.1](#111-design-principles) is the main piece of prep work done now specifically to de-risk Phase 2 — it avoids a breaking primary-key migration when multiple local databases need to sync into a shared Supabase backend.
- **Conflict resolution strategy is explicitly not decided here** — left as an open question for the Phase 2 PRD, with two candidates to evaluate then: (a) last-write-wins via `updated_at` timestamps (fast to build, reasonable for a tool where true concurrent edits by the same business are rare), or (b) an operation-log/CRDT approach (more robust, much more complex, only justified if Phase 2 also ships true multi-user concurrent editing). Default toward (a) unless multi-user concurrency is in Phase 2's scope.
- Per-install-customizable lookup tables (project statuses, contact types, etc.) will need a reconciliation strategy once a business's data can live on more than one device — noted as an open question, not solved here.

## 14. Non-Functional Requirements

- **Offline-first**: every core workflow (§9) must function with no network connection, indefinitely, after initial license activation.
- **Data durability**: local backup/export and restore are first-class Settings features, not an afterthought — the entire business record lives in one file with no server-side copy in v1.
- **Performance**: cold start should feel instant for realistic data volumes (hundreds of projects); PDF generation should complete in well under a second.
- **Windows/macOS parity**: identical feature set and UI on both platforms.
- **At-rest encryption**: the SQLite file is unencrypted in v1 — noted as a call-out for consideration, not a committed v1 requirement (see [§15](#15-open-questions--risks)).

## 15. Open Questions & Risks

- Where/how the license-check server is hosted, and its cost/ops overhead relative to a one-time-purchase product.
- Code-signing and notarization costs and process for both Windows and macOS distribution.
- Whether `project.street_address` being required is too rigid for an edge case not yet identified — revisit based on early user feedback.
- Whether dropping quote-level custom-address fields (superseded by the project's required address, §11.2) needs a future per-quote override — revisit if beta feedback surfaces a real case (e.g. a quote for work at a different address than the project's primary address).
- Whether SQLite at-rest encryption (e.g. SQLCipher) is worth the added complexity for v1 given the "privacy-focused" positioning, or reasonable to defer since the OS-level file permissions already restrict access to the local user account.

## 16. Appendix: Glossary

- **Project** — the central hub entity representing one job/piece of work at one property; owns quotes, invoices, contacts, and tasks.
- **Quote** — a priced offer for work, scoped to a project; can be exported as either a simple quote or a full multi-page proposal PDF.
- **Invoice** — a bill for work performed, scoped to a project, optionally generated from a quote; tracks payments against a computed balance.
- **Contact** — a person or business associated with one or more projects, in one or more roles (property owner, GC, insurance adjuster, etc.).
- **Proposal** — in this product, not a separate database entity; a presentation style for exporting a quote as a PDF (see §11.3).
- **License** — the local record of this install's one-time-purchase activation state.
- **Company Profile** — the single record of the installing contractor's own business identity, used to brand PDFs and replace what was previously hardcoded.
