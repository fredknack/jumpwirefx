import { describe, expect, test } from "vitest";
import { createTestDb } from "@/lib/db/test-db";
import { deleteProject, findProject, getSettings, listProjects, reorderProjects, saveSettings, upsertProject } from "@/lib/db/queries";

const input = {
  slug: "one", title: "One", tagline: "", kind: "kiosk" as const, summary: "", body: "",
  built: [], skills: [], thumbnail: { url: "/1.jpg", alt: "1" }, gallery: [], featured: false, sortOrder: 1, published: true,
};

describe("queries", () => {
  test("upsertProject creates then updates by id and bumps updatedAt", async () => {
    const db = await createTestDb();
    const created = await upsertProject(db, input);
    expect(created.id).toBeTruthy();
    const updated = await upsertProject(db, { ...input, id: created.id, title: "One!" });
    expect(updated.id).toBe(created.id);
    expect((await findProject(db, "one"))?.title).toBe("One!");
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
  });

  test("listProjects filters drafts unless includeUnpublished", async () => {
    const db = await createTestDb();
    await upsertProject(db, input);
    await upsertProject(db, { ...input, slug: "two", published: false });
    expect((await listProjects(db, {})).map((p) => p.slug)).toEqual(["one"]);
    expect((await listProjects(db, { includeUnpublished: true })).map((p) => p.slug)).toEqual(["one", "two"]);
  });

  test("reorderProjects assigns sortOrder by position and deleteProject removes by id", async () => {
    const db = await createTestDb();
    const a = await upsertProject(db, input);
    const b = await upsertProject(db, { ...input, slug: "two", sortOrder: 2 });
    await reorderProjects(db, [b.id, a.id]);
    expect((await listProjects(db, {})).map((p) => p.slug)).toEqual(["two", "one"]);
    await deleteProject(db, a.id);
    expect((await listProjects(db, {})).map((p) => p.slug)).toEqual(["two"]);
  });

  test("saveSettings upserts the single row and getSettings reads it", async () => {
    const db = await createTestDb();
    expect(await getSettings(db)).toBeNull();
    await saveSettings(db, { headline: "H", subhead: "", intro: "", aboutShort: "", email: "a@b.c", location: "", socialLinks: [], heroReelSlug: "" });
    await saveSettings(db, { headline: "H2", subhead: "", intro: "", aboutShort: "", email: "a@b.c", location: "", socialLinks: [], heroReelSlug: "" });
    expect((await getSettings(db))?.headline).toBe("H2");
  });
});
