import { z } from "zod";
import { SLUG_RE, slugify } from "@/lib/admin/project-schema";
import type { ServiceInput } from "@/lib/db/queries";

const optionalMedia = z
  .object({ url: z.string().trim(), alt: z.string().trim(), width: z.number().optional(), height: z.number().optional() })
  .optional()
  .transform((m) => (m && m.url ? { url: m.url, alt: m.alt || "", width: m.width, height: m.height } : undefined));

export const serviceInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().regex(SLUG_RE, "lowercase letters, digits and hyphens, 3-80 characters"),
  title: z.string().trim().min(1, "required").max(120),
  tagline: z.string().trim().max(200).default(""),
  summary: z.string().trim().max(1000).default(""),
  body: z.string().default(""),
  heroImage: optionalMedia,
  projectSlugs: z.array(z.string().trim().min(1)).default([]),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(false),
});

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => (str(fd, k) === "" ? undefined : Number(str(fd, k)));

/** Raw form → unvalidated ServiceInput (validate with serviceInputSchema). */
export function formToServiceInput(fd: FormData): ServiceInput & { id?: string } {
  const title = str(fd, "title");
  const heroUrl = str(fd, "heroImageUrl");
  return {
    id: str(fd, "id") || undefined,
    slug: str(fd, "slug") || slugify(title),
    title,
    tagline: str(fd, "tagline"),
    summary: str(fd, "summary"),
    body: String(fd.get("body") ?? ""),
    heroImage: heroUrl ? { url: heroUrl, alt: str(fd, "heroImageAlt"), width: num(fd, "heroImageWidth"), height: num(fd, "heroImageHeight") } : undefined,
    projectSlugs: fd.getAll("projectSlugs").map((v) => String(v).trim()).filter(Boolean),
    sortOrder: num(fd, "sortOrder") ?? 0,
    published: fd.get("published") === "on",
  };
}
