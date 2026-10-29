import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/contact-cta";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { extractFaq, faqJsonLd } from "@/lib/faq";
import { Markdown } from "@/components/markdown";
import { ProjectCard } from "@/components/project-card";
import { getProjects, getService, getServices, getSiteSettings } from "@/lib/content";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Not found" };
  return serviceMetadata(service);
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const [service, site, projects] = await Promise.all([getService(slug), getSiteSettings(), getProjects()]);
  if (!service) notFound();
  const faq = extractFaq(service.body);
  const related = service.projectSlugs.map((s) => projects.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article>
      <JsonLd data={serviceJsonLd(service, site, siteUrl())} />
      {faq.length > 0 && <JsonLd data={faqJsonLd(faq)} />}
      <Container className="py-12 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Services</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{service.title}</h1>
        <p className="prose-measure mt-4 text-xl text-white/80">{service.tagline}</p>
        {service.heroImage && (
          <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl bg-white/5">
            <Image src={service.heroImage.url} alt={service.heroImage.alt} fill priority sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
          </div>
        )}
        <Markdown className="mt-10 text-white/80">{service.body}</Markdown>

        {service.gallery.length > 0 && (
          <section className="mt-12" aria-labelledby="screenshots">
            <h2 id="screenshots" className="text-2xl font-bold tracking-tight sm:text-3xl">Screenshots</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {service.gallery.map((g) => (
                <figure key={g.url}>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    <Image src={g.url} alt={g.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-2 text-sm text-white/60">{g.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related">
            <h2 id="related" className="text-2xl font-bold tracking-tight sm:text-3xl">Related work</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
        <p className="mt-12">
          <Link href="/#services" className="text-sm text-white/60 hover:text-white">← All services</Link>
        </p>
      </Container>
      <ContactCta site={site} />
    </article>
  );
}
