"use server";

import { updateTag } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { getContentDb } from "@/lib/content";
import { fieldErrors, formToProjectInput, formToSettings, projectInputSchema, settingsSchema } from "@/lib/admin/project-schema";
import { deleteProject, findProject, findProjectById, reorderProjects, saveSettings, upsertProject } from "@/lib/db/queries";

export type ActionState = { errors?: Record<string, string>; id?: string; ok?: boolean };

const isUniqueViolation = (e: unknown) => (e as { cause?: { code?: string } })?.cause?.code === "23505";

export async function saveProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = projectInputSchema.safeParse(formToProjectInput(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const db = getContentDb();
  const taken = await findProject(db, parsed.data.slug);
  if (taken && taken.id !== parsed.data.id) return { errors: { slug: "already in use" } };
  try {
    const row = await upsertProject(db, parsed.data);
    updateTag("content");
    return { ok: true, id: row.id };
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: { slug: "already in use" } };
    throw e;
  }
}

export async function deleteProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const confirm = String(formData.get("confirm") ?? "").trim();
  const db = getContentDb();
  const row = await findProjectById(db, id);
  if (!row) return { errors: { form: "project not found" } };
  if (confirm !== row.slug) return { errors: { confirm: `type "${row.slug}" to confirm` } };
  await deleteProject(db, id);
  updateTag("content");
  return { ok: true };
}

export async function togglePublishAction(id: string): Promise<void> {
  await requireSession();
  const db = getContentDb();
  const row = await findProjectById(db, id);
  if (!row) return;
  await upsertProject(db, { ...row, client: row.client ?? undefined, year: row.year ?? undefined, video: row.video ?? undefined, published: !row.published });
  updateTag("content");
}

export async function reorderAction(ids: string[]): Promise<void> {
  await requireSession();
  await reorderProjects(getContentDb(), ids);
  updateTag("content");
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = settingsSchema.safeParse(formToSettings(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  await saveSettings(getContentDb(), parsed.data);
  updateTag("content");
  return { ok: true };
}
