import { getProjects, getSiteSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";


export async function GET() {
  const base = siteUrl();
  const [site, projects] = await Promise.all([getSiteSettings(), getProjects()]);
  const lines = [
    "# Fred Knack — Interactive kiosks for trade shows and lobbies",
    "",
    `> ${site.intro}`,
    "",
    `Location: ${site.location}. Contact: ${site.email}. Site: ${base}`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${p.title}](${base}/work/${p.slug}): ${p.summary}`),
    "",
    "## Pages",
    "",
    `- [Home](${base})`,
    `- [Contact](${base}/contact)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
