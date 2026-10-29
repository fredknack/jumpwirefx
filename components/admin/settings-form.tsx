"use client";

import { useActionState, useId } from "react";
import { saveSettingsAction, type ActionState } from "@/app/admin/actions";
import { Field, describedBy, inputClass } from "@/components/admin/field";
import type { SiteSettings } from "@/lib/types";

type ReelOption = { slug: string; title: string };

export function SettingsForm({ settings, reelOptions = [] }: { settings: SiteSettings; reelOptions?: ReelOption[] }) {
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
      <Field id={`${id}-reel`} label="Hero reel" error={e.heroReelSlug} hint="Project whose video plays on the home page">
        <select id={`${id}-reel`} name="heroReelSlug" defaultValue={settings.heroReelSlug} className={inputClass}>
          <option value="">None</option>
          {reelOptions.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.title}
            </option>
          ))}
        </select>
      </Field>
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
