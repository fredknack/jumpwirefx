import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/** Driver-agnostic handle so queries run against Neon in prod and pglite in tests. */
export type DrizzleDb = PgDatabase<PgQueryResultHKT, typeof schema>;

let cached: NeonHttpDatabase<typeof schema> | undefined;

/** Neon HTTP client; one per process. Throws when DATABASE_URL is unset. */
export function getDb(): DrizzleDb {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    cached = drizzle(neon(url), { schema });
  }
  return cached as unknown as DrizzleDb;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
