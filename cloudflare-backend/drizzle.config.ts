import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1-http",
  // drizzle-kit is only used to generate migrations locally; runtime uses the
  // Worker's D1 binding instead.
} satisfies Config;
