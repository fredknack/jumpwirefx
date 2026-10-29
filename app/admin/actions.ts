"use server";

import { updateTag } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { getContentDb } from "@/lib/content";
import { fieldErrors, formHasGallery, formToProjectInput, formToSettings, projectInputSchema, settingsSchema } from "@/lib/admin/project-schema";
import { formToServiceInput, serviceInputSchema } from "@/lib/admin/service-schema";
import { deleteProject, deleteService, findProject, findProjectById, findService, findServiceById, reorderProjects, reorderServices, saveSettings, upsertProject, upsertService } from "@/lib/db/queries";

export type ActionState = { errors?: Record<string, string>; id?: string; ok?: boolean };

const isUniqueViolation = (e: unknown) => (e as { cause?: { code?: string } })?.cause?.code === "23505";

export async function saveProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = projectInputSchema.safeParse(formToProjectInput(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const db = getContentDb();
  const taken = await findProject(db, parsed.data.slug);
  if (taken && taken.id !== parsed.data.id) return { errors: { slug: "already in use" } };
  // A form without the gallery editor must never wipe an existing gallery.
  const existing = parsed.data.id && !formHasGallery(formData) ? await findProjectById(db, parsed.data.id) : null;
  const data = existing ? { ...parsed.data, gallery: existing.gallery } : parsed.data;
  try {
    const row = await upsertProject(db, data);
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

export async function saveServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = serviceInputSchema.safeParse(formToServiceInput(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const db = getContentDb();
  const taken = await findService(db, parsed.data.slug);
  if (taken && taken.id !== parsed.data.id) return { errors: { slug: "already in use" } };
  try {
    const row = await upsertService(db, parsed.data);
    updateTag("content");
    return { ok: true, id: row.id };
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: { slug: "already in use" } };
    throw e;
  }
}

export async function deleteServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const confirm = String(formData.get("confirm") ?? "").trim();
  const db = getContentDb();
  const row = await findServiceById(db, id);
  if (!row) return { errors: { form: "service not found" } };
  if (confirm !== row.slug) return { errors: { confirm: `type "${row.slug}" to confirm` } };
  await deleteService(db, id);
  updateTag("content");
  return { ok: true };
}

export async function toggleServicePublishAction(id: string): Promise<void> {
  await requireSession();
  const db = getContentDb();
  const row = await findServiceById(db, id);
  if (!row) return;
  await upsertService(db, { ...row, heroImage: row.heroImage ?? undefined, published: !row.published });
  updateTag("content");
}

export async function reorderServicesAction(ids: string[]): Promise<void> {
  await requireSession();
  await reorderServices(getContentDb(), ids);
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
