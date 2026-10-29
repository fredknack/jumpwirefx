/**
 * Load the seed files (projects, services, settings) into the database (upsert by slug).
 *   pnpm db:seed
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db/client";
import { projects as projectsTable, services as servicesTable } from "../lib/db/schema";
import { saveSettings, upsertProject, upsertService } from "../lib/db/queries";
import { projects } from "../content/projects";
import { services } from "../content/services";
import { site } from "../content/site";

async function main() {
  const envFile = path.resolve(__dirname, "../.env.local");
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const db = getDb();
  for (const p of projects) {
    const [existing] = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, p.slug)).limit(1);
    const { id: _seedId, ...rest } = p;
    void _seedId;
    await upsertProject(db, existing ? { ...rest, id: existing.id } : rest);
    console.log(`${existing ? "updated" : "created"} ${p.slug}`);
  }
  for (const s of services) {
    const [existing] = await db.select({ id: servicesTable.id }).from(servicesTable).where(eq(servicesTable.slug, s.slug)).limit(1);
    const { id: _seedId, ...rest } = s;
    void _seedId;
    await upsertService(db, existing ? { ...rest, id: existing.id } : rest);
    console.log(`${existing ? "updated" : "created"} service ${s.slug}`);
  }
  await saveSettings(db, site);
  console.log("saved site settings");
}

main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
