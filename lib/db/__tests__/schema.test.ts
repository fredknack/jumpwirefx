import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import { projects, services, siteSettings } from "@/lib/db/schema";
import { createTestDb } from "@/lib/db/test-db";

describe("schema", () => {
  test("inserts and reads back a project row with jsonb fields intact", async () => {
    const db = await createTestDb();
    const [row] = await db
      .insert(projects)
      .values({
        slug: "demo-kiosk",
        title: "Demo Kiosk",
        tagline: "A kiosk",
        client: "Acme",
        year: 2024,
        kind: "kiosk",
        summary: "Summary",
        body: "Body",
        built: ["LED strips", "Arcade buttons"],
        skills: ["Unity", "Arduino"],
        thumbnail: { url: "/media/demo-kiosk/thumb.jpg", width: 1280, height: 720, alt: "Demo" },
        video: { url: "https://blob.example.com/videos/demo-kiosk.mp4", alt: "Demo video" },
        gallery: [],
        featured: true,
        sortOrder: 10,
        published: true,
      })
      .returning();
    expect(row.id).toMatch(/[0-9a-f-]{36}/);
    const found = await db.query.projects.findFirst({ where: eq(projects.slug, "demo-kiosk") });
    expect(found?.built).toEqual(["LED strips", "Arcade buttons"]);
    expect(found?.thumbnail).toEqual({ url: "/media/demo-kiosk/thumb.jpg", width: 1280, height: 720, alt: "Demo" });
    expect(found?.video?.url).toBe("https://blob.example.com/videos/demo-kiosk.mp4");
    expect(found?.createdAt).toBeInstanceOf(Date);
  });

  test("rejects a duplicate slug", async () => {
    const db = await createTestDb();
    const base = { title: "A", tagline: "", kind: "kiosk" as const, summary: "", body: "", thumbnail: { url: "/x.jpg", alt: "x" } };
    await db.insert(projects).values({ ...base, slug: "same" });
    const err = (await db.insert(projects).values({ ...base, slug: "same" }).then(() => null, (e: unknown) => e)) as (Error & { cause?: { code?: string } }) | null;
    expect(err).toBeInstanceOf(Error);
    expect(err?.cause?.code).toBe("23505");
  });

  test("site_settings holds a single row with id 1", async () => {
    const db = await createTestDb();
    await db.insert(siteSettings).values({
      headline: "H", subhead: "S", intro: "I", aboutShort: "A", email: "e@x.com", location: "Portland", socialLinks: [{ label: "LinkedIn", url: "https://linkedin.com/in/x" }], heroReelSlug: "reel",
    });
    const rows = await db.select().from(siteSettings);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(1);
    expect(rows[0].socialLinks).toEqual([{ label: "LinkedIn", url: "https://linkedin.com/in/x" }]);
  });
});

describe("services table", () => {
  test("inserts and reads back a service with jsonb fields, unique slug", async () => {
    const db = await createTestDb();
    const [row] = await db
      .insert(services)
      .values({ slug: "trade-show-kiosks", title: "Trade show kiosks", tagline: "t", summary: "s", body: "b", projectSlugs: ["a", "b"], heroImage: { url: "/h.jpg", alt: "h" }, sortOrder: 10, published: true })
      .returning();
    expect(row.id).toMatch(/[0-9a-f-]{36}/);
    expect(row.projectSlugs).toEqual(["a", "b"]);
    expect(row.heroImage?.url).toBe("/h.jpg");
    const err = (await db.insert(services).values({ slug: "trade-show-kiosks", title: "Dup" }).then(() => null, (e: unknown) => e)) as (Error & { cause?: { code?: string } }) | null;
    expect(err?.cause?.code).toBe("23505");
  });
});
