# Credupe API Workspace Guide

This file provides a complete overview of the directory structure, database integration, modules, and execution details for the backend service located in the [api](file:///E:/amar/development/Credupe24April/api) directory.

---

## 📂 Directory Structure Outline

```
api/
├── .dev.vars                  # Local environment variables (Cloudflare bindings)
├── .gitignore                 # Excluded directories (node_modules, build cache)
├── .wrangler/                 # Cloudflare Wrangler local environment state
├── drizzle.config.ts          # Schema layout configuration for Drizzle Migrations
├── migrations/                # Generated SQL migration history files
├── package.json               # Node workspace package setup, commands, and script dependencies
├── tsconfig.json              # TypeScript compilation config
├── wrangler.api.jsonc         # Wrangler config file specifying D1 DB Bindings and variables
└── src/                       # API application source code
    ├── db/                    # Drizzle ORM database context
    │   └── schema.ts          # Central SQL tables schemas definitions
    ├── lib/                   # Base shared utility classes and formats
    │   ├── envelope.ts        # Uniform JSON response structures
    │   ├── ids.ts             # Web Crypto random ID generators (prefixed IDs)
    │   ├── jwt.ts             # JWT encoding/decoding auth tokens helper
    │   └── password.ts        # BCrypt hashing algorithms for secure database storage
    ├── middleware/            # Custom application middlewares
    │   └── auth.ts            # Hono JWT authentication validator wrapper
    ├── modules/               # API route submodules / endpoint handlers
    │   ├── analytics.ts       # Portal statistics calculations
    │   ├── auth.ts            # User and partner credentials onboarding / validation logic
    │   ├── customers.ts       # Customer metadata endpoints
    │   ├── documents.ts       # File bucket signatures & document upload controls
    │   ├── feedback.ts        # Client feedback submissions & rating storage
    │   ├── health.ts          # Basic API uptime checks
    │   ├── leads.ts           # Customer leads management (CRUD and transitions)
    │   ├── leads-report.ts    # Cron / Scheduled lead report processor
    │   ├── lenders.ts         # List and edit credit partners
    │   ├── loan-applications.ts # Submit/transition loan applications
    │   ├── loan-products.ts   # Product parameters & eligibility rules
    │   ├── notifications.ts   # In-app push and user notifications
    │   ├── partner-dashboard.ts # Analytics summary engines for agents
    │   ├── partner-onboarding.ts # Multi-step partner profiles verification
    │   ├── partners.ts        # Partner database operations
    │   ├── quotes.ts          # Formulate custom rates proposals
    │   ├── sms-config.ts      # Multi-country SMS route profiles configuration
    │   ├── sms-providers.ts   # Integrations for messaging APIs (Twilio, Msg91, etc.)
    │   ├── sms-router.ts      # Fail-safe failover delivery logic
    │   ├── sms-types.ts       # SMS types definitions
    │   ├── sms-utils.ts       # String validations, backoffs, country codes
    │   ├── sms.ts             # Base SMS senders controllers
    │   ├── ui-config.ts       # Dynamically serve UI configurations and styling
    │   └── users.ts           # Admin system controls and user list
    ├── env.ts                 # Declarations of bindings (D1 DB, KV, Buckets)
    └── index.ts               # Core Hono server initialization & routing table mounts
```

---

## ⚡ Core Features & Systems

### 1. Cloudflare Workers + D1 DB Integration
*   The backend is built as a Cloudflare Worker utilizing the **Hono** framework for high-performance HTTP routing.
*   It accesses database layers using **D1 SQL Database** combined with **Drizzle ORM** mappings. 
*   **[schema.ts](file:///E:/amar/development/Credupe24April/api/src/db/schema.ts)** contains table schemas for:
    *   `users`, `partners`, `customers` — identity management.
    *   `leads`, `leadFollowUps` — pipeline tracking.
    *   `loanApplications`, `loanProducts`, `lenders`, `quotes` — loan origination engine.
    *   `documents`, `notifications`, `feedback`, `smsLogs` — operational support.

### 2. Multi-Provider Resilient SMS Routing Engine
To secure OTP validation globally, the system contains an intelligent SMS delivery pipeline:
*   **[sms-router.ts](file:///E:/amar/development/Credupe24April/api/src/modules/sms-router.ts)**: When sending a message, it detects country dial codes and resolves a priority list of providers (e.g. `['msg91', 'twilio']`). It sequentially attempts delivery using a retry-backoff algorithm (`retryWithBackoff`) and automatically falls back to secondary networks if the primary provider fails.
*   **[sms-providers.ts](file:///E:/amar/development/Credupe24April/api/src/modules/sms-providers.ts)**: Standardized drivers for multiple providers.
*   **[sms-config.ts](file:///E:/amar/development/Credupe24April/api/src/modules/sms-config.ts)**: Configures mapping priorities and regulatory headers (like DLT template templates in India or SSIR tags in Singapore).

---

## 📄 Core Configurations

*   **[wrangler.api.jsonc](file:///E:/amar/development/Credupe24April/api/wrangler.api.jsonc)**
    *   **Purpose**: Local and cloud wrangler runtime settings. Defines binding variables like `DB` (the Cloudflare D1 identifier), environment configurations, custom CORS settings, and local database ports.
*   **[drizzle.config.ts](file:///E:/amar/development/Credupe24April/api/drizzle.config.ts)**
    *   **Purpose**: Tells Drizzle CLI where the schemas live (`./src/db/schema.ts`) and where generated SQL schema migration files should be saved (`./migrations`).

---

## 🛠️ Local Development & Running

### Starting API Server Locally
The API is started using wrangler dev command. To bind the interface locally to allow connections from mobile devices or other development clients, execute:

```powershell
# Open API folder
cd api

# Run Cloudflare local emulator
npx wrangler dev --config wrangler.api.jsonc --ip 0.0.0.0
```

### Database Operations
*   Create migrations: `npm run db:generate` or `npx drizzle-kit generate`
*   Apply local migrations: `npx wrangler d1 migrations apply DB --local`
*   Open Drizzle database studio: `npm run db:studio`
