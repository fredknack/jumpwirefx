import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/brand";
import type { Project, SiteSettings } from "@/lib/types";

const abs = (base: string, url: string) => (url.startsWith("http") ? url : `${base}${url}`);

export function projectMetadata(p: Project, _site: SiteSettings): Metadata {
  const title = p.title;
  const description = p.summary;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
      url: `/work/${p.slug}`,
      images: [{ url: p.thumbnail.url, width: p.thumbnail.width, height: p.thumbnail.height, alt: p.thumbnail.alt }],
      locale: "en_US",
      siteName: SITE_NAME,
    },
    twitter: { card: "summary_large_image", title, description, images: [p.thumbnail.url] },
  };
}

export function projectJsonLd(p: Project, siteUrl: string): object {
  const url = `${siteUrl}/work/${p.slug}`;
  const thumbnailUrl = abs(siteUrl, p.thumbnail.url);
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    headline: p.tagline,
    description: p.summary,
    url,
    image: thumbnailUrl,
    keywords: p.skills.join(", "),
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl },
  };
  if (p.client) ld.sourceOrganization = { "@type": "Organization", name: p.client };
  if (p.year) ld.dateCreated = String(p.year);
  if (p.video) {
    ld.video = {
      "@type": "VideoObject",
      name: p.title,
      description: p.summary,
      thumbnailUrl,
      contentUrl: p.video.url,
      uploadDate: p.year ? `${p.year}-01-01` : "2023-12-05",
    };
  }
  return ld;
}

export function organizationJsonLd(site: SiteSettings, siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/art/logo.svg`,
    email: site.email,
    description: site.intro,
    address: { "@type": "PostalAddress", addressLocality: "Portland", addressRegion: "OR", addressCountry: "US" },
    knowsAbout: ["Interactive kiosks", "Trade show installations", "Arduino", "Unity", "LED lighting", "Touchscreen interfaces"],
    sameAs: site.socialLinks.map((l) => l.url),
  };
}
