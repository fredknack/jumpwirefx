import { afterEach, describe, expect, test } from "vitest";
import { getService, getServiceById, getServices, setContentDb } from "@/lib/content";
import { createTestDb } from "@/lib/db/test-db";
import { services } from "@/lib/db/schema";

const row = { slug: "db-service", title: "DB Service", tagline: "t", summary: "s", body: "b", projectSlugs: ["interactive-corporate-timeline"], sortOrder: 5, published: true };

describe("services content switch", () => {
  afterEach(() => setContentDb(undefined));

  test("without a database the three seed services are returned in order and look like real pages", async () => {
    const list = await getServices();
    expect(list.map((s) => s.slug)).toEqual(["trade-show-kiosks", "lobby-installations", "interactive-video-walls"]);
    for (const s of list) {
      expect(s.summary.split(/\s+/).length).toBeGreaterThan(20);
      expect(s.body.length).toBeGreaterThan(400);
      expect(s.projectSlugs.length).toBeGreaterThan(0);
      expect(s.body).not.toMatch(/\b(I|my)\b/);
    }
    expect((await getService("trade-show-kiosks"))?.title).toBe("Trade show kiosks");
    expect(await getService("nope")).toBeNull();
  });

  test("with a database it returns rows, hides drafts, and finds by id", async () => {
    const db = await createTestDb();
    const [inserted] = await db.insert(services).values([row, { ...row, slug: "draft", published: false }]).returning();
    setContentDb(db);
    expect((await getServices()).map((s) => s.slug)).toEqual(["db-service"]);
    expect((await getServices({ includeUnpublished: true })).map((s) => s.slug)).toContain("draft");
    expect(await getService("draft")).toBeNull();
    expect((await getServiceById(inserted.id))?.title).toBe("DB Service");
  });
});
