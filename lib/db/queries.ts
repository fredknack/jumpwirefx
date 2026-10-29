import { asc, eq, sql } from "drizzle-orm";
import type { DrizzleDb } from "./client";
import { projects, siteSettings, type ProjectRow, type SiteSettingsRow } from "./schema";
import type { Project, SiteSettings } from "@/lib/types";

/** Everything a project row holds except generated columns; `id` present means update. */
export type ProjectInput = Omit<Project, "id"> & { id?: string };

export async function listProjects(db: DrizzleDb, opts: { includeUnpublished?: boolean }): Promise<ProjectRow[]> {
  return db
    .select()
    .from(projects)
    .where(opts.includeUnpublished ? undefined : eq(projects.published, true))
    .orderBy(asc(projects.sortOrder), asc(projects.createdAt));
}

export async function findProject(db: DrizzleDb, slug: string): Promise<ProjectRow | null> {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row ?? null;
}

export async function findProjectById(db: DrizzleDb, id: string): Promise<ProjectRow | null> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ?? null;
}

export async function upsertProject(db: DrizzleDb, input: ProjectInput): Promise<ProjectRow> {
  const { id, ...values } = input;
  const data = { ...values, client: values.client ?? null, year: values.year ?? null, video: values.video ?? null };
  if (id) {
    const [row] = await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id)).returning();
    if (!row) throw new Error(`project ${id} not found`);
    return row;
  }
  const [row] = await db.insert(projects).values(data).returning();
  return row;
}

export async function deleteProject(db: DrizzleDb, id: string): Promise<void> {
  await db.delete(projects).where(eq(projects.id, id));
}

/** Set sortOrder = position * 10 for each id in order. */
export async function reorderProjects(db: DrizzleDb, ids: string[]): Promise<void> {
  for (const [i, id] of ids.entries()) {
    await db.update(projects).set({ sortOrder: (i + 1) * 10, updatedAt: new Date() }).where(eq(projects.id, id));
  }
}

export async function getSettings(db: DrizzleDb): Promise<SiteSettingsRow | null> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return row ?? null;
}

export async function saveSettings(db: DrizzleDb, input: SiteSettings): Promise<SiteSettingsRow> {
  const [row] = await db
    .insert(siteSettings)
    .values({ id: 1, ...input })
    .onConflictDoUpdate({ target: siteSettings.id, set: { ...input, updatedAt: sql`now()` } })
    .returning();
  return row;
}

export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    client: row.client ?? undefined,
    year: row.year ?? undefined,
    kind: row.kind,
    summary: row.summary,
    body: row.body,
    built: row.built,
    skills: row.skills,
    thumbnail: row.thumbnail,
    video: row.video ?? undefined,
    gallery: row.gallery,
    featured: row.featured,
    sortOrder: row.sortOrder,
    published: row.published,
  };
}

export function rowToSettings(row: SiteSettingsRow): SiteSettings {
  return {
    headline: row.headline,
    subhead: row.subhead,
    intro: row.intro,
    aboutShort: row.aboutShort,
    email: row.email,
    location: row.location,
    socialLinks: row.socialLinks,
    heroReelSlug: row.heroReelSlug,
  };
}
