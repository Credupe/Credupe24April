# Credupe API — Cloudflare Workers + D1

Full-stack-compatible rewrite of the Credupe NestJS backend, targeting
**Cloudflare Workers** (compute) + **D1** (SQLite database). No Redis, no
BullMQ, no Node.js long-running processes.

## Stack

| Layer        | Tech                                                |
|--------------|-----------------------------------------------------|
| Runtime      | Cloudflare Workers (V8 isolates)                    |
| Framework    | [Hono 4](https://hono.dev/) (Web-standards-native)  |
| ORM          | [Drizzle 0.36](https://orm.drizzle.team) (SQLite)   |
| Database     | Cloudflare D1 (ID `268e6760-85d8-4f50-9ea6-5c1fd9d28de9`) |
| Auth         | HS256 JWT (access + refresh, rotating)              |
| Password     | `bcryptjs` (works in Workers, salt rounds 10)       |
| Validation   | Zod 3                                               |
| Storage (opt)| Cloudflare R2 (bind as `DOCS`)                      |

## Layout

```
cloudflare-backend/
├── wrangler.toml           ← deploy config (incl. D1 binding)
├── drizzle.config.ts       ← schema-introspection config
├── migrations/
│   └── 0001_initial.sql    ← full DDL (17 tables)
├── scripts/
│   └── seed.sql            ← demo admin/customer/partner + 5 lenders + 10 products
├── src/
│   ├── index.ts            ← Hono app, route mounting
│   ├── env.ts              ← AppEnv type
│   ├── db/schema.ts        ← Drizzle schema (mirrors the Prisma models)
│   ├── lib/                ← jwt, password, ids, envelope
│   ├── middleware/auth.ts  ← requireAuth / optionalAuth / requireRole
│   └── modules/            ← one Hono sub-router per resource
│       ├── auth.ts         ← register, login, refresh, logout, me, otp
│       ├── health.ts       ← /health
│       ├── users.ts        ← /users/me, [admin] list
│       ├── customers.ts    ← /customers/me
│       ├── partners.ts     ← /partners/me
│       ├── lenders.ts
│       ├── loan-products.ts       ← list + /eligibility
│       ├── quotes.ts              ← create, get, share, public-slug, apply
│       ├── loan-applications.ts   ← CRUD + /:id/transition
│       ├── leads.ts               ← CRUD, bulk, follow-ups, reassign
│       ├── documents.ts           ← presign/register/verify (R2 optional)
│       ├── notifications.ts
│       └── analytics.ts           ← admin/funnel, partner/summary
└── README.md (this file)
```

## API surface

All responses use a consistent envelope:
```json
{ "success": true,  "data": { ... }, "error": null }
{ "success": false, "data": null,    "error": { "code": "...", "status": 401, "message": ["..."] } }
```

Public (no auth): `GET /api/v1/health`, `POST /api/v1/auth/{register,login,otp/request,otp/verify}`, `GET /api/v1/loan-products`, `POST /api/v1/loan-products/eligibility`, `POST /api/v1/quotes`, `GET /api/v1/quotes/s/:slug`, `GET /api/v1/lenders*`.

Authenticated (Bearer access token): everything else.
Role-gated (`ADMIN`/`PARTNER`): lead management, application transitions, admin listings, analytics admin endpoints.

## Deploy (step-by-step)

> All commands run from inside `/cloudflare-backend/`.

**1. Install deps**
```bash
npm install
# (or `yarn` / `pnpm install` — lockfile is yarn in this scaffold)
```

**2. Log in + sanity-check the D1 DB**
```bash
npx wrangler login
npx wrangler d1 list
```
If you don't see a DB named `credupe`, either create it:
```bash
npx wrangler d1 create credupe
```
…then update `database_id` in `wrangler.toml` to match the new ID, or rename the binding in `wrangler.toml` to match the existing DB name shown in `d1 list`. The pre-filled `database_id` is the one you shared: `268e6760-85d8-4f50-9ea6-5c1fd9d28de9`.

**3. Apply the migration**
```bash
npx wrangler d1 migrations apply credupe --remote
# (for local dev against a shadow DB: `--local` instead of `--remote`)
```

**4. Seed demo data**
```bash
npx wrangler d1 execute credupe --remote --file=./scripts/seed.sql
```
This creates the three demo accounts used by your frontend login page:
- `admin@credupe.local`   / `Admin@12345`
- `customer@credupe.local` / `Customer@123`
- `partner@credupe.local`  / `Partner@123`

**5. Set secrets**
```bash
# JWT secrets (min 32 chars each — use `openssl rand -base64 48`)
npx wrangler secret put JWT_ACCESS_SECRET
npx wrangler secret put JWT_REFRESH_SECRET
```
(The Worker will fail fast at runtime if these aren't set.)

**6. Deploy**
```bash
npx wrangler deploy
```
You'll get a URL like `https://credupe-api.<your-account>.workers.dev`. The API is reachable at `<url>/api/v1/…`.

**7. Point your frontend at it**
Set `NEXT_PUBLIC_BACKEND_URL` (and `REACT_APP_BACKEND_URL` for compat) on Cloudflare Pages to the Worker URL above. The frontend code already calls `${NEXT_PUBLIC_BACKEND_URL}/api/v1/…`, so no code changes required.

## Local development

```bash
# Applies migration + seed to a local D1 shadow DB, then serves on :8787
npx wrangler d1 migrations apply credupe --local
npx wrangler d1 execute credupe --local --file=./scripts/seed.sql
npm run dev
```

Hot reload is automatic. Test with:
```bash
curl http://localhost:8787/api/v1/health
```

## Feature flag parity vs. the old NestJS backend

| Feature                              | NestJS | Workers+D1 | Notes |
|--------------------------------------|--------|------------|-------|
| REST surface / endpoint contracts    | ✅     | ✅         | Envelope shape preserved |
| JWT access + rotating refresh        | ✅     | ✅         | HS256, D1-backed refresh store |
| RBAC (CUSTOMER/PARTNER/ADMIN)        | ✅     | ✅         | `requireRole(…)` |
| Prisma / relational schema (17 tbl)  | ✅     | ✅         | Drizzle, SQLite dialect |
| Decimals (Postgres `Decimal(14,2)`)  | ✅     | ✅         | Stored as `INTEGER paise (×100)` |
| JSON columns                         | ✅     | ✅         | `TEXT` + JSON.parse/stringify |
| Rate limiting (Throttler+Redis)      | ✅     | ⚠️         | **Dropped** — re-enable via Cloudflare Rate Limiting Rules on the Worker route |
| Background jobs (BullMQ)             | ✅     | ⚠️         | **Dropped** — port to [Cloudflare Queues](https://developers.cloudflare.com/queues/) when needed |
| Eligibility-result cache (Redis)     | ✅     | ⚠️         | **Dropped** — D1 is fast enough for MVP; consider Workers KV later |
| Document storage (S3/R2)             | ✅     | ✅         | R2 binding optional; presign returns mock URLs if unbound |
| SMS / Email (Twilio / SendGrid)      | mocked | mocked     | OTP returns `devOtp` in response; wire real providers in `modules/auth.ts` |

## Troubleshooting

- **"D1_ERROR: no such table"** → you forgot to run the migration. See step 3.
- **"INVALID_CREDENTIALS" on demo login** → the seed SQL ran, but against a different DB. Double-check `database_name` in `wrangler.toml` matches the one the seed landed in.
- **bcrypt is slow** → expected ~50ms per hash on Workers. Under heavy login load, consider moving to Argon2id via `@noble/hashes`.
- **CORS errors from the frontend** → set `CORS_ORIGINS` in `wrangler.toml` (or as a secret) to `https://<your-pages-domain>,https://credupe.com` (comma-separated).

## Frontend — Cloudflare Pages

The existing Next.js 15 frontend at `/app/frontend/` will deploy to Pages via the `@cloudflare/next-on-pages` adapter. Quick steps:
```bash
cd ../frontend
npm install -D @cloudflare/next-on-pages
npx @cloudflare/next-on-pages
# deploy the .vercel/output/static dir:
npx wrangler pages deploy .vercel/output/static --project-name=credupe
```
Set env vars in the Pages dashboard:
- `NEXT_PUBLIC_BACKEND_URL=https://credupe-api.<account>.workers.dev`
- `REACT_APP_BACKEND_URL=https://credupe-api.<account>.workers.dev`
