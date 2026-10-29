import { ContactCta } from "@/components/contact-cta";
import { Hero } from "@/components/hero";
import { HowItsBuilt } from "@/components/how-its-built";
import { JsonLd } from "@/components/json-ld";
import { ProjectGrid } from "@/components/project-grid";
import { ServiceCards } from "@/components/service-cards";
import { getProject, getProjects, getServices, getSiteSettings } from "@/lib/content";
import { organizationJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

export default async function Home() {
  const [site, projects, services] = await Promise.all([getSiteSettings(), getProjects(), getServices()]);
  const reel = await getProject(site.heroReelSlug);
  const gridProjects = projects.filter((p) => p.slug !== site.heroReelSlug);
  return (
    <>
      <JsonLd data={organizationJsonLd(site, siteUrl())} />
      <Hero site={site} reel={reel} />
      <ServiceCards services={services} />
      <ProjectGrid projects={gridProjects} />
      <HowItsBuilt />
      <ContactCta site={site} />
    </>
  );
}
