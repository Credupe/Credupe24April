import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { documents, DOCUMENT_TAGS, DOCUMENT_STATUSES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";
import { newId } from "../lib/ids";

const route = new Hono<AppEnv>();

/**
 * R2 presign: in v1 we return a Worker-signed upload URL if R2 is bound,
 * otherwise return a mocked URL with `mocked: true` so the frontend flow
 * still works. Real R2 signing uses AWS SigV4; for now we emit the Worker's
 * own `/documents/upload` endpoint.
 */
route.post("/presign", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { fileName, mimeType, sizeBytes, tag = "OTHER", applicationId } = body as any;
  if (!fileName) return fail(c, 400, "VALIDATION_ERROR", "fileName required");
  if (!DOCUMENT_TAGS.includes(tag)) return fail(c, 400, "VALIDATION_ERROR", "invalid tag");
  const user = c.get("user")!;
  const id = newId("doc");
  const storageKey = `docs/${user.sub}/${id}/${fileName}`;
  if (c.env.DOCS) {
    // Real R2 binding path — we can issue a PUT URL via Worker fetch proxy.
    // Actual multi-part / signed URLs require SigV4; keeping simple proxy
    // for MVP; the Worker receives the PUT and forwards to R2.
    return ok(c, {
      uploadUrl: `/api/v1/documents/_upload/${id}`,
      method: "PUT",
      headers: { "content-type": mimeType ?? "application/octet-stream" },
      storageKey,
      expiresIn: 300,
      docId: id,
      mocked: false,
    });
  }
  return ok(c, {
    uploadUrl: `/api/v1/documents/_upload/${id}`,
    method: "PUT",
    headers: { "content-type": mimeType ?? "application/octet-stream" },
    storageKey,
    expiresIn: 300,
    docId: id,
    mocked: true,
  });
});

// Simple upload proxy → R2 if bound, else discards bytes (mock for MVP)
route.put("/_upload/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  if (c.env.DOCS) {
    const body = await c.req.arrayBuffer();
    const key = `docs/${c.get("user")!.sub}/${id}/uploaded.bin`;
    await c.env.DOCS.put(key, body);
  }
  return ok(c, { uploaded: true, docId: id });
});

route.post("/register", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { docId, fileName, mimeType, sizeBytes, storageKey, tag = "OTHER", applicationId } = body as any;
  if (!fileName || !storageKey) return fail(c, 400, "VALIDATION_ERROR", "fileName and storageKey required");
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const id = docId ?? newId("doc");
  await db.insert(documents).values({
    id, ownerUserId: user.sub,
    applicationId: applicationId ?? null,
    tag,
    fileName, mimeType: mimeType ?? null, sizeBytes: sizeBytes ?? null,
    storageKey, status: "UPLOADED",
  });
  return ok(c, { id }, 201);
});

route.get("/mine", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(documents).where(eq(documents.ownerUserId, user.sub));
  return ok(c, { items: rows, total: rows.length });
});

route.post("/:id/verify", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const toStatus = body.status;
  if (!DOCUMENT_STATUSES.includes(toStatus)) return fail(c, 400, "VALIDATION_ERROR", "invalid status");
  const db = drizzle(c.env.DB);
  await db.update(documents).set({
    status: toStatus,
    rejectionReason: body.rejectionReason ?? null,
    updatedAt: new Date().toISOString(),
  }).where(eq(documents.id, id));
  return ok(c, { id, status: toStatus });
});

export default route;
