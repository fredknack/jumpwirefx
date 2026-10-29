"use client";

import { useActionState, useId } from "react";
import { saveSettingsAction, type ActionState } from "@/app/admin/actions";
import { Field, describedBy, inputClass } from "@/components/admin/field";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const id = useId();
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettingsAction, {});
  const e = state.errors ?? {};
  const text = (name: keyof SiteSettings, label: string, rows?: number, hint?: string) => {
    const fid = `${id}-${name}`;
    const err = e[name];
    return (
      <Field id={fid} label={label} error={err} hint={hint}>
        {rows ? (
          <textarea id={fid} name={name} rows={rows} defaultValue={String(settings[name])} aria-describedby={describedBy(fid, err)} className={inputClass} />
        ) : (
          <input id={fid} name={name} defaultValue={String(settings[name])} aria-describedby={describedBy(fid, err)} className={inputClass} />
        )}
      </Field>
    );
  };
  return (
    <form action={action} className="space-y-5">
      {text("headline", "Headline")}
      {text("subhead", "Subhead")}
      {text("intro", "Intro", 4)}
      {text("aboutShort", "About (short)", 4)}
      {text("email", "Contact email")}
      {text("location", "Location")}
      {text("heroReelSlug", "Hero reel project slug", undefined, "Slug of the project whose video plays on the home page")}
      <Field id={`${id}-social`} label="Social links" error={e.socialLinks} hint='One per line: "Label https://url"'>
        <textarea id={`${id}-social`} name="socialLinks" rows={4} defaultValue={settings.socialLinks.map((l) => `${l.label} ${l.url}`).join("\n")} className={inputClass} />
      </Field>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 font-medium text-black disabled:opacity-60">
          {pending ? "Saving…" : "Save settings"}
        </button>
        {state.ok && <span className="text-sm text-white/60">Saved.</span>}
      </div>
    </form>
  );
}
