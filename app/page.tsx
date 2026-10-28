import { ContactCta } from "@/components/contact-cta";
import { Hero } from "@/components/hero";
import { HowItsBuilt } from "@/components/how-its-built";
import { JsonLd } from "@/components/json-ld";
import { ProjectGrid } from "@/components/project-grid";
import { getProject, getProjects, getSiteSettings } from "@/lib/content";
import { personJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

export default async function Home() {
  const [site, projects] = await Promise.all([getSiteSettings(), getProjects()]);
  const reel = await getProject(site.heroReelSlug);
  const gridProjects = projects.filter((p) => p.slug !== site.heroReelSlug);
  return (
    <>
      <JsonLd data={personJsonLd(site, siteUrl())} />
      <Hero site={site} reel={reel} />
      <ProjectGrid projects={gridProjects} />
      <HowItsBuilt />
      <ContactCta site={site} />
    </>
  );
}
