# 2026-04-23 (late PM) — Cloudflare Workers + D1 backend scaffold
### Created new sibling project at `/app/cloudflare-backend/`
Full backend rewrite targeting Cloudflare Workers + D1, living alongside (NOT replacing) the current NestJS preview so nothing breaks.

- **Stack**: Hono 4 + Drizzle 0.36 + D1 (SQLite) + HS256 JWT (hand-rolled, no external JOSE lib) + bcryptjs + Zod.
- **Schema parity**: 17 tables, 1:1 with the original Prisma schema. Postgres enums → CHECK constraints. `Decimal(14,2)` → `INTEGER paise` (×100). `JSONB` → `TEXT` + JSON.parse/stringify. Migration SQL at `migrations/0001_initial.sql`.
- **API parity**: 13 modules / ~45 endpoints matching the NestJS surface — auth (register, login, refresh, logout, me, otp), users, customers, partners, lenders, loan-products (+ /eligibility), quotes (create/get/share/public-slug), loan-applications (CRUD + /:id/transition), leads (+ bulk, follow-ups, reassign), documents (presign, register, verify, optional R2 binding), notifications, analytics (admin/funnel, partner/summary), health.
- **Response envelope preserved**: same `{ success, data, error }` shape the frontend already consumes — **zero frontend changes needed**.
- **Auth**: JWT access + rotating refresh token (D1-backed refresh store with SHA-256 hashing). `requireAuth` / `optionalAuth` / `requireRole` middleware.
- **Seed**: `scripts/seed.sql` creates the 3 demo users (`admin|customer|partner@credupe.local`) with **verified** bcrypt hashes (tested via `bcrypt.compareSync` → OK for all 3), 5 lenders, 10 loan products.
- **Dropped (per user instruction)**: Redis rate-limiting, BullMQ jobs, eligibility cache.
- **D1 binding wired** in `wrangler.toml` with the user-provided ID `268e6760-85d8-4f50-9ea6-5c1fd9d28de9` and `database_name = "credupe"`.

### Verified locally
- `npx tsc --noEmit` → **0 errors** across the whole project
- `sqlite3` apply migration → all 17 tables created, all indexes applied
- Seed → 3 users, 5 lenders, 10 products, 1 cust / 1 partner profile
- `npx wrangler dev --local` → **Worker booted**, D1 bound via Miniflare, `GET /api/v1/health` returned `{"success":true,"data":{"status":"ok","db":"ok"}}`

### What the user does next (per their "we'll deploy ourselves" instruction)
- Install deps, `wrangler login`, `wrangler d1 migrations apply credupe --remote`, seed, set two JWT secrets, `wrangler deploy`. Full copy-pasteable steps are in `cloudflare-backend/README.md`.
- Frontend already calls `${NEXT_PUBLIC_BACKEND_URL}/api/v1/…` — just set the Pages env var to the Worker URL and they're done.
- For Cloudflare Pages deploy of the Next.js frontend: `@cloudflare/next-on-pages` adapter command snippet included in the README.

### Files created (25 files, ~2100 LOC)
```
cloudflare-backend/
  wrangler.toml, package.json, tsconfig.json, drizzle.config.ts, .gitignore, README.md
  migrations/0001_initial.sql
  scripts/seed.sql
  src/index.ts, env.ts
  src/db/schema.ts
  src/lib/{envelope,ids,jwt,password}.ts
  src/middleware/auth.ts
  src/modules/{auth,health,users,customers,partners,lenders,loan-products,quotes,
               loan-applications,leads,documents,notifications,analytics}.ts
```


# 2026-04-23 (PM) — Code-review fixes, surgical pass
### Applied
- **`src/app/layout.tsx` — removed `dangerouslySetInnerHTML`**: theme-preload script now served from `public/theme-preload.js` via `<Script src="…" strategy="beforeInteractive">`. Zero inline-script surface, same "no-theme-flash" guarantee. Verified: `html.className` = `"light"`, `colorScheme` = `"light"` on first paint.
- **`src/hooks/useAuth.tsx` — stale-closure bug**: the Supabase `onAuthStateChange` callback captured `authSource` at effect-setup time and could clobber a live Credupe session. Added `authSourceRef` that mirrors the latest value.
- **`src/lib/credupe-api.ts` + `src/components/ThemeProvider.tsx` — empty catch blocks**: both now log via `console.warn` in non-production only (prod stays silent — these paths are genuinely non-fatal: logout server call, localStorage quota).
- **`src/screens/NotFound.tsx`**: removed stray `console.error` in prod; path now rendered inline in the 404 copy for debuggability.
- **`src/screens/ProductCalculator.tsx`**: `calculatorProducts.filter().slice()` hoisted into `useMemo([slug])` so slider movement doesn't re-filter the "other calculators" grid on every render.

