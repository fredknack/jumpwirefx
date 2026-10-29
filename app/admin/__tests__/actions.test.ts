// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

const updateTag = vi.fn();
const requireSession = vi.fn(async () => {});
vi.mock("next/cache", () => ({ updateTag: (t: string) => updateTag(t), cacheTag: () => {} }));
vi.mock("@/lib/auth/session", () => ({ requireSession: () => requireSession() }));

import { deleteProjectAction, reorderAction, saveProjectAction, saveSettingsAction, togglePublishAction } from "@/app/admin/actions";
import { getProjects, getSiteSettings, setContentDb } from "@/lib/content";
import { createTestDb } from "@/lib/db/test-db";

function projectForm(over: Record<string, string> = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({
    title: "Demo", slug: "demo", tagline: "", kind: "kiosk", summary: "s", body: "b", built: "", skills: "",
    thumbnailUrl: "/t.jpg", thumbnailAlt: "t", sortOrder: "10", published: "on", ...over,
  })) fd.set(k, v);
  return fd;
}

describe("admin server actions", () => {
  beforeEach(async () => {
    setContentDb(await createTestDb());
    updateTag.mockClear();
    requireSession.mockClear();
  });

  test("saveProjectAction creates a project, requires a session and updates the content tag", async () => {
    const result = await saveProjectAction({}, projectForm());
    expect(result.errors).toBeUndefined();
    expect(result.id).toBeTruthy();
    expect(requireSession).toHaveBeenCalled();
    expect(updateTag).toHaveBeenCalledWith("content");
    expect((await getProjects()).map((p) => p.slug)).toEqual(["demo"]);
  });

  test("a duplicate slug returns a field error, not a throw (Review Focus 1)", async () => {
    await saveProjectAction({}, projectForm());
    const result = await saveProjectAction({}, projectForm({ title: "Other" }));
    expect(result.errors).toEqual({ slug: "already in use" });
    expect((await getProjects({ includeUnpublished: true })).length).toBe(1);
  });

  test("an invalid slug returns a field error", async () => {
    const result = await saveProjectAction({}, projectForm({ slug: "Not Valid" }));
    expect(result.errors?.slug).toMatch(/lowercase/);
    expect(updateTag).not.toHaveBeenCalled();
  });

  test("editing keeps the same id and may keep its own slug", async () => {
    const { id } = await saveProjectAction({}, projectForm());
    const result = await saveProjectAction({}, projectForm({ id: id!, title: "Demo 2" }));
    expect(result.id).toBe(id);
    expect((await getProjects())[0].title).toBe("Demo 2");
  });

  test("togglePublishAction flips published and reorderAction sets order", async () => {
    const a = (await saveProjectAction({}, projectForm())).id!;
    const b = (await saveProjectAction({}, projectForm({ slug: "two", sortOrder: "20" }))).id!;
    await togglePublishAction(a);
    expect((await getProjects()).map((p) => p.slug)).toEqual(["two"]);
    await togglePublishAction(a);
    await reorderAction([b, a]);
    expect((await getProjects()).map((p) => p.slug)).toEqual(["two", "demo"]);
  });

  test("deleteProjectAction requires the typed slug to match", async () => {
    const a = (await saveProjectAction({}, projectForm())).id!;
    const fd = new FormData();
    fd.set("id", a);
    fd.set("confirm", "wrong");
    const refused = await deleteProjectAction({}, fd);
    expect(refused.errors?.confirm).toBeTruthy();
    expect((await getProjects()).length).toBe(1);
    fd.set("confirm", "demo");
    const ok = await deleteProjectAction({}, fd);
    expect(ok.errors).toBeUndefined();
    expect((await getProjects()).length).toBe(0);
    expect(updateTag).toHaveBeenCalledWith("content");
  });

  test("saveSettingsAction validates email and saves", async () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries({ headline: "H", subhead: "", intro: "", aboutShort: "", email: "nope", location: "", socialLinks: "", heroReelSlug: "" })) fd.set(k, v);
    expect((await saveSettingsAction({}, fd)).errors?.email).toBeTruthy();
    fd.set("email", "fred@example.com");
    fd.set("socialLinks", "LinkedIn https://linkedin.com/in/fred\nGitHub https://github.com/fred");
    expect((await saveSettingsAction({}, fd)).errors).toBeUndefined();
    const s = await getSiteSettings();
    expect(s.headline).toBe("H");
    expect(s.socialLinks).toEqual([{ label: "LinkedIn", url: "https://linkedin.com/in/fred" }, { label: "GitHub", url: "https://github.com/fred" }]);
  });
});
