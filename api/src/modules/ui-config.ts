import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { uiConfigs } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";

const route = new Hono<AppEnv>();

// Default configuration fallback
const DEFAULT_CONFIG = {
  navbar: {
    hideCarLoan: false,
    hideUsedCarLoan: false,
    hideTwoWheelerLoan: false,
    hideGoldLoan: false,
    hideBusinessLoans: false,
    hideHomeLoan: false,
    hideLoanAgainstProperty: false,
    hideCreditCard: false,
    hideAllTabs: false,
  },
  sections: {
    hidePartnerStats: false,
    hideWallOfWin: false,
    hideBankingEcosystem: false,
    hideStatsSection: false,
    hideCreditCardSection: false,
    hideFooterCarLoan: false,
    hideFooterTwoWheelerLoan: false,
    hideFooterBusinessLoan: false,
    hideFooterGoldLoan: false,
    hideFooterCreditCard: false,
    hideAboutUsCompanyStats: false,
    hideAboutUsStats: false,
    hideAboutUsFounders: false,
    hideAboutUsAdvisors: false,
    hideAboutUsInvestors: false,
    hideAboutUsPress: false,
    hideCareersSalaryPerk: false,
    hideProductCarLoan: false,
    hideProductUsedCarLoan: false,
    hideProductTwoWheelerLoan: false,
    hideProductGoldLoan: false,
    hideProductBusinessLoan: false,
    hideProductMicroLoan: false,
    hideAllFooterLinks: false,
    hideCreduAi: false,
    hideHeroCtas: false,
    hideCreditScoreForm: false,
    hideFooterBottomLinks: false,
  },
};

// GET /api/v1/ui-config
route.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(uiConfigs);

  // Start with default config and overlay database values
  const configObj = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  for (const row of rows) {
    const parts = row.config.split(".");
    let current: any = configObj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) current[part] = {};
      current = current[part];
    }
    current[parts[parts.length - 1]] = row.value;
  }

  return ok(c, configObj);
});

// PATCH /api/v1/ui-config (Admin only)
route.patch("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.key !== "string" || typeof body.value !== "boolean") {
    return fail(c, 400, "BAD_REQUEST", "Expected { key: string, value: boolean }");
  }

  const { key, value } = body;
  const db = drizzle(c.env.DB);

  // Upsert the specific toggle row
  await db
    .insert(uiConfigs)
    .values({
      config: key, // name of toggle
      value: value,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: uiConfigs.config,
      set: {
        value: value,
        updatedAt: new Date().toISOString()
      },
    });

  // Re-fetch all and return full object to keep frontend store in sync
  const rows = await db.select().from(uiConfigs);
  const configObj = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  for (const row of rows) {
    const parts = row.config.split(".");
    let current: any = configObj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) current[part] = {};
      current = current[part];
    }
    current[parts[parts.length - 1]] = row.value;
  }

  return ok(c, configObj);
});

export default route;
