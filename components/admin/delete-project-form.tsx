"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId } from "react";
import { deleteProjectAction, type ActionState } from "@/app/admin/actions";
import { Field, describedBy, inputClass } from "@/components/admin/field";

export function DeleteProjectForm({ id, slug }: { id: string; slug: string }) {
  const fid = useId();
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(deleteProjectAction, {});
  useEffect(() => {
    if (state.ok) router.replace("/admin");
  }, [state.ok, router]);
  const err = state.errors?.confirm ?? state.errors?.form;
  return (
    <form action={action} className="mt-12 rounded-lg border border-brand-deep/60 p-4">
      <h2 className="text-lg font-semibold">Delete this project</h2>
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
