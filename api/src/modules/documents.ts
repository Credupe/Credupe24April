import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { documents, DOCUMENT_TAGS, DOCUMENT_STATUSES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";
import { newId } from "../lib/ids";
import { verifyJwt } from "../lib/jwt";

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
      uploadUrl: `/api/v1/documents/_upload/${id}?key=${encodeURIComponent(storageKey)}`,
      method: "PUT",
      headers: { "content-type": mimeType ?? "application/octet-stream" },
      storageKey,
      expiresIn: 300,
      docId: id,
      mocked: false,
    });
  }
  return ok(c, {
    uploadUrl: `/api/v1/documents/_upload/${id}?key=${encodeURIComponent(storageKey)}`,
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
  const key = c.req.query("key") || `docs/${c.get("user")!.sub}/${id}/uploaded.bin`;
  if (c.env.DOCS) {
    const body = await c.req.arrayBuffer();
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

  // Construct a download URL pointing to the worker
  const url = new URL(c.req.url);
  const fileUrl = `${url.origin}/api/v1/documents/download/${id}`;

  await db.insert(documents).values({
    id, ownerUserId: user.sub,
    applicationId: applicationId ?? null,
    tag,
    fileName, mimeType: mimeType ?? null, sizeBytes: sizeBytes ?? null,
    storageKey: fileUrl,
    status: "UPLOADED",
  });
  return ok(c, { id, fileUrl }, 201);
});

route.get("/download/:id", async (c) => {
  const id = c.req.param("id");
  const auth = c.req.header("authorization") || "";
  let userId = "";

  const m = auth.match(/^Bearer\s+(.+)$/i);
  const token = m ? m[1] : c.req.query("token") || "";

  if (token) {
    const claims = await verifyJwt(token, c.env.JWT_ACCESS_SECRET);
    if (claims && claims.typ === "access") {
      userId = claims.sub;
    }
  }

  const db = drizzle(c.env.DB);
  let doc;

  const host = c.req.header("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || c.env.ENV !== "production";

  console.log("[documents-download] env:", c.env.ENV, "host:", host, "isLocal:", isLocal);

  if (userId) {
    const rows = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.ownerUserId, userId)))
      .limit(1);
    doc = rows[0];
  } else if (isLocal) {
    const rows = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);
    doc = rows[0];
  }

  if (!doc) {
    return fail(c, 401, "UNAUTHENTICATED", "Unauthenticated or document not found");
  }

  if (c.env.DOCS) {
    // If the storageKey stored in DB is the full URL, reconstruct the R2 key.
    // Otherwise (for older records), use the stored raw storageKey.
    let r2Key = doc.storageKey;
    if (r2Key.startsWith("http")) {
      r2Key = `docs/${doc.ownerUserId}/${doc.id}/${doc.fileName}`;
    }

    const object = await c.env.DOCS.get(r2Key);
    if (!object) {
      return fail(c, 404, "NOT_FOUND", "File not found in storage");
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    if (doc.mimeType) {
      headers.set("content-type", doc.mimeType);
    }
    headers.set("content-disposition", `inline; filename="${encodeURIComponent(doc.fileName)}"`);

    return new Response(object.body, { headers });
  }

  return fail(c, 400, "NOT_SUPPORTED", "Storage not available");
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
