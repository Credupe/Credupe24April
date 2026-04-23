import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import type { AppEnv } from "../env";
import { lenders } from "../db/schema";
import { ok, fail } from "../lib/envelope";

const route = new Hono<AppEnv>();

route.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(lenders).where(eq(lenders.active, true));
  return ok(c, { items: rows, total: rows.length });
});

route.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(lenders).where(eq(lenders.slug, slug)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Lender not found");
  return ok(c, row);
});

export default route;
