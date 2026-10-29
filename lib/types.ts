export type ProjectKind = "kiosk" | "installation" | "game" | "experiment";

export interface Media {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  client?: string;
  year?: number;
  kind: ProjectKind;
  /** One paragraph. Used on cards and as the meta description. */
  summary: string;
  /** Markdown. */
  body: string;
  /** "What we built" bullets. */
  built: string[];
  skills: string[];
  thumbnail: Media;
  video?: Media;
  gallery: Media[];
  featured: boolean;
  sortOrder: number;
  published: boolean;
  /** Kept on the site but out of the main grid; listed at /work/archive. */
  archived: boolean;
}

export interface SiteSettings {
  headline: string;
  subhead: string;
  intro: string;
  aboutShort: string;
  email: string;
  location: string;
  socialLinks: { label: string; url: string }[];
  /** Slug of the project whose video plays in the home hero. */
  heroReelSlug: string;
}

/** A service page: one buyer intent ("trade show kiosks"), linking the projects that prove it. */
export interface Service {
  id: string;
  slug: string;
  title: string;
  /** One line under the title. */
  tagline: string;
  /** One paragraph; meta description and the home-page teaser. */
  summary: string;
  /** Markdown. */
  body: string;
  heroImage?: Media;
  /** Related project slugs, in display order. */
  projectSlugs: string[];
  /** Screenshots shown under the body. */
  gallery: Media[];
  sortOrder: number;
  published: boolean;
}
