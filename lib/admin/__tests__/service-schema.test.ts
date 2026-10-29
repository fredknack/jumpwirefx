import { describe, expect, test } from "vitest";
import { formToServiceInput, serviceInputSchema } from "@/lib/admin/service-schema";

describe("serviceInputSchema", () => {
  test("accepts a valid service and rejects a bad slug or empty title", () => {
    const valid = { slug: "trade-show-kiosks", title: "Trade show kiosks", tagline: "", summary: "", body: "", projectSlugs: ["a"], sortOrder: 10, published: true };
    expect(serviceInputSchema.safeParse(valid).success).toBe(true);
    expect(serviceInputSchema.safeParse({ ...valid, slug: "Bad Slug" }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  test("hero image is optional and dropped when its url is blank", () => {
    const r = serviceInputSchema.safeParse({ slug: "abc", title: "T", heroImage: { url: "", alt: "" }, projectSlugs: [] });
    expect(r.success && r.data.heroImage).toBeUndefined();
  });
});

describe("formToServiceInput", () => {
  test("reads repeated projectSlugs checkboxes, hero fields and derives the slug", () => {
    const fd = new FormData();
    fd.set("title", "Lobby Installations");
    fd.set("slug", "");
    fd.set("tagline", "t");
    fd.set("summary", "s");
    fd.set("body", "b");
    fd.append("projectSlugs", "one");
    fd.append("projectSlugs", "two");
    fd.set("heroImageUrl", "/h.jpg");
    fd.set("heroImageAlt", "Hero");
    fd.set("heroImageWidth", "1600");
    fd.set("heroImageHeight", "900");
    fd.set("sortOrder", "20");
    fd.set("published", "on");
    expect(formToServiceInput(fd)).toMatchObject({ slug: "lobby-installations", projectSlugs: ["one", "two"], heroImage: { url: "/h.jpg", alt: "Hero", width: 1600, height: 900 }, sortOrder: 20, published: true });
  });
});

describe("service gallery", () => {
  test("formToServiceInput reads repeated gallery fields like projects do", () => {
    const fd = new FormData();
    fd.set("title", "T");
    fd.set("slug", "t-page");
    fd.set("galleryPresent", "1");
    fd.append("galleryUrl", "/a.png"); fd.append("galleryAlt", "Dashboard"); fd.append("galleryWidth", "1600"); fd.append("galleryHeight", "900");
    expect(formToServiceInput(fd).gallery).toEqual([{ url: "/a.png", alt: "Dashboard", width: 1600, height: 900 }]);
  });

  test("the schema requires alt text on gallery images", () => {
    const r = serviceInputSchema.safeParse({ slug: "abc", title: "T", gallery: [{ url: "/a.png", alt: "" }] });
    expect(r.success).toBe(false);
  });
});
