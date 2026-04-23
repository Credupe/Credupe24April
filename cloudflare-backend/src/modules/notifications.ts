import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { notifications } from "../db/schema";
import { ok } from "../lib/envelope";
import { requireAuth } from "../middleware/auth";

const route = new Hono<AppEnv>();

route.get("/", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(notifications)
    .where(eq(notifications.userId, user.sub))
    .orderBy(desc(notifications.createdAt));
  return ok(c, {
    items: rows.map((r) => ({ ...r, metadata: r.metadataJson ? JSON.parse(r.metadataJson) : null })),
    unread: rows.filter((r) => r.status !== "READ").length,
    total: rows.length,
  });
});

route.post("/:id/read", requireAuth, async (c) => {
  const id = c.req.param("id");
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  await db.update(notifications)
    .set({ status: "READ", readAt: new Date().toISOString() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.sub)));
  return ok(c, { id, read: true });
});

route.post("/read-all", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  await db.update(notifications)
    .set({ status: "READ", readAt: new Date().toISOString() })
    .where(eq(notifications.userId, user.sub));
  return ok(c, { read: true });
});

export default route;
