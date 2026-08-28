import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { creditScoreRequests } from "../db/schema";
import { newId } from "../lib/ids";
import { ok, fail } from "../lib/envelope";
import { optionalAuth } from "../middleware/auth";

const creditScore = new Hono<any>();

creditScore.post("/", optionalAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { fullName, mobile, email } = body;
    const user = (c.var as any).user;

    if (!fullName || !mobile) {
      return fail(c, 400, "VALIDATION_ERROR", "Full Name and Mobile are required");
    }

    // Generate a mock credit score between 620 and 825
    const score = Math.floor(Math.random() * (825 - 620 + 1)) + 620;
    const db = drizzle(c.env.DB);
    const id = newId("csr");

    await db.insert(creditScoreRequests).values({
      id,
      userId: user?.sub || null,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : null,
      score,
      status: "COMPLETED",
    });

    return ok(c, {
      score,
      status: "COMPLETED",
      id,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return fail(c, 500, "INTERNAL_SERVER_ERROR", err.message || "Failed to process credit check");
  }
});

export default creditScore;
