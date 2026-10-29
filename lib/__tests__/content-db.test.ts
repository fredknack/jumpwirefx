import { afterEach, describe, expect, test } from "vitest";
import { projects as seedProjects } from "@/content/projects";
import { getProject, getProjects, getSiteSettings, setContentDb } from "@/lib/content";
import { createTestDb } from "@/lib/db/test-db";
import { projects, siteSettings } from "@/lib/db/schema";

const row = {
  slug: "db-kiosk", title: "DB Kiosk", tagline: "t", kind: "kiosk" as const, summary: "s", body: "b",
  built: ["x"], skills: ["Unity"], thumbnail: { url: "/t.jpg", alt: "t" }, gallery: [], featured: true, sortOrder: 5, published: true,
};

describe("content module switch", () => {
  afterEach(() => setContentDb(undefined));

  test("with no database it returns the seed projects (Review Focus 5)", async () => {
    const list = await getProjects();
    expect(list.map((p) => p.slug)).toEqual(seedProjects.filter((p) => p.published).sort((a, b) => a.sortOrder - b.sortOrder).map((p) => p.slug));
    expect((await getSiteSettings()).email).toBeTruthy();
  });

  test("with a database injected it returns database rows, published only and sorted", async () => {
    const db = await createTestDb();
    await db.insert(projects).values([{ ...row, sortOrder: 20 }, { ...row, slug: "second", sortOrder: 10 }, { ...row, slug: "draft", published: false }]);
    setContentDb(db);
    const list = await getProjects();
    expect(list.map((p) => p.slug)).toEqual(["second", "db-kiosk"]);
    expect(list[0].built).toEqual(["x"]);
    expect((await getProjects({ includeUnpublished: true })).map((p) => p.slug)).toContain("draft");
  });

  test("getProject reads the database and hides drafts", async () => {
    const db = await createTestDb();
    await db.insert(projects).values([row, { ...row, slug: "draft", published: false }]);
    setContentDb(db);
    expect((await getProject("db-kiosk"))?.title).toBe("DB Kiosk");
    expect(await getProject("draft")).toBeNull();
    expect(await getProject("missing")).toBeNull();
  });

  test("getSiteSettings reads the settings row and falls back to seed when the row is missing", async () => {
    const db = await createTestDb();
    setContentDb(db);
    expect((await getSiteSettings()).headline).toBe("Interactive kiosks for trade shows and lobbies.");
    await db.insert(siteSettings).values({ headline: "From DB", email: "db@example.com" });
    expect((await getSiteSettings()).headline).toBe("From DB");
  });
});
