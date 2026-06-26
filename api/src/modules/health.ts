import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import type { AppEnv } from "../env";
import { ok, fail } from "../lib/envelope";

const route = new Hono<AppEnv>();

route.get("/", async (c) => {
  try {
    const db = drizzle(c.env.DB);
    const result = await db.run(sql`SELECT 1 as ok`);
    const dbOk = Array.isArray((result as any).results) || (result as any).success !== false;
    return ok(c, { status: "ok", db: dbOk ? "ok" : "fail", cache: "n/a" });
  } catch (err) {
    return fail(c, 503, "DB_DOWN", String(err));
  }
});

export default route;
