import { describe, expect, test } from "vitest";
import { createTestDb } from "@/lib/db/test-db";
import { deleteService, findService, findServiceById, listServices, reorderServices, upsertService } from "@/lib/db/queries";

const input = { slug: "one", title: "One", tagline: "", summary: "", body: "", projectSlugs: [] as string[], sortOrder: 1, published: true };

describe("service queries", () => {
  test("upsertService creates then updates by id", async () => {
    const db = await createTestDb();
    const created = await upsertService(db, input);
    const updated = await upsertService(db, { ...input, id: created.id, title: "One!", projectSlugs: ["x"] });
    expect(updated.id).toBe(created.id);
    expect((await findService(db, "one"))?.title).toBe("One!");
    expect((await findServiceById(db, created.id))?.projectSlugs).toEqual(["x"]);
  });

  test("listServices filters drafts unless includeUnpublished, ordered by sortOrder", async () => {
    const db = await createTestDb();
    await upsertService(db, { ...input, sortOrder: 20 });
    await upsertService(db, { ...input, slug: "two", sortOrder: 10 });
    await upsertService(db, { ...input, slug: "draft", published: false });
    expect((await listServices(db, {})).map((s) => s.slug)).toEqual(["two", "one"]);
    expect((await listServices(db, { includeUnpublished: true })).map((s) => s.slug)).toContain("draft");
  });

  test("reorderServices and deleteService", async () => {
    const db = await createTestDb();
    const a = await upsertService(db, input);
    const b = await upsertService(db, { ...input, slug: "two", sortOrder: 2 });
    await reorderServices(db, [b.id, a.id]);
    expect((await listServices(db, {})).map((s) => s.slug)).toEqual(["two", "one"]);
    await deleteService(db, a.id);
    expect((await listServices(db, {})).map((s) => s.slug)).toEqual(["two"]);
  });
});
