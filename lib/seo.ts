import type { Metadata } from "next";
import type { Project, SiteSettings } from "@/lib/types";

const abs = (base: string, url: string) => (url.startsWith("http") ? url : `${base}${url}`);

export function projectMetadata(p: Project, site: SiteSettings): Metadata {
  const title = p.title;
  const description = p.summary;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${title} | Fred Knack`,
      description,
      type: "article",
      url: `/work/${p.slug}`,
      images: [{ url: p.thumbnail.url, width: p.thumbnail.width, height: p.thumbnail.height, alt: p.thumbnail.alt }],
      locale: "en_US",
      siteName: `Fred Knack · ${site.location}`,
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
    author: { "@type": "Person", name: "Fred Knack", url: siteUrl },
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

export function personJsonLd(site: SiteSettings, siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Fred Knack",
    url: siteUrl,
    email: site.email,
    jobTitle: "Interactive kiosk designer and builder",
    description: site.intro,
    address: { "@type": "PostalAddress", addressLocality: "Portland", addressRegion: "OR", addressCountry: "US" },
    knowsAbout: ["Interactive kiosks", "Trade show installations", "Arduino", "Unity", "LED lighting", "Touchscreen interfaces"],
    sameAs: site.socialLinks.map((l) => l.url),
  };
}
