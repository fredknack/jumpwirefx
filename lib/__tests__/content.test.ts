import { describe, expect, test } from "vitest";
import { getProject, getProjects, getSiteSettings } from "@/lib/content";
import { projects } from "@/content/projects";

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

describe("content", () => {
  test("slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("getProjects returns only published projects sorted by sortOrder", async () => {
    const list = await getProjects();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.published)).toBe(true);
    const orders = list.map((p) => p.sortOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  test("getProjects can include unpublished projects", async () => {
    const all = await getProjects({ includeUnpublished: true });
    expect(all.length).toBe(projects.length);
  });

  test("getProject returns null for an unknown slug", async () => {
    expect(await getProject("not-a-real-slug")).toBeNull();
  });

  test("getProject returns the project for a known slug", async () => {
    const first = (await getProjects())[0];
    expect((await getProject(first.slug))?.title).toBe(first.title);
  });

  test("every project copy is under 120 words", () => {
    for (const p of projects) {
      const total = words(p.tagline) + words(p.summary) + p.built.reduce((n, b) => n + words(b), 0);
      expect(total, `${p.slug} has ${total} words`).toBeLessThan(120);
    }
  });

  test("site intro is under 80 words", async () => {
    const site = await getSiteSettings();
    expect(words(site.intro)).toBeLessThan(80);
    expect(site.headline).toBe("Interactive kiosks for trade shows and lobbies.");
  });
});
