import { z } from "zod";
import type { ProjectInput } from "@/lib/db/queries";
import type { Media, SiteSettings } from "@/lib/types";

export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,78}[a-z0-9])$/;

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const media = z.object({
  url: z.string().trim().min(1, "required"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().trim().min(1, "alt text is required"),
});

const optionalMedia = z
  .object({ url: z.string().trim(), alt: z.string().trim(), width: z.number().optional(), height: z.number().optional() })
  .optional()
  .transform((m) => (m && m.url ? { url: m.url, alt: m.alt || "Video", width: m.width, height: m.height } : undefined));

export const projectInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().regex(SLUG_RE, "lowercase letters, digits and hyphens, 3-80 characters"),
  title: z.string().trim().min(1, "required").max(120),
  tagline: z.string().trim().max(200).default(""),
  client: z.string().trim().max(120).optional(),
  year: z.number().int().min(1990).max(2100).optional(),
  kind: z.enum(["kiosk", "installation", "game", "experiment"]),
  summary: z.string().trim().max(1000).default(""),
  body: z.string().default(""),
  built: z.array(z.string().trim().min(1)).default([]),
  skills: z.array(z.string().trim().min(1)).default([]),
  thumbnail: media,
  video: optionalMedia,
  gallery: z.array(media).default([]),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(false),
});

export type ProjectInputParsed = z.infer<typeof projectInputSchema>;

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const optStr = (fd: FormData, k: string) => str(fd, k) || undefined;
const num = (fd: FormData, k: string) => (str(fd, k) === "" ? undefined : Number(str(fd, k)));

/** True when the form carried the gallery editor (so an empty list means "cleared", not "untouched"). */
export function formHasGallery(fd: FormData): boolean {
  return fd.has("galleryPresent");
}

const strs = (fd: FormData, k: string) => fd.getAll(k).map((v) => String(v ?? "").trim());
const toNum = (v: string) => (v === "" ? undefined : Number(v));

/** Repeated galleryUrl/galleryAlt/galleryWidth/galleryHeight fields, aligned by index; blank urls are dropped. */
export function formToGallery(fd: FormData): Media[] {
  const urls = strs(fd, "galleryUrl"), alts = strs(fd, "galleryAlt"), ws = strs(fd, "galleryWidth"), hs = strs(fd, "galleryHeight");
  return urls
    .map((url, i) => ({ url, alt: alts[i] ?? "", width: toNum(ws[i] ?? ""), height: toNum(hs[i] ?? "") }))
    .filter((m) => m.url !== "");
}

/** Raw form → unvalidated ProjectInput shape (validate with projectInputSchema). */
export function formToProjectInput(fd: FormData): ProjectInput & { id?: string } {
  const title = str(fd, "title");
  const slug = str(fd, "slug") || slugify(title);
  const videoUrl = str(fd, "videoUrl");
  return {
    id: optStr(fd, "id"),
    slug,
    title,
    tagline: str(fd, "tagline"),
    client: optStr(fd, "client"),
    year: num(fd, "year"),
    kind: str(fd, "kind") as ProjectInput["kind"],
    summary: str(fd, "summary"),
    body: String(fd.get("body") ?? ""),
    built: lines(fd.get("built")),
    skills: lines(fd.get("skills")),
    thumbnail: { url: str(fd, "thumbnailUrl"), alt: str(fd, "thumbnailAlt"), width: num(fd, "thumbnailWidth"), height: num(fd, "thumbnailHeight") },
    video: videoUrl ? { url: videoUrl, alt: str(fd, "videoAlt") || "Video" } : undefined,
    gallery: formToGallery(fd),
    featured: fd.get("featured") === "on",
    sortOrder: num(fd, "sortOrder") ?? 0,
    published: fd.get("published") === "on",
  };
}

export const settingsSchema = z.object({
  headline: z.string().trim().min(1, "required").max(200),
  subhead: z.string().trim().max(300).default(""),
  intro: z.string().trim().max(1500).default(""),
  aboutShort: z.string().trim().max(1500).default(""),
  email: z.string().trim().email("enter a valid email"),
  location: z.string().trim().max(120).default(""),
  socialLinks: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).default([]),
  heroReelSlug: z.string().trim().default(""),
});

/** Social links come from a textarea, one per line: "Label https://url". */
export function formToSettings(fd: FormData): SiteSettings {
  const socialLinks = lines(fd.get("socialLinks")).map((line) => {
    const i = line.lastIndexOf(" ");
    return i === -1 ? { label: line, url: "" } : { label: line.slice(0, i).trim(), url: line.slice(i + 1).trim() };
  });
  return {
    headline: str(fd, "headline"),
    subhead: str(fd, "subhead"),
    intro: str(fd, "intro"),
    aboutShort: str(fd, "aboutShort"),
    email: str(fd, "email"),
    location: str(fd, "location"),
    socialLinks,
    heroReelSlug: str(fd, "heroReelSlug"),
  };
}

/** Flatten zod issues to { field: message } using the first path segment. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    const nested = issue.path.length > 1 ? `${issue.path.slice(1).map((p) => (typeof p === "number" ? `item ${p + 1}` : p)).join(" ")}: ` : "";
    if (!(key in out)) out[key] = nested + issue.message;
  }
  return out;
}