### Investigated but skipped (false positives or out-of-scope)
- **localStorage → httpOnly cookies**: architectural migration touching NestJS auth + CORS + Supabase fallback. Flagged to the user with explicit scope options; not applied without sign-off.
- **"CustomerDashboard missing 10+ deps"**: all referenced names (`LOAN_TYPE_LABEL`, `STATUS_TO_STAGE`, `formatAmount`, `mockApplications`) are module-level constants — adding them to the dep array would be noise, not a fix. Current `[authSource]` is correct.
- **Calculator useMemo "missing emi/loan deps"**: `emiVal`, `n`, `r`, `maxEmi`, `maxLoan` are **locals** inside the memo body — not closed-over values. Static analyzer false positive.
- **Python `is` vs `==` (33 instances)**: every occurrence in `server.py` / tests is `is None` / `is True` / `is not None`, which are correct PEP-8 idioms. No fix needed.
- **Component-splitting of 400+ line loan pages** & **CreduAIChat complexity**: pure maintainability refactors with regression risk and zero correctness/UX impact. Deferred.
- **63 "array index as key" instances**: most are on static, never-reordered arrays (`features.map((f, i)`) where the index is stable. Fixing blindly would add churn without a real bug. Can revisit per-file if reordering is ever introduced.

### Regression verified
- `/`, `/login`, `/personal-loan`, `/calculators`, `/calculator/personal-loan-emi-calculator` → 200 with CSS.
- `/nonexistent-xyz` → 404.
- Login email field retains focus through full continuous typing.
- Theme preload static file (`/theme-preload.js`) serves 509 bytes, applied before hydration.


# 2026-04-23 — Perf + Login focus fix + CTA rollout
### Fixed
- **Login email-input focus bug**: `InputField` was defined inside the `Login` component, so React remounted the `<input>` every keystroke. Extracted to a module-level `memo`-wrapped component in `src/screens/Login.tsx`. Verified via Playwright — typing `test@credupe.com` now keeps focus.
- **Duplicate uppercase Pages-Router routes** (`/PersonalLoan`, `/HomeLoan` …): Next.js was auto-routing `src/pages/*.tsx` (which were just React components imported via `@/pages/…`) and serving them without the App-Router CSS. Renamed `src/pages/` → `src/screens/`, added a targeted TS path alias `@/pages/* → ./src/screens/*` so existing imports keep working, and now only the App-Router routes (`/personal-loan`, `/home-loan`, …) exist.

### Added
- **"Apply Now" CTA on every bank-listing row** of all loan product pages — `PersonalLoan`, `HomeLoan`, `GoldLoan`, `UsedCarLoan`, `MicroLoan`, `CarLoan`, `LoanAgainstProperty` (BusinessLoan & TwoWheelerLoan already had them). CTAs include `data-testid="apply-now-<bank-slug>"` and link to `/login` → the Credupe quote/application funnel.

### Performance (biggest wins)
- Switched frontend supervisor from **`next dev`** → **`next start`** with a full production build. TTFB dropped from ~3-5s (dev-mode on-demand compilation) to **100-170ms**; static HTML is now pre-rendered for 40+ routes.
- `next.config.js` hardened: `compress: true`, `poweredByHeader: false`, `productionBrowserSourceMaps: false`, `optimizePackageImports: ["lucide-react", "date-fns", "recharts", "framer-motion"]` to tree-shake large libs.
- Real-world DOMContentLoaded on `/personal-loan` measured at **126 ms**, full load at **346 ms**.

### Trade-off flagged for the user
- In production mode, frontend code edits require a rebuild (`yarn build && sudo supervisorctl restart frontend`). Hot reload only fires in `yarn dev`. For dev workflow, the `dev` script remains available.


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
