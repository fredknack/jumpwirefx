import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import type { DrizzleDb } from "./client";
import * as schema from "./schema";

/** Fresh in-memory Postgres (pglite) with the current schema pushed. Tests only. */
export async function createTestDb(): Promise<DrizzleDb> {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  const { apply } = await pushSchema(schema, db as never);
  await apply();
  return db as unknown as DrizzleDb;
}
