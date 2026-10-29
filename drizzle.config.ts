import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit only auto-loads .env; `vercel env pull` writes .env.local.
if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
