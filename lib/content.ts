import type { Project, SiteSettings } from "@/lib/types";
import { projects as seedProjects } from "@/content/projects";
import { site as seedSite } from "@/content/site";
import { getDb, hasDatabase, type DrizzleDb } from "@/lib/db/client";
import { findProject, findProjectById, getSettings, listProjects, rowToProject, rowToSettings } from "@/lib/db/queries";
import { cachedProject, cachedPublishedProjects, cachedSettings } from "@/lib/content-cached";

/**
 * Single access point for site content. With DATABASE_URL set, public reads
 * come from Postgres through the "content"-tagged cache; otherwise from the
 * typed seed files, so the site builds and tests run without a database.
 */

let injected: DrizzleDb | undefined;

/** Test hook: route reads to an in-memory database (bypasses the cache layer). */
export function setContentDb(db: DrizzleDb | undefined): void {
  injected = db;
}

function liveDb(): DrizzleDb | null {
  if (injected) return injected;
  return hasDatabase() ? getDb() : null;
}

export async function getProjects(opts: { includeUnpublished?: boolean } = {}): Promise<Project[]> {
  if (injected) return (await listProjects(injected, opts)).map(rowToProject);
  if (hasDatabase()) {
    // Admin reads (drafts included) bypass the cache so edits show immediately.
    if (opts.includeUnpublished) return (await listProjects(getDb(), opts)).map(rowToProject);
    return cachedPublishedProjects();
  }
  const list = opts.includeUnpublished ? seedProjects : seedProjects.filter((p) => p.published);
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (injected) {
    const row = await findProject(injected, slug);
    return row && row.published ? rowToProject(row) : null;
  }
  if (hasDatabase()) return cachedProject(slug);
  return seedProjects.find((p) => p.slug === slug && p.published) ?? null;
}

/** Admin: any project (draft or published) by id, uncached. Null without a database. */
export async function getProjectById(id: string): Promise<Project | null> {
  const db = liveDb();
  if (!db) return null;
  const row = await findProjectById(db, id);
  return row ? rowToProject(row) : null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (injected) {
    const row = await getSettings(injected);
    return row ? rowToSettings(row) : seedSite;
  }
  if (hasDatabase()) return (await cachedSettings()) ?? seedSite;
  return seedSite;
}
