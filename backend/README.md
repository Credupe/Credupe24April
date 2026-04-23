# Credupe Backend (NestJS + Prisma + Postgres + Redis)

Production-grade multi-loan marketplace API for the Credupe frontend.

## Tech
- **Node 20 · NestJS 10 · TypeScript · Prisma 5 · PostgreSQL · Redis · BullMQ**
- JWT (access + refresh rotation) · RBAC (Customer / Partner / Admin)
- Swagger / OpenAPI · Pino logs · Helmet · global rate limiting · centralised audit log

## Folder layout
```
src/
├── main.ts                   bootstrap (helmet, pipes, interceptors, swagger)
├── app.module.ts             root module
├── common/                   guards · filters · interceptors · decorators · DTOs
├── prisma/                   Prisma service & global module
├── redis/                    ioredis provider (cache + queues)
├── storage/                  S3/R2 presign abstraction (mock fallback)
├── audit/                    AuditService → AuditLog table
├── notifications/            in-app / email / sms dispatcher (mockable)
├── auth/                     register, login, refresh, logout, OTP
├── users/                    admin-only user mgmt + /me
├── customers/                B2C customer profile CRUD
├── partners/                 B2B partner profile + KYC
├── lenders/                  admin CRUD + public list
├── loan-products/            admin CRUD + public catalog + **eligibility engine**
├── loan-applications/        state-machine driven lifecycle
├── leads/                    partner lead + bulk upload + follow-ups
├── documents/                presigned upload → register → verify
├── analytics/                funnel + partner summaries
└── health/                   liveness (db + redis)
prisma/
├── schema.prisma             full data model
└── seed.ts                   admin + demo customer/partner + 5 lenders × 2 products
server.py                     Supervisor-compatible launcher (proxies → NestJS on :4000)
```

## Response envelope
Every response (success or error) is shaped for the frontend:
```json
{ "success": true,  "data": { ... }, "error": null }
{ "success": false, "data": null,    "error": { "code": "…", "status": 400, "message": ["…"] } }
```

## Quick start (local)
```bash
# deps
yarn install
npx prisma migrate deploy          # or: npx prisma migrate dev
yarn prisma:seed
yarn build && node dist/main.js    # NestJS on :4000
# OR run via the supervisor launcher on :8001:
sudo supervisorctl restart backend
```

## Running inside Emergent supervisor
Supervisor is locked to `uvicorn server:app --port 8001`. `server.py` is a
thin Starlette launcher that spawns NestJS (`dist/main.js` if present, else
`yarn start:dev`) on `127.0.0.1:4000` and reverse-proxies every request to
it. No supervisor config changes required.

## Key endpoints (all under `/api/v1`)
| Area | Method · Path | Role |
|------|---------------|------|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/otp/request`, `POST /auth/otp/verify`, `GET /auth/me` | Public / any |
| Users | `GET /users/me`, `GET /users`, `PATCH /users/:id/active` | Customer · Admin |
| Customer profile | `GET /customers/me`, `PUT/PATCH /customers/me` | Customer |
| Partner profile | `GET/PUT/PATCH /partners/me`, `GET /partners`, `PATCH /partners/:id/kyc` | Partner · Admin |
| Lenders | `GET /lenders`, `POST /lenders`, `PATCH/DELETE /lenders/:id` | Public · Admin |
| Loan products | `GET /loan-products`, `POST /loan-products/eligibility`, `POST/PATCH/DELETE /loan-products` | Public · Admin |
| Applications | `POST /loan-applications`, `GET /loan-applications/mine`, `GET /loan-applications`, `GET /loan-applications/:id`, `PATCH /loan-applications/:id`, `POST /loan-applications/:id/transition` | Customer · Admin |
| Leads | `POST /leads`, `POST /leads/bulk`, `GET /leads`, `PATCH /leads/:id`, `POST /leads/:id/follow-ups`, `POST /leads/:id/reassign` | Partner · Admin |
| Documents | `POST /documents/presign`, `POST /documents`, `GET /documents`, `GET /documents/:id/download`, `PATCH /documents/:id/verify` | Any · Admin |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` | Any |
| Analytics | `GET /analytics/admin/funnel`, `GET /analytics/partner/summary` | Admin · Partner |
| Health | `GET /health` | Public |

Full live docs at **`/api/v1/docs`** (Swagger UI).

## Loan-application state machine
```
LEAD → LOGIN → DOC_PENDING → UNDER_REVIEW → APPROVED → DISBURSED
                                         ↘ REJECTED
any non-terminal → CANCELLED
```
Customers can only **CANCEL**. Admins (or lender webhooks) drive every other
transition. Every change is audit-logged and triggers a notification.

## Seeded accounts
| Role | Email | Password |
|------|-------|----------|
| ADMIN | `admin@credupe.local` | `Admin@12345` |
| CUSTOMER | `customer@credupe.local` | `Customer@123` |
| PARTNER | `partner@credupe.local` | `Partner@123` |

## What's mocked
- **SMS & email providers** — no outbound calls; OTP returns `devOtp` in response when `NODE_ENV !== production`.
- **S3 / R2** — `StorageService` returns `/api/v1/documents/mock-upload/:key` URLs until `S3_*` env vars are set.
- **Lender integrations** — all lenders default to `integrationMode: "mock"`; webhook layer is interface-ready.

## Docker
```bash
docker compose up --build
# → postgres:5432, redis:6379, backend:4000
```

## Frontend integration (not yet wired)
The existing Next.js frontend currently talks to Supabase directly, so no
contract mismatch exists to preserve. Point the frontend at
`${REACT_APP_BACKEND_URL}/api/v1/*` and use the response envelope.
Adapter helpers live in `common/interceptors/response.interceptor.ts`.
