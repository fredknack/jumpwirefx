import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projects, services] = await Promise.all([getProjects({ archive: "all" }), getServices()]);
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...(projects.some((p) => p.archived) ? [{ url: `${base}/work/archive`, changeFrequency: "yearly" as const, priority: 0.4 }] : []),
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, changeFrequency: "yearly" as const, priority: p.archived ? 0.5 : 0.8 })),
  ];
}
