import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, asc, eq, like, gte, lte, or, sql } from "drizzle-orm";
import type { AppEnv } from "../env";
import { userFeedback, users } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";
import { newId } from "../lib/ids";

const feedback = new Hono<AppEnv>();
const adminFeedback = new Hono<AppEnv>();

// ─── USER FEEDBACK ROUTES ───────────────────────────────────────────────────

/**
 * POST /api/v1/feedback
 * Submit a new app rating/feedback.
 */
feedback.post("/", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const rating = Number(body.rating);

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return fail(c, 400, "VALIDATION_ERROR", "Rating must be an integer between 1 and 5");
  }

  const ratingLabels: Record<number, string> = {
    1: "Very Bad",
    2: "Bad",
    3: "Neutral",
    4: "Good",
    5: "Excellent",
  };
  const ratingLabel = ratingLabels[rating];

  // Extract client metadata from request headers and body
  const ipAddress = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "";
  const device = body.device || c.req.header("x-device") || c.req.header("user-agent") || "";
  const platform = body.platform || c.req.header("x-platform") || "";
  const appVersion = body.appVersion || c.req.header("x-app-version") || "";

  const db = drizzle(c.env.DB);
  const id = newId("fb");

  await db.insert(userFeedback).values({
    id,
    userId: user.sub,
    rating,
    ratingLabel,
    ipAddress,
    device,
    platform,
    appVersion,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return ok(c, {
    success: true,
    message: "Feedback submitted successfully",
  });
});

/**
 * GET /api/v1/feedback/my
 * Retrieve current user's feedback history.
 */
feedback.get("/my", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);

  const rows = await db
    .select()
    .from(userFeedback)
    .where(eq(userFeedback.userId, user.sub))
    .orderBy(desc(userFeedback.createdAt));

  return ok(c, {
    items: rows,
    total: rows.length,
  });
});

// ─── ADMIN FEEDBACK ROUTES ──────────────────────────────────────────────────

/**
 * GET /api/v1/admin/feedback
 * Supports pagination, search, sorting, date filters, and rating filters.
 */
adminFeedback.get("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const db = drizzle(c.env.DB);
  const q = c.req.query();

  // Pagination parameters
  const page = Math.max(1, Number(q.page || "1"));
  const limit = Math.max(1, Math.min(100, Number(q.limit || "10")));
  const offset = (page - 1) * limit;

  // Sorting
  const sortBy = q.sortBy || "createdAt";
  const sortOrder = q.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

  // Filters and search
  const search = q.search || "";
  const rating = q.rating ? Number(q.rating) : undefined;
  const ratingLabel = q.ratingLabel || "";
  const startDate = q.startDate || "";
  const endDate = q.endDate || "";

  const where: any[] = [];

  if (rating !== undefined && !isNaN(rating)) {
    where.push(eq(userFeedback.rating, rating));
  }
  if (ratingLabel) {
    where.push(eq(userFeedback.ratingLabel, ratingLabel));
  }
  if (startDate) {
    where.push(gte(userFeedback.createdAt, startDate));
  }
  if (endDate) {
    where.push(lte(userFeedback.createdAt, endDate));
  }

  // If search is active, filter by user email, rating label, platform, or device
  if (search) {
    where.push(
      or(
        like(users.email, `%${search}%`),
        like(userFeedback.ratingLabel, `%${search}%`),
        like(userFeedback.device, `%${search}%`),
        like(userFeedback.platform, `%${search}%`)
      )
    );
  }

  const whereClause = where.length > 0 ? and(...where) : undefined;

  // 1. Get total matching count
  const countRes = await db
    .select({ count: sql<number>`count(*)` })
    .from(userFeedback)
    .innerJoin(users, eq(userFeedback.userId, users.id))
    .where(whereClause);
  const total = Number(countRes[0]?.count ?? 0);

  // 2. Build sort order
  let orderByField: any = desc(userFeedback.createdAt);
  if (sortBy === "rating") {
    orderByField = sortOrder === "asc" ? asc(userFeedback.rating) : desc(userFeedback.rating);
  } else if (sortBy === "userEmail") {
    orderByField = sortOrder === "asc" ? asc(users.email) : desc(users.email);
  } else if (sortBy === "createdAt") {
    orderByField = sortOrder === "asc" ? asc(userFeedback.createdAt) : desc(userFeedback.createdAt);
  }

  // 3. Fetch paginated records
  const items = await db
    .select({
      id: userFeedback.id,
      userId: userFeedback.userId,
      rating: userFeedback.rating,
      ratingLabel: userFeedback.ratingLabel,
      ipAddress: userFeedback.ipAddress,
      device: userFeedback.device,
      platform: userFeedback.platform,
      appVersion: userFeedback.appVersion,
      createdAt: userFeedback.createdAt,
      updatedAt: userFeedback.updatedAt,
      userEmail: users.email,
      userRole: users.role,
    })
    .from(userFeedback)
    .innerJoin(users, eq(userFeedback.userId, users.id))
    .where(whereClause)
    .orderBy(orderByField)
    .limit(limit)
    .offset(offset);

  return ok(c, {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

export { feedback, adminFeedback };
