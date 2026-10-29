import { describe, expect, test } from "vitest";
import { organizationJsonLd, projectJsonLd, projectMetadata, serviceJsonLd, serviceMetadata } from "@/lib/seo";
import type { Project, SiteSettings } from "@/lib/types";

const site: SiteSettings = {
  headline: "H", subhead: "S", intro: "I", aboutShort: "A",
  email: "fred@example.com", location: "Portland, Oregon", socialLinks: [], heroReelSlug: "reel",
};
const project: Project = {
  id: "p1", slug: "demo-kiosk", title: "Demo Kiosk", tagline: "Tag", kind: "kiosk",
  summary: "A short summary.", body: "Body", built: [], skills: ["Unity"],
  thumbnail: { url: "/media/demo-kiosk/thumb.jpg", width: 1280, height: 720, alt: "poster" },
  gallery: [], featured: true, sortOrder: 1, published: true,
};

describe("projectMetadata", () => {
  test("uses the project title, summary and thumbnail", () => {
    const m = projectMetadata(project);
    expect(m.title).toBe("Demo Kiosk");
    expect(m.description).toBe("A short summary.");
    const og = m.openGraph as { images: { url: string }[] };
    expect(og.images[0].url).toBe("/media/demo-kiosk/thumb.jpg");
    expect(m.alternates?.canonical).toBe("/work/demo-kiosk");
  });
});

describe("projectJsonLd", () => {
  test("is a CreativeWork without VideoObject when there is no video", () => {
    const ld = projectJsonLd(project, "https://example.com") as Record<string, unknown>;
    expect(ld["@type"]).toBe("CreativeWork");
    expect(ld.url).toBe("https://example.com/work/demo-kiosk");
    expect(ld.video).toBeUndefined();
  });

  test("nests a VideoObject when the project has a video", () => {
    const withVideo = { ...project, video: { url: "https://blob/v.mp4", alt: "v" } };
    const ld = projectJsonLd(withVideo, "https://example.com") as { video: Record<string, unknown> };
    expect(ld.video["@type"]).toBe("VideoObject");
    expect(ld.video.contentUrl).toBe("https://blob/v.mp4");
    expect(ld.video.thumbnailUrl).toBe("https://example.com/media/demo-kiosk/thumb.jpg");
    expect(ld.video.name).toBe("Demo Kiosk");
    expect(typeof ld.video.uploadDate).toBe("string");
  });
});

describe("organizationJsonLd", () => {
  test("describes JumpWire as the business with the site url, email and Portland address", () => {
    const ld = organizationJsonLd(site, "https://example.com") as Record<string, unknown>;
    expect(ld["@type"]).toBe("Organization");
    expect(ld.name).toBe("JumpWire");
    expect(ld.url).toBe("https://example.com");
    expect(ld.email).toBe("fred@example.com");
    expect(ld.logo).toBe("https://example.com/art/logo.svg");
    expect((ld.address as { addressLocality: string }).addressLocality).toBe("Portland");
    expect(JSON.stringify(ld)).not.toMatch(/fred knack/i);
  });
});

describe("brand", () => {
  test("metadata and structured data carry JumpWire, never the personal name", () => {
    const m = projectMetadata(project);
    expect((m.openGraph as { title: string }).title).toBe("Demo Kiosk | JumpWire");
    expect((m.openGraph as { siteName: string }).siteName).toBe("JumpWire");
    const ld = projectJsonLd(project, "https://example.com") as { author: { "@type": string; name: string } };
    expect(ld.author).toEqual({ "@type": "Organization", name: "JumpWire", url: "https://example.com" });
    expect(JSON.stringify([m, ld])).not.toMatch(/fred knack/i);
  });
});

describe("service SEO", () => {
  const service = {
    id: "s1", slug: "trade-show-kiosks", title: "Trade show kiosks", tagline: "Tag", summary: "A summary of the service.",
    body: "## Body", heroImage: { url: "/h.jpg", width: 1600, height: 900, alt: "Hero" }, projectSlugs: ["demo-kiosk"], gallery: [], sortOrder: 1, published: true,
  };

  test("serviceMetadata uses title, summary, canonical and the hero image", () => {
    const m = serviceMetadata(service);
    expect(m.title).toBe("Trade show kiosks");
    expect(m.description).toBe("A summary of the service.");
    expect(m.alternates?.canonical).toBe("/services/trade-show-kiosks");
    expect((m.openGraph as { images: { url: string }[] }).images[0].url).toBe("/h.jpg");
  });

  test("serviceJsonLd is a Service provided by the JumpWire Organization", () => {
    const ld = serviceJsonLd(service, site, "https://example.com") as Record<string, unknown>;
    expect(ld["@type"]).toBe("Service");
    expect(ld.name).toBe("Trade show kiosks");
    expect(ld.url).toBe("https://example.com/services/trade-show-kiosks");
    expect(ld.provider).toMatchObject({ "@type": "Organization", name: "JumpWire", url: "https://example.com" });
    expect(ld.areaServed).toBe("US");
    expect(ld.image).toBe("https://example.com/h.jpg");
  });
});
