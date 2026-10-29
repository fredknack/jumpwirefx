import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db/client";
import { getSettings, listProjects, listServices, rowToProject, rowToService, rowToSettings } from "@/lib/db/queries";
import type { Project, Service, SiteSettings } from "@/lib/types";

/**
 * Database reads for the public site, cached under the "content" tag.
 * Admin saves call updateTag("content") so the next request sees the change.
 * Only called when DATABASE_URL is set; never imported by tests.
 */
export async function cachedPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  cacheTag("content");
  return (await listProjects(getDb(), { archive: "all" })).map(rowToProject);
}

/** Resolved from the cached list so unknown slugs never create cache entries or queries. */
export async function cachedProject(slug: string): Promise<Project | null> {
  const projects = await cachedPublishedProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function cachedPublishedServices(): Promise<Service[]> {
  "use cache";
  cacheLife("max");
  cacheTag("content");
  return (await listServices(getDb(), {})).map(rowToService);
}

export async function cachedSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheLife("max");
  cacheTag("content");
  const row = await getSettings(getDb());
  return row ? rowToSettings(row) : null;
}
