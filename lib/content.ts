import type { Project, SiteSettings } from "@/lib/types";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * Single access point for site content. Phase 1 reads typed seed files;
 * phase 2 will read the database here without touching pages.
 */
export async function getProjects(opts: { includeUnpublished?: boolean } = {}): Promise<Project[]> {
  const list = opts.includeUnpublished ? projects : projects.filter((p) => p.published);
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProject(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return site;
}
