import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, sql } from "drizzle-orm";
import type { AppEnv } from "../env";
import { documents, DOCUMENT_TAGS, DOCUMENT_STATUSES, partnerProfiles, users, customerProfiles } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth";
import { verifyJwt } from "../lib/jwt";
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
  const { docId, fileName, documentName, mimeType, sizeBytes, storageKey, tag = "OTHER", applicationId } = body as any;
  if (!fileName || !storageKey) return fail(c, 400, "VALIDATION_ERROR", "fileName and storageKey required");
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  
  if (tag === "KYC") {
    // Delete any old rejected KYC document with the same fileName for this user
    await db.delete(documents).where(
      and(
        eq(documents.ownerUserId, user.sub),
        eq(documents.tag, "KYC"),
        eq(documents.status, "REJECTED"),
        eq(documents.fileName, fileName)
      )
    );

    // Reset partner profile's KYC status back to PENDING so they return to the admin queue
    await db.update(partnerProfiles)
      .set({ kycStatus: "PENDING", updatedAt: new Date().toISOString() })
      .where(eq(partnerProfiles.userId, user.sub));
  }

  const id = docId ?? newId("doc");
  await db.insert(documents).values({
    id, ownerUserId: user.sub,
    applicationId: applicationId ?? null,
    tag,
    fileName,
    documentName: documentName || null,
    mimeType: mimeType ?? null, sizeBytes: sizeBytes ?? null,
    storageKey, status: "UPLOADED",
  });
  return ok(c, { id }, 201);
});

export function getCleanDocumentName(fileName: string): string {
  const lower = fileName.toLowerCase();
  
  // Custom mapping for historical test files
  if (fileName === "s1.png") return "Aadhaar Card";
  if (fileName === "s2.png") return "PAN Card";
  if (fileName === "s3.png") return "Selfie / Passport Photo";
  if (fileName === "s4.png") return "GST Certificate";
  if (fileName === "s5.png") return "Cancelled Cheque";

  if (lower.startsWith("pan") || lower.includes("pan_card") || lower.includes("pancard")) {
    return "PAN Card";
  }
  if (lower.startsWith("aadhaar") || lower.includes("aadhaar_card") || lower.includes("adhar")) {
    return "Aadhaar Card";
  }
  if (lower.includes("gst") || lower.includes("gst_registration") || lower.includes("gst_certificate")) {
    return "GST Certificate";
  }
  if (lower.includes("cheque") || lower.includes("cancelled_cheque")) {
    return "Cancelled Cheque";
  }
  if (lower.includes("photo_with_um") || lower.includes("representative")) {
    return "Photo with Credupe Representative";
  }
  if (lower.includes("selfie") || lower.includes("passport_photo") || lower.includes("photograph")) {
    return "Selfie / Passport Photo";
  }
  if (lower.includes("office_photo") || lower.includes("office")) {
    return "Office Photo";
  }
  if (lower.includes("partnership_deed") || lower.includes("deed")) {
    return "Partnership Deed";
  }
  if (lower.includes("authorization") || lower.includes("letter_of_authorization")) {
    return "Letter of Authorization";
  }
  if (lower.includes("incorporation") || lower.includes("certificate_of_incorporation")) {
    return "Certificate of Incorporation";
  }
  if (lower.includes("income") || lower.includes("payslip") || lower.includes("form_16")) {
    return "Income Proof";
  }
  if (lower.includes("bank_statement") || lower.includes("statement")) {
    return "Bank Statement";
  }
  
  return fileName;
}

route.get("/mine", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(documents).where(eq(documents.ownerUserId, user.sub));
  const items = rows.map((r) => ({
    ...r,
    documentName: r.documentName || getCleanDocumentName(r.fileName),
  }));
  return ok(c, { items, total: items.length });
});

route.get("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const status = c.req.query("status");
  const db = drizzle(c.env.DB);
  
  const rows = await db
    .select({
      id: documents.id,
      ownerUserId: documents.ownerUserId,
      applicationId: documents.applicationId,
      tag: documents.tag,
      fileName: documents.fileName,
      documentName: documents.documentName,
      mimeType: documents.mimeType,
      sizeBytes: documents.sizeBytes,
      storageKey: documents.storageKey,
      status: documents.status,
      rejectionReason: documents.rejectionReason,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      ownerName: sql<string>`COALESCE(${partnerProfiles.contactPerson}, ${partnerProfiles.businessName}, ${customerProfiles.firstName} || ' ' || ${customerProfiles.lastName}, ${users.email}, ${documents.ownerUserId})`
    })
    .from(documents)
    .leftJoin(users, eq(documents.ownerUserId, users.id))
    .leftJoin(partnerProfiles, eq(users.id, partnerProfiles.userId))
    .leftJoin(customerProfiles, eq(users.id, customerProfiles.userId))
    .where(status && DOCUMENT_STATUSES.includes(status as any) ? eq(documents.status, status as any) : undefined);

  const items = rows.map((r) => ({
    ...r,
    documentName: r.documentName || getCleanDocumentName(r.fileName),
  }));

  return ok(c, { items, total: items.length });
});

