# Preview restored (2026-01-23)
- Cloned `github.com/maheshmehta79/CredupeEmergent` into `/app`, installed Postgres 15 + Redis 7 inside the container, ran `prisma db push` + `prisma:seed`, installed backend (NestJS) + frontend (Next.js 15) deps via yarn.
- Backend launcher (`server.py`) spawns NestJS on :4000 and proxies supervisor's :8001 → `/api/v1/health` returns `{status:ok, db:ok, cache:ok}` externally on `credupe-staging.preview.emergentagent.com`.
- Frontend Next.js renders the full Credupe home/login/dashboard UI on :3000 (verified via screenshot). `REACT_APP_BACKEND_URL` + `NEXT_PUBLIC_BACKEND_URL` point to the current preview domain.


# Credupe — PRD & Project Memory

## Original problem statements (most recent last)
1. *"share the frontend from insight-engine-59"* → Next.js port as `credupe59`.
2. *"Build a production-grade backend in Node.js (NestJS + TypeScript)"* → full MVP delivered.
3. *"go as per your recommendation"* → pre-qualified offers (quote engine) + frontend API client.
4. *"we will use database as Cloudflare. rest go as per your recommendation"* → shareable quotes + real S3/R2 SDK drop-in + Cloudflare-aware env + surgical additive frontend wiring.

