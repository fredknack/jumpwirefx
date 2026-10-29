// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/cache", () => ({ updateTag: vi.fn(), cacheTag: () => {} }));
vi.mock("@/lib/auth/session", () => ({ requireSession: async () => {} }));

import { saveProjectAction, togglePublishAction } from "@/app/admin/actions";
import sitemap from "@/app/sitemap";
import { getProject, getProjects, setContentDb } from "@/lib/content";
import { createTestDb } from "@/lib/db/test-db";

function form(slug: string) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ title: slug, slug, kind: "kiosk", summary: "s", body: "b", thumbnailUrl: "/t.jpg", thumbnailAlt: "t", sortOrder: "10", published: "on" })) fd.set(k, v);
  return fd;
}

describe("unpublishing a project (Review Focus 4)", () => {
  beforeEach(async () => setContentDb(await createTestDb()));

  test("removes it from the home grid, the sitemap, and makes its page a 404", async () => {
    const { id } = await saveProjectAction({}, form("going-dark"));
    await saveProjectAction({}, form("stays-live"));
    expect((await getProjects()).map((p) => p.slug)).toContain("going-dark");

    await togglePublishAction(id!);

    expect((await getProjects()).map((p) => p.slug)).toEqual(["stays-live"]);
    expect((await sitemap()).map((e) => e.url).some((u) => u.endsWith("/work/going-dark"))).toBe(false);
    expect(await getProject("going-dark")).toBeNull();
    expect((await getProjects({ includeUnpublished: true })).map((p) => p.slug)).toContain("going-dark");
  });
});
