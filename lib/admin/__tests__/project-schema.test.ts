import { describe, expect, test } from "vitest";
import { formHasGallery, formToProjectInput, projectInputSchema, slugify } from "@/lib/admin/project-schema";

const valid = {
  slug: "demo-kiosk", title: "Demo Kiosk", tagline: "A kiosk", client: "Acme", year: 2024, kind: "kiosk",
  summary: "Summary", body: "Body", built: ["LED"], skills: ["Unity"], thumbnail: { url: "/t.jpg", alt: "t" },
  gallery: [], featured: false, sortOrder: 10, published: true,
};

describe("slugify", () => {
  test("lowercases, strips punctuation, hyphenates", () => {
    expect(slugify("  Netflix: Cowboy Bebop Vending Machine! ")).toBe("netflix-cowboy-bebop-vending-machine");
    expect(slugify("Meta2 — AR  Breakout")).toBe("meta2-ar-breakout");
  });
});

describe("projectInputSchema", () => {
  test("accepts a valid project", () => {
    expect(projectInputSchema.safeParse(valid).success).toBe(true);
  });

  test.each(["Bad Slug", "ab", "a".repeat(81), "under_score", "-leading"])("rejects slug %j", (slug) => {
    const r = projectInputSchema.safeParse({ ...valid, slug });
    expect(r.success).toBe(false);
    expect(r.success ? [] : r.error.issues.map((i) => i.path[0])).toContain("slug");
  });

  test("requires title, thumbnail url and alt; rejects unknown kind", () => {
    expect(projectInputSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
    expect(projectInputSchema.safeParse({ ...valid, thumbnail: { url: "", alt: "t" } }).success).toBe(false);
    expect(projectInputSchema.safeParse({ ...valid, thumbnail: { url: "/t.jpg", alt: "" } }).success).toBe(false);
    expect(projectInputSchema.safeParse({ ...valid, kind: "movie" }).success).toBe(false);
  });

  test("video is optional and ignored when its url is empty", () => {
    const r = projectInputSchema.safeParse({ ...valid, video: { url: "", alt: "" } });
    expect(r.success && r.data.video).toBeUndefined();
  });
});

describe("formToProjectInput", () => {
  test("parses newline-separated bullets and skills, checkboxes and numbers", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries({
      title: "Demo", slug: "demo", tagline: "", kind: "installation", summary: "s", body: "b", client: "", year: "",
      built: "One\n\nTwo  \n", skills: "Unity\nArduino", thumbnailUrl: "/t.jpg", thumbnailAlt: "t", videoUrl: "", videoAlt: "",
      sortOrder: "30", published: "on",
    })) fd.set(k, v);
    const input = formToProjectInput(fd);
    expect(input).toMatchObject({ built: ["One", "Two"], skills: ["Unity", "Arduino"], sortOrder: 30, published: true, featured: false, kind: "installation" });
    expect(input.client).toBeUndefined();
    expect(input.year).toBeUndefined();
    expect(input.video).toBeUndefined();
  });

  test("derives the slug from the title when the slug field is blank", () => {
    const fd = new FormData();
    fd.set("title", "Hello World Kiosk");
    fd.set("slug", "");
    expect(formToProjectInput(fd).slug).toBe("hello-world-kiosk");
  });
});

describe("gallery fields", () => {
  const base = { title: "T", slug: "t", kind: "kiosk", summary: "", body: "", built: "", skills: "", thumbnailUrl: "/t.jpg", thumbnailAlt: "t", sortOrder: "1" };

  test("parses repeated galleryUrl/Alt/Width/Height fields in order, skipping blank urls", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(base)) fd.set(k, v);
    fd.set("galleryPresent", "1");
    for (const [u, a, w, h] of [["/g1.jpg", "one", "1600", "900"], ["", "blank", "", ""], ["/g2.jpg", "two", "", ""]]) {
      fd.append("galleryUrl", u); fd.append("galleryAlt", a); fd.append("galleryWidth", w); fd.append("galleryHeight", h);
    }
    const input = formToProjectInput(fd);
    expect(input.gallery).toEqual([{ url: "/g1.jpg", alt: "one", width: 1600, height: 900 }, { url: "/g2.jpg", alt: "two", width: undefined, height: undefined }]);
    expect(formHasGallery(fd)).toBe(true);
  });

  test("a form without the gallery editor reports no gallery", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(base)) fd.set(k, v);
    expect(formHasGallery(fd)).toBe(false);
    expect(formToProjectInput(fd).gallery).toEqual([]);
  });
});
