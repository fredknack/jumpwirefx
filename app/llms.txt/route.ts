import { getProjects, getServices, getSiteSettings } from "@/lib/content";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { siteUrl } from "@/lib/site-url";


export async function GET() {
  const base = siteUrl();
  const [site, projects, services, archived] = await Promise.all([getSiteSettings(), getProjects(), getServices(), getProjects({ archive: "only" })]);
  const lines = [
    `# ${SITE_NAME} — ${SITE_TAGLINE.charAt(0) + SITE_TAGLINE.slice(1)}`,
    "",
    `> ${site.intro}`,
    "",
    `Location: ${site.location}. Contact: ${site.email}. Site: ${base}`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.title}](${base}/services/${s.slug}): ${s.summary}`),
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${p.title}](${base}/work/${p.slug}): ${p.summary}`),
    "",
    ...(archived.length ? ["## Archive (older work)", "", ...archived.map((p) => `- [${p.title}](${base}/work/${p.slug}): ${p.summary}`), ""] : []),
    "## Pages",
    "",
    `- [Home](${base})`,
    `- [Contact](${base}/contact)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
