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
