/**
 * Worker environment bindings.
 * Every module imports `AppEnv` for Hono typing so `c.env.DB`, `c.env.JWT_…`
 * etc are type-safe.
 */
export type AppEnv = {
  Bindings: {
    // D1 binding (see wrangler.toml [[d1_databases]])
    DB: D1Database;
    // Optional R2 bucket (see wrangler.toml [[r2_buckets]])
    DOCS?: R2Bucket;
    // Vars
    API_PREFIX: string;
    JWT_ACCESS_TTL: string;
    JWT_REFRESH_TTL: string;
    BCRYPT_SALT_ROUNDS: string;
    CORS_ORIGINS: string;
    // Secrets
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    SEED_ADMIN_EMAIL?: string;
    SEED_ADMIN_PASSWORD?: string;
    // R2 creds (optional; if set, storage module signs real URLs)
    R2_ACCOUNT_ID?: string;
    R2_ACCESS_KEY_ID?: string;
    R2_SECRET_ACCESS_KEY?: string;
    R2_BUCKET?: string;
  };
  Variables: {
    user?: { sub: string; email: string; role: "CUSTOMER" | "PARTNER" | "ADMIN" };
  };
};
