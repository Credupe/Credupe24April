import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import type { AppEnv } from "../env";
import { lenders } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth";

const route = new Hono<AppEnv>();

// GET /api/v1/lenders (List lenders)
route.get("/", optionalAuth, async (c) => {
  const user = c.get("user");
  const activeParam = c.req.query("active"); // "true" | "false"
  const db = drizzle(c.env.DB);
  
  let rows;
  if (user?.role === "ADMIN") {
    const whereClauses: any[] = [];
    if (activeParam === "true") {
      whereClauses.push(eq(lenders.active, true));
    } else if (activeParam === "false") {
      whereClauses.push(eq(lenders.active, false));
    }
    rows = await db.select().from(lenders).where(whereClauses.length ? and(...whereClauses) : undefined);
  } else {
    rows = await db.select().from(lenders).where(eq(lenders.active, true));
  }
  
  // Sort lenders alphabetically by name
  rows.sort((a, b) => a.name.localeCompare(b.name));

  return ok(c, { items: rows, total: rows.length });
});

// GET /api/v1/lenders/:slug (Details by slug)
route.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(lenders).where(eq(lenders.slug, slug)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Lender not found");
  return ok(c, row);
});

// POST /api/v1/lenders (Create lender)
route.post("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return fail(c, 400, "BAD_REQUEST", "Invalid request body");

  const { name, slug: slugInput, logoUrl, webhookUrl, active, integrationMode } = body;

  if (!name || !name.trim()) {
    return fail(c, 400, "VALIDATION_ERROR", "Lender name is required");
  }

  const db = drizzle(c.env.DB);

  // Check unique name
  const existingName = (await db.select().from(lenders).where(eq(lenders.name, name.trim())).limit(1))[0];
  if (existingName) {
    return fail(c, 400, "VALIDATION_ERROR", "Lender name already exists");
  }

  // Derive slug if empty
  let slug = (slugInput || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Check unique slug
  const existingSlug = (await db.select().from(lenders).where(eq(lenders.slug, slug)).limit(1))[0];
  if (existingSlug) {
    slug = slug + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  const id = "l_" + Math.random().toString(36).substring(2, 15);
  const user = c.get("user");

  await db.insert(lenders).values({
    id,
    name: name.trim(),
    slug,
    logoUrl: logoUrl ? logoUrl.trim() : null,
    webhookUrl: webhookUrl ? webhookUrl.trim() : null,
    active: active !== false,
    integrationMode: integrationMode || "mock",
    createdBy: user?.sub ?? "system",
    updatedBy: user?.sub ?? "system",
  });

  const newLender = (await db.select().from(lenders).where(eq(lenders.id, id)).limit(1))[0];
  return ok(c, newLender, 201);
});

// PATCH /api/v1/lenders/:id (Update lender)
route.patch("/:id", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  if (!body) return fail(c, 400, "BAD_REQUEST", "Invalid request body");

  const db = drizzle(c.env.DB);
  const existing = (await db.select().from(lenders).where(eq(lenders.id, id)).limit(1))[0];
  if (!existing) return fail(c, 404, "NOT_FOUND", "Lender not found");

  const { name, slug, logoUrl, webhookUrl, active, integrationMode } = body;
  const user = c.get("user");

  const updatePayload: any = {
    updatedBy: user?.sub ?? "system",
    updatedAt: new Date().toISOString(),
  };

  if (name !== undefined) {
    if (!name.trim()) return fail(c, 400, "VALIDATION_ERROR", "Lender name is required");
    // Check uniqueness if changed
    if (name.trim() !== existing.name) {
      const existingName = (await db.select().from(lenders).where(eq(lenders.name, name.trim())).limit(1))[0];
      if (existingName) return fail(c, 400, "VALIDATION_ERROR", "Lender name already exists");
    }
    updatePayload.name = name.trim();
  }

  if (slug !== undefined) {
    let finalSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!finalSlug) return fail(c, 400, "VALIDATION_ERROR", "Slug cannot be empty");
    if (finalSlug !== existing.slug) {
      const existingSlug = (await db.select().from(lenders).where(eq(lenders.slug, finalSlug)).limit(1))[0];
      if (existingSlug) return fail(c, 400, "VALIDATION_ERROR", "Slug already exists");
    }
    updatePayload.slug = finalSlug;
  }

  if (logoUrl !== undefined) {
    updatePayload.logoUrl = logoUrl ? logoUrl.trim() : null;
  }
  if (webhookUrl !== undefined) {
    updatePayload.webhookUrl = webhookUrl ? webhookUrl.trim() : null;
  }
  if (active !== undefined) {
    updatePayload.active = active;
  }
  if (integrationMode !== undefined) {
    updatePayload.integrationMode = integrationMode;
  }

  await db.update(lenders).set(updatePayload).where(eq(lenders.id, id));
  const updated = (await db.select().from(lenders).where(eq(lenders.id, id)).limit(1))[0];
  return ok(c, updated);
});

export default route;
