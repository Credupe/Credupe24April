/**
 * Credupe API — Cloudflare Workers entry point.
 *
 * Layout:
 *   /api/v1/health
 *   /api/v1/auth/*               — register, login, refresh, logout, me, otp/*
 *   /api/v1/users/*              — me, [admin] list
 *   /api/v1/customers/me         — GET/PATCH
 *   /api/v1/partners/me          — GET/PATCH
 *   /api/v1/lenders              — list, [:slug] detail
 *   /api/v1/loan-products        — list + POST /eligibility
 *   /api/v1/quotes               — create, get, share, public-slug, apply
 *   /api/v1/loan-applications    — CRUD + transition
 *   /api/v1/leads                — CRUD, bulk, follow-ups, reassign
 *   /api/v1/documents            — presign, register, mine, verify
 *   /api/v1/notifications        — list, read, read-all
 *   /api/v1/analytics            — admin/funnel, partner/summary
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import type { AppEnv } from "./env";
import { ok, fail } from "./lib/envelope";

import health from "./modules/health";
import auth from "./modules/auth";
import users from "./modules/users";
import customers from "./modules/customers";
import partners from "./modules/partners";
import lenders from "./modules/lenders";
import loanProducts from "./modules/loan-products";
import quotes from "./modules/quotes";
import loanApplications from "./modules/loan-applications";
import leads from "./modules/leads";
import documents from "./modules/documents";
import notifications from "./modules/notifications";
import analytics from "./modules/analytics";

const app = new Hono<AppEnv>();

// ── global middleware ────────────────────────────────────────────────────
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", async (c, next) => {
  const origins = (c.env.CORS_ORIGINS || "*").split(",").map((s) => s.trim());
  return cors({
    origin: origins.length === 1 && origins[0] === "*" ? "*" : origins,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["authorization", "content-type", "x-request-id"],
    credentials: false,
  })(c, next);
});

// ── root → version info ──────────────────────────────────────────────────
app.get("/", (c) => ok(c, { name: "credupe-api", version: "1.0.0", runtime: "cloudflare-workers" }));

// ── /api/v1 mount ────────────────────────────────────────────────────────
const v1 = new Hono<AppEnv>();
v1.route("/health", health);
v1.route("/auth", auth);
v1.route("/users", users);
v1.route("/customers", customers);
v1.route("/partners", partners);
v1.route("/lenders", lenders);
v1.route("/loan-products", loanProducts);
v1.route("/quotes", quotes);
v1.route("/loan-applications", loanApplications);
v1.route("/leads", leads);
v1.route("/documents", documents);
v1.route("/notifications", notifications);
v1.route("/analytics", analytics);

app.route("/api/v1", v1);

// ── 404 fallback ─────────────────────────────────────────────────────────
app.notFound((c) => fail(c, 404, "NOT_FOUND", `Route ${c.req.method} ${c.req.path} not found`));

// ── error handler ────────────────────────────────────────────────────────
app.onError((err, c) => {
  console.error("[credupe-api] unhandled error:", err);
  return fail(c, 500, "INTERNAL_ERROR", err instanceof Error ? err.message : String(err));
});

export default app;
