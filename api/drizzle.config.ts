import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/66f9433f27bb1b16daead76296097c3871d5f32a8768c31c2d585f38a550c975.sqlite",
  },
  // drizzle-kit is only used to generate migrations locally; runtime uses the
  // Worker's D1 binding instead.
} satisfies Config;