## What's live (2026-04-22)
### Frontend — Night Mode (Exact Replica) — 2026-04-22
- CSS variable palette maps to the user-approved reference: neon primary `#C6FF4D` on `#0B0F14 → #1A221A` gradient, card surface `#161C24`, border `#232A33`, text secondary `#A1A8B3`.
- `ThemeProvider` + `ThemeToggle` with pre-hydration `<Script strategy="beforeInteractive">` so dark mode never flashes through light on reload.
- `globals.css` defensive overrides keep existing markup intact (no component rewrites):
  - `bg-primary/*` icon chips remap to `bg-card` so neon icons stay readable.
  - `bg-purple-deep` highlight cards become neon-primary CTA cards in night mode.
  - Purple gradient bands (`BecomePartner`, `StatsSection`'s `gradient-purple-band`) flip `text-primary-foreground`/`text-background` to white and translate `bg-white` pill buttons into neon pills.
  - `bg-accent:has(> .text-primary)` rescue for Calculator type-tab icon chips (neon-on-neon collision).
- Regression-verified: light mode UI is unchanged; 6+ dark-mode routes audited via screenshots (Home, Calculators, Login, Partner Gateway, Credit Score, Footer).

## What's live (2026-01-22)

### Frontend — `credupe59` (Next.js 15, App Router) — `/app/frontend`
- Full upstream port of the Vite Credupe app (40 routes), compat shim for `react-router-dom`, client-only render.
- **`src/lib/credupe-api.ts`** — typed fetch client for the NestJS backend with auto-refresh on 401.
- **Hybrid auth (`hooks/useAuth.tsx`)** — Credupe NestJS session first, Supabase fallback. Exposed `authSource` (`"credupe" | "supabase" | null`).
- **`Login.tsx`** (UI unchanged) — tries `credupeApi.auth.register` / `credupeApi.auth.login` first, falls back to Supabase. Verified end-to-end: seeded customer logs in via UI, JWT lands in localStorage.
- **`CustomerDashboard.tsx`** (UI unchanged) — Applications tab fetches live data from `credupeApi.applications.mine()` when `authSource === "credupe"`, falls back to the original mock otherwise. Verified: 20 real `CRD-*` refs rendered (incl. a fully DISBURSED case showing the complete 5-stage progress bar).

### Backend — Credupe API (NestJS 10 + TypeScript) — `/app/backend`
- **Tech**: Node 20 · NestJS 10 · Prisma 5 · PostgreSQL 15 · Redis 7 · BullMQ · JWT+refresh rotation · Helmet · Pino · Swagger · Docker.
- **Cloudflare-ready**: `DATABASE_URL` goes through **Cloudflare Hyperdrive → hosted Postgres** in prod (docs in `.env`, zero code change). **Storage** uses AWS SDK v3 (`@aws-sdk/client-s3` + `s3-request-presigner`); plug Cloudflare **R2** creds into `S3_ENDPOINT/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY/S3_BUCKET` and real presigned URLs kick in automatically.
- **RBAC + optional-auth** guard: `@Public()` routes now populate `req.user` when a valid Bearer token is present, so "anonymous-by-default, personalised-when-logged-in" endpoints (quotes, public share) work.
- **Modules**: `auth`, `users`, `customers` (PAN/Aadhaar masked), `partners` (KYC), `lenders`, `loan-products` + Redis-cached eligibility, `loan-applications` (LEAD→LOGIN→DOC_PENDING→UNDER_REVIEW→APPROVED→DISBURSED state machine), `leads` (+ bulk 2000 rows), `documents` (real S3/R2 SDK or mock), `notifications`, `analytics`, `audit`, `health`, `quotes` (**+ `POST /quotes/:id/share` + `GET /quotes/s/:slug` — 7d TTL, PII stripped on public view**).
- **Response envelope**: `{ success, data, error }` everywhere; stable upper-snake-case error codes (`NO_MATCHING_OFFER`, `PAYLOAD_TOO_LARGE`, `UNIQUE_VIOLATION`).
- **Supervisor compat**: `/app/backend/server.py` Starlette launcher spawns NestJS on 4000 and reverse-proxies 8001 → no supervisor changes.
- **Deliverables**: Prisma schema (17 tables), migrations, seed (3 users, 5 lenders, 10 products), Dockerfile + compose, Postman collection, README, `.env` template with Cloudflare notes.

### Testing
- **Iteration 5: 65/65 PASS** · 0 critical · 0 high · 0 regressions across 5 suites (core + hardening + quotes + optional-auth guard + shareable-quotes/storage).
- Swagger exposes **45 paths** at `/api/v1/docs`.

## Seeded accounts (`/app/memory/test_credentials.md`)
| Role | Email | Password |
|------|-------|----------|
| ADMIN | `admin@credupe.local` | `Admin@12345` |
| CUSTOMER | `customer@credupe.local` | `Customer@123` |
| PARTNER | `partner@credupe.local` | `Partner@123` |

## What's mocked
- **SMS** — `devOtp` returned in response when `NODE_ENV != production`.
- **Email** — stored-only notifications.
- **S3 / R2** — real SDK path is code-complete; currently mocked because `S3_*` env is empty.
- **Lender push/webhooks** — `integrationMode: "mock"` on all lenders.

## Cloudflare production path (no code change required)
- **Database**: create a Cloudflare Hyperdrive config in front of any Postgres host (Neon, Supabase, RDS) → paste its connection string into `DATABASE_URL`. Prisma is transparent.
- **Object storage**: create a Cloudflare R2 bucket + API token → set `S3_ENDPOINT=https://<acc>.r2.cloudflarestorage.com`, `S3_REGION=auto`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. `StorageService` auto-detects and switches to real presigning.
- **Workers / Pages (optional)**: serve the Next.js frontend from Cloudflare Pages; the NestJS backend stays on the node runtime behind the preview URL.

## Backlog
- **P1** — wire Calculators "Check Eligibility" CTA on each loan-page calculator to `credupeApi.quotes.create` so quotes are generated from every loan landing page.
- **P1** — rewire Partner Dashboard to `credupeApi.leads.list` / `create`.
- **P2** — commission payout job · lender webhook round-trip · drop-off funnel analytics · Supabase → Postgres migration script · broader unit tests.
- **P3** — normalise remaining 201s to 200 (`/auth/register`, `/documents/presign`) · coerce Prisma Decimals to numbers · strip empty `Authorization: Bearer` header at proxy.

## Personas
- **Retail borrower (CUSTOMER)** — browses products, receives pre-qualified quotes, **shares quotes** with family, applies, tracks status.
- **Partner / DSA (PARTNER)** — creates leads (single + bulk), tracks conversion, earns commissions.
- **Admin** — manages lenders, products, KYC, applications, funnel analytics.
