# 01 — Milestone 1 Scope: Foundation (safe-to-build-now phase)

This is the only milestone in scope right now. Do not proceed to Milestone 2+ tasks (listed at the bottom, for context only) without explicit go-ahead.

## Why this milestone is "safe" to build before customer feedback
These tasks don't depend on what the manual concierge pilot teaches us about customer preferences — they're infrastructure any version of this product needs. Milestone 2+ (summarization format, matching logic, capability statement structure, billing tiers) should wait for real pilot feedback so we don't build the wrong thing twice.

## Task list, in order

### 1. Repo scaffold
- Initialize a workspace (npm/pnpm workspaces) with the structure defined in `CLAUDE.md`.
- Set up `apps/web` as a Next.js (App Router, TypeScript) project.
- Set up `apps/worker` as a plain Node/TypeScript project (no framework needed yet — this will run as a scheduled script).
- Add root-level `.gitignore` covering `node_modules`, `.env*` (except `.env.example`), build artifacts.
- Add `.env.example` at the root (see the version already provided — extend it if new variables are needed).
- Commit: "Scaffold monorepo structure for web and worker apps"

### 2. Supabase connection + auth
- Create the Supabase client setup in `packages/db`.
- Set up Prisma with a `schema.prisma` pointing at the Supabase Postgres connection string.
- Implement basic auth (email/password or magic link — magic link is simpler and cheaper to support) using Supabase Auth in `apps/web`.
- Commit: "Add Supabase auth and Prisma connection"

### 3. Database schema (initial)
Minimum tables needed for this milestone (expand later, don't over-build now):
- `users` — id, email, created_at, naics_codes (array or join table — simple array is fine for now), set_aside_status, keywords
- `opportunities` — id, notice_id (unique, from SAM.gov), title, naics_code, set_aside, deadline, raw_description, posted_date, created_at
- Do **not** create `opportunity_summaries`, `user_matches`, `capability_statements`, or any billing-related tables yet — those belong to later milestones.
- Commit: "Add initial Prisma schema for users and opportunities"

### 4. SAM.gov API client
- Build `packages/sam-gov-client` — a typed client wrapping the SAM.gov Contract Opportunities API.
- Must support: filtering by NAICS code, pagination, and basic error handling/retry on rate limits.
- Register for a SAM.gov API key first (https://sam.gov/data-services) if not already done — it's free.
- Write a small test script that fetches a real page of opportunities for one NAICS code (e.g., 541512) and logs the results, to confirm the integration actually works end-to-end.
- Commit: "Add SAM.gov API client with NAICS filtering and pagination"

### 5. Nightly ingestion job (no summarization yet)
- Build `apps/worker/ingest.ts` — a script that:
  1. Reads distinct NAICS codes currently tracked across all users (or a hardcoded test list for now, since there are no real users yet)
  2. Calls the SAM.gov client for each
  3. Dedupes against existing `notice_id`s in the `opportunities` table
  4. Inserts new opportunities as raw rows (no AI summarization — that's Milestone 2)
- This can run manually via `npm run ingest` for now — don't set up the actual cron/scheduler infrastructure (Railway/Fly.io deployment) until this milestone's core logic is proven locally.
- Commit: "Add nightly ingestion job for SAM.gov opportunities"

### 6. Basic README
- Write a short `README.md`: what the project is (one paragraph), how to run it locally, current status (Milestone 1 in progress).
- Commit: "Add project README"

## Definition of done for Milestone 1
- `npm run ingest` (or equivalent) successfully pulls real opportunities from SAM.gov for at least one NAICS code and stores them in the database, with no duplicates on a second run.
- Auth works end-to-end (a user can sign up/log in) even though there's no real dashboard content yet.
- Everything above is pushed to `main` on GitHub in multiple small commits, each with the `Co-authored-by: Claude <noreply@anthropic.com>` trailer.

## Out of scope for this milestone (do not start these)
- Claude API summarization pipeline
- Matching engine / dashboard UI
- Capability statement generator
- Paddle billing integration
- Email digest
- Production deployment/hosting setup (local dev is fine for now)
