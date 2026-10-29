"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { saveServiceAction, type ActionState } from "@/app/admin/actions";
import { Field, describedBy, inputClass } from "@/components/admin/field";
import { GalleryField } from "@/components/admin/gallery-field";
import { MediaField } from "@/components/admin/media-field";
import { Markdown } from "@/components/markdown";
import type { Service } from "@/lib/types";

export type ProjectOption = { slug: string; title: string; published: boolean };

export function ServiceForm({ service, projectOptions }: { service?: Service; projectOptions: ProjectOption[] }) {
  const id = useId();
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(saveServiceAction, {});
  const [body, setBody] = useState(service?.body ?? "");
  const e = state.errors ?? {};

  useEffect(() => {
    if (!state.ok) return;
    if (service) router.refresh();
    else if (state.id) router.replace(`/admin/services/${state.id}`);
  }, [state.ok, state.id, service, router]);

  return (
    <form action={action} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-title`} label="Title" error={e.title}>
          <input id={`${id}-title`} name="title" defaultValue={service?.title} required aria-describedby={describedBy(`${id}-title`, e.title)} className={inputClass} />
        </Field>
        <Field id={`${id}-slug`} label="Slug" error={e.slug} hint="Leave blank to derive from the title">
          <input id={`${id}-slug`} name="slug" defaultValue={service?.slug} aria-describedby={describedBy(`${id}-slug`, e.slug)} className={inputClass} />
        </Field>
        <Field id={`${id}-tagline`} label="Tagline" error={e.tagline} className="sm:col-span-2" hint="One line under the title">
          <input id={`${id}-tagline`} name="tagline" defaultValue={service?.tagline} className={inputClass} />
        </Field>
        <Field id={`${id}-sort`} label="Sort order" error={e.sortOrder} hint="Lower numbers first">
          <input id={`${id}-sort`} name="sortOrder" type="number" defaultValue={service?.sortOrder ?? 100} className={inputClass} />
        </Field>
      </div>

      <Field id={`${id}-summary`} label="Summary" error={e.summary} hint="One paragraph; the meta description and the home-page teaser">
        <textarea id={`${id}-summary`} name="summary" rows={3} defaultValue={service?.summary} className={inputClass} />
      </Field>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field id={`${id}-body`} label="Body (Markdown)" error={e.body}>
          <textarea id={`${id}-body`} name="body" rows={18} value={body} onChange={(ev) => setBody(ev.target.value)} className={`${inputClass} font-mono text-sm`} />
        </Field>
        <div>
          <p className="text-sm text-white/70">Preview</p>
          <div className="mt-1 min-h-40 rounded-md border border-white/10 p-4">
            <Markdown className="text-white/80">{body}</Markdown>
          </div>
        </div>
      </div>

      <MediaField name="heroImage" label="Hero image" accept="image/jpeg,image/png,image/webp" value={service?.heroImage} />
      <GalleryField value={service?.gallery ?? []} error={e.gallery} label="Screenshots" />

      <fieldset className="rounded-lg border border-white/10 p-4">
        <legend className="px-1 text-sm font-medium text-white/80">Related work</legend>
        <p className="mb-3 text-xs text-white/40">Shown under the page in this order. Drafts are listed but only appear once published.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {projectOptions.map((p) => (
            <label key={p.slug} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="projectSlugs" value={p.slug} defaultChecked={service?.projectSlugs.includes(p.slug) ?? false} />
              {p.title}
              {!p.published && " (draft)"}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={service?.published ?? false} /> Published
      </label>

      {e.form && (
        <p role="alert" className="text-sm text-brand-light">
          {e.form}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 font-medium text-black disabled:opacity-60">
          {pending ? "Saving…" : "Save service"}
        </button>
        {state.ok && service && <span className="text-sm text-white/60">Saved.</span>}
      </div>
    </form>
  );
}
