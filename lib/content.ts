import type { Project, Service, SiteSettings } from "@/lib/types";
import { projects as seedProjects } from "@/content/projects";
import { services as seedServices } from "@/content/services";
import { site as seedSite } from "@/content/site";
import { getDb, hasDatabase, type DrizzleDb } from "@/lib/db/client";
import { findProject, findProjectById, findService, findServiceById, getSettings, listProjects, listServices, rowToProject, rowToService, rowToSettings, type ListProjectsOpts } from "@/lib/db/queries";
import { cachedProject, cachedPublishedProjects, cachedPublishedServices, cachedSettings } from "@/lib/content-cached";

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

/** Admin writes. Throws without a database: the CMS needs DATABASE_URL. */
export function getContentDb(): DrizzleDb {
  const db = liveDb();
  if (!db) throw new Error("DATABASE_URL is not set; the admin needs a database");
  return db;
}

const archiveFilter = (archive: ListProjectsOpts["archive"]) => (p: Project) =>
  archive === "all" ? true : archive === "only" ? p.archived : !p.archived;

/**
 * Published projects, excluding archived ones unless `archive` says otherwise
 * ("only" lists the archive, "all" lists both). `includeUnpublished` is for the admin.
 */
export async function getProjects(opts: ListProjectsOpts = {}): Promise<Project[]> {
  if (injected) return (await listProjects(injected, opts)).map(rowToProject);
  if (hasDatabase()) {
    // Admin reads (drafts included) bypass the cache so edits show immediately.
    if (opts.includeUnpublished) return (await listProjects(getDb(), opts)).map(rowToProject);
    return (await cachedPublishedProjects()).filter(archiveFilter(opts.archive));
  }
  const list = opts.includeUnpublished ? seedProjects : seedProjects.filter((p) => p.published);
  return [...list].filter(archiveFilter(opts.archive)).sort((a, b) => a.sortOrder - b.sortOrder);
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

export async function getServices(opts: { includeUnpublished?: boolean } = {}): Promise<Service[]> {
  if (injected) return (await listServices(injected, opts)).map(rowToService);
  if (hasDatabase()) {
    if (opts.includeUnpublished) return (await listServices(getDb(), opts)).map(rowToService);
    return cachedPublishedServices();
  }
  const list = opts.includeUnpublished ? seedServices : seedServices.filter((s) => s.published);
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getService(slug: string): Promise<Service | null> {
  if (injected) {
    const row = await findService(injected, slug);
    return row && row.published ? rowToService(row) : null;
  }
  if (hasDatabase()) return (await cachedPublishedServices()).find((s) => s.slug === slug) ?? null;
  return seedServices.find((s) => s.slug === slug && s.published) ?? null;
}

/** Admin: any service by id, uncached. Null without a database. */
export async function getServiceById(id: string): Promise<Service | null> {
  const db = liveDb();
  if (!db) return null;
  const row = await findServiceById(db, id);
  return row ? rowToService(row) : null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (injected) {
    const row = await getSettings(injected);
    return row ? rowToSettings(row) : seedSite;
  }
  if (hasDatabase()) return (await cachedSettings()) ?? seedSite;
  return seedSite;
}
