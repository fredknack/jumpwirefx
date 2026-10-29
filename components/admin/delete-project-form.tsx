"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId } from "react";
import { deleteProjectAction, type ActionState } from "@/app/admin/actions";
import { Field, describedBy, inputClass } from "@/components/admin/field";

type Props = { id: string; slug: string; action?: (prev: ActionState, fd: FormData) => Promise<ActionState>; redirectTo?: string; noun?: string };

export function DeleteProjectForm({ id, slug, action: deleteAction = deleteProjectAction, redirectTo = "/admin", noun = "project" }: Props) {
  const fid = useId();
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(deleteAction, {});
  useEffect(() => {
    if (state.ok) router.replace(redirectTo);
  }, [state.ok, router, redirectTo]);
  const err = state.errors?.confirm ?? state.errors?.form;
  return (
    <form action={action} className="mt-12 rounded-lg border border-brand-deep/60 p-4">
      <h2 className="text-lg font-semibold">Delete this {noun}</h2>
      <input type="hidden" name="id" value={id} />
      <Field id={`${fid}-confirm`} label={`Type "${slug}" to confirm`} error={err} className="mt-3 max-w-sm">
        <input id={`${fid}-confirm`} name="confirm" autoComplete="off" aria-describedby={describedBy(`${fid}-confirm`, err)} className={inputClass} />
      </Field>
      <button type="submit" disabled={pending} className="mt-4 rounded-md bg-brand-deep px-4 py-2 font-medium text-white disabled:opacity-60">
        {pending ? "Deleting…" : "Delete permanently"}
      </button>
    </form>
  );
}
