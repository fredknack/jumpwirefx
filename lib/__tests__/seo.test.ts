import { describe, expect, test } from "vitest";
import { personJsonLd, projectJsonLd, projectMetadata } from "@/lib/seo";
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
    const m = projectMetadata(project, site);
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

describe("personJsonLd", () => {
  test("describes Fred with the site url and location", () => {
    const ld = personJsonLd(site, "https://example.com") as Record<string, unknown>;
    expect(ld["@type"]).toBe("Person");
    expect(ld.url).toBe("https://example.com");
    expect(ld.email).toBe("fred@example.com");
  });
});
