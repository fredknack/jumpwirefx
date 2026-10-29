// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

const updateTag = vi.fn();
vi.mock("next/cache", () => ({ updateTag: (t: string) => updateTag(t), cacheTag: () => {}, cacheLife: () => {} }));
vi.mock("@/lib/auth/session", () => ({ requireSession: async () => {} }));

import { deleteServiceAction, reorderServicesAction, saveServiceAction, toggleServicePublishAction } from "@/app/admin/actions";
import { getServices, setContentDb } from "@/lib/content";
import { createTestDb } from "@/lib/db/test-db";

function form(over: Record<string, string> = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ title: "Kiosks", slug: "kiosks", tagline: "", summary: "s", body: "b", sortOrder: "10", published: "on", ...over })) fd.set(k, v);
  return fd;
}

describe("service actions", () => {
  beforeEach(async () => {
    setContentDb(await createTestDb());
    updateTag.mockClear();
  });

  test("create, duplicate slug error, edit keeps id, publish toggle, reorder, delete with typed slug", async () => {
    const created = await saveServiceAction({}, form());
    expect(created.errors).toBeUndefined();
    expect(updateTag).toHaveBeenCalledWith("content");
    expect((await saveServiceAction({}, form({ title: "Other" }))).errors).toEqual({ slug: "already in use" });
    const edited = await saveServiceAction({}, form({ id: created.id!, title: "Kiosks 2" }));
    expect(edited.id).toBe(created.id);
    const second = (await saveServiceAction({}, form({ slug: "walls", sortOrder: "20" }))).id!;
    await toggleServicePublishAction(created.id!);
    expect((await getServices()).map((s) => s.slug)).toEqual(["walls"]);
    await toggleServicePublishAction(created.id!);
    await reorderServicesAction([second, created.id!]);
    expect((await getServices()).map((s) => s.slug)).toEqual(["walls", "kiosks"]);
    const del = new FormData();
    del.set("id", created.id!);
    del.set("confirm", "wrong");
    expect((await deleteServiceAction({}, del)).errors?.confirm).toBeTruthy();
    del.set("confirm", "kiosks");
    expect((await deleteServiceAction({}, del)).errors).toBeUndefined();
    expect((await getServices()).map((s) => s.slug)).toEqual(["walls"]);
  });
});