route.post("/:id/verify", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const toStatus = body.status;
  if (!DOCUMENT_STATUSES.includes(toStatus)) return fail(c, 400, "VALIDATION_ERROR", "invalid status");
  const db = drizzle(c.env.DB);
  
  // 1. Get current document to know the owner and tag
  const doc = (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0];
  if (!doc) return fail(c, 404, "NOT_FOUND", "Document not found");

  // 2. Update status of the document
  await db.update(documents).set({
    status: toStatus,
    rejectionReason: body.rejectionReason ?? null,
    updatedAt: new Date().toISOString(),
  }).where(eq(documents.id, id));

  // 3. If tag is KYC, check if all KYC documents for this partner are verified
  if (doc.tag === "KYC") {
    const partner = (await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, doc.ownerUserId)).limit(1))[0];
    if (partner) {
      const kycDocs = await db.select().from(documents).where(
        and(
          eq(documents.ownerUserId, doc.ownerUserId),
          eq(documents.tag, "KYC")
        )
      );

      let allVerified = true;
      let anyRejected = false;

      for (const d of kycDocs) {
        const currentStatus = d.id === id ? toStatus : d.status;
        if (currentStatus === "REJECTED") anyRejected = true;
        if (currentStatus !== "VERIFIED") allVerified = false;
      }

      let nextKycStatus: "PENDING" | "VERIFIED" | "REJECTED" = "PENDING";
      if (anyRejected) {
        nextKycStatus = "REJECTED";
      } else if (allVerified && kycDocs.length > 0) {
        nextKycStatus = "VERIFIED";
      }

      await db.update(partnerProfiles).set({
        kycStatus: nextKycStatus,
        updatedAt: new Date().toISOString(),
      }).where(eq(partnerProfiles.userId, doc.ownerUserId));
    }
  }

  return ok(c, { id, status: toStatus });
});

route.get("/:id/view", optionalAuth, async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const doc = (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0];
  if (!doc) return fail(c, 404, "NOT_FOUND", "Document not found");

  // Check auth from headers or token query param
  let user = c.get("user");
  if (!user) {
    const token = c.req.query("token");
    if (token) {
      const claims = await verifyJwt(token, c.env.JWT_ACCESS_SECRET);
      if (claims && claims.typ === "access") {
        user = { sub: claims.sub, email: claims.email, role: claims.role };
      }
    }
  }

  if (!user) {
    return fail(c, 401, "UNAUTHENTICATED", "Authentication required");
  }

  if (user.role !== "ADMIN" && doc.ownerUserId !== user.sub) {
    return fail(c, 403, "FORBIDDEN", "You do not have permission to view this document");
  }

  if (c.env.DOCS) {
    const key = `docs/${doc.ownerUserId}/${doc.id}/uploaded.bin`;
    const object = await c.env.DOCS.get(key);
    if (object) {
      const body = await object.arrayBuffer();
      return c.body(body, 200, {
        "Content-Type": doc.mimeType ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${doc.fileName}"`
      });
    }
  }

  // Fallback Mock Placeholder Image/PDF for Local Dev
  if (doc.mimeType === "application/pdf" || doc.fileName.toLowerCase().endsWith(".pdf")) {
    const mockPdfBase64 = "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAyNAo+PgpzdHJlYW0KQlQgL0YxIDEyIFRmIDUwIDcwMCBUZCAoTW9jayBLWUMgUERGKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxMzUgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjMyNgolJUVPRg==";
    const binary = Uint8Array.from(atob(mockPdfBase64), c => c.charCodeAt(0));
    return c.body(binary, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.fileName}"`
    });
  }

  // Direct mock image served locally as binary to ensure it never fails due to network/redirects
  const mockPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88f7dfwAIhAMW4E56GgAAAABJRU5ErkJggg==";
  const binary = Uint8Array.from(atob(mockPngBase64), c => c.charCodeAt(0));
  return c.body(binary, 200, {
    "Content-Type": "image/png",
    "Content-Disposition": `inline; filename="${doc.fileName}"`
  });
});

export default route;
