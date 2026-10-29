import { cacheTag } from "next/cache";
import { getDb } from "@/lib/db/client";
import { findProject, getSettings, listProjects, rowToProject, rowToSettings } from "@/lib/db/queries";
import type { Project, SiteSettings } from "@/lib/types";

/**
 * Database reads for the public site, cached under the "content" tag.
 * Admin saves call updateTag("content") so the next request sees the change.
 * Only called when DATABASE_URL is set; never imported by tests.
 */
export async function cachedPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheTag("content");
  return (await listProjects(getDb(), {})).map(rowToProject);
}

export async function cachedProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheTag("content");
  const row = await findProject(getDb(), slug);
  return row && row.published ? rowToProject(row) : null;
}

export async function cachedSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheTag("content");
  const row = await getSettings(getDb());
  return row ? rowToSettings(row) : null;
}
