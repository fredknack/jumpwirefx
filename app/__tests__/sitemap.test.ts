import { describe, expect, test, vi } from "vitest";
import type { Project } from "@/lib/types";

const mk = (slug: string, published: boolean): Project => ({
  id: slug, slug, title: slug, tagline: "t", kind: "kiosk", summary: "s", body: "b", built: [], skills: [],
  thumbnail: { url: `/media/${slug}/thumb.jpg`, alt: "a" }, gallery: [], featured: false, sortOrder: 1, published,
});

vi.mock("@/content/projects", () => ({ projects: [mk("live-one", true), mk("draft-one", false)] }));

describe("sitemap", () => {
  test("lists home, contact and every published project, never unpublished ones", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain("https://jumpwirefx.com");
    expect(urls).toContain("https://jumpwirefx.com/contact");
    expect(urls).toContain("https://jumpwirefx.com/work/live-one");
    expect(urls.some((u) => u.includes("draft-one"))).toBe(false);
  });
});
