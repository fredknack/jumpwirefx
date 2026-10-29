"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { saveProjectAction, type ActionState } from "@/app/admin/actions";
import { Field, describedBy, inputClass } from "@/components/admin/field";
import { MediaField } from "@/components/admin/media-field";
import { Markdown } from "@/components/markdown";
import type { Project } from "@/lib/types";

const KINDS = ["kiosk", "installation", "game", "experiment"] as const;

export function ProjectForm({ project }: { project?: Project }) {
  const id = useId();
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProjectAction, {});
  const [body, setBody] = useState(project?.body ?? "");
  const e = state.errors ?? {};

  useEffect(() => {
    if (!state.ok) return;
    if (project) router.refresh();
    else if (state.id) router.replace(`/admin/projects/${state.id}`);
  }, [state.ok, state.id, project, router]);

  return (
    <form action={action} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-title`} label="Title" error={e.title}>
          <input id={`${id}-title`} name="title" defaultValue={project?.title} required aria-describedby={describedBy(`${id}-title`, e.title)} className={inputClass} />
        </Field>
        <Field id={`${id}-slug`} label="Slug" error={e.slug} hint="Leave blank to derive from the title">
          <input id={`${id}-slug`} name="slug" defaultValue={project?.slug} aria-describedby={describedBy(`${id}-slug`, e.slug)} className={inputClass} />
        </Field>
        <Field id={`${id}-tagline`} label="Tagline" error={e.tagline} className="sm:col-span-2">
          <input id={`${id}-tagline`} name="tagline" defaultValue={project?.tagline} className={inputClass} />
        </Field>
        <Field id={`${id}-client`} label="Client" error={e.client}>
          <input id={`${id}-client`} name="client" defaultValue={project?.client} className={inputClass} />
        </Field>
        <Field id={`${id}-year`} label="Year" error={e.year}>
          <input id={`${id}-year`} name="year" type="number" min={1990} max={2100} defaultValue={project?.year} className={inputClass} />
        </Field>
        <Field id={`${id}-kind`} label="Kind" error={e.kind}>
          <select id={`${id}-kind`} name="kind" defaultValue={project?.kind ?? "kiosk"} className={inputClass}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-sort`} label="Sort order" error={e.sortOrder} hint="Lower numbers first">
          <input id={`${id}-sort`} name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 100} className={inputClass} />
        </Field>
      </div>

      <Field id={`${id}-summary`} label="Summary" error={e.summary} hint="One paragraph; also the meta description">
        <textarea id={`${id}-summary`} name="summary" rows={3} defaultValue={project?.summary} className={inputClass} />
      </Field>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field id={`${id}-body`} label="Body (Markdown)" error={e.body}>
          <textarea id={`${id}-body`} name="body" rows={14} value={body} onChange={(ev) => setBody(ev.target.value)} className={`${inputClass} font-mono text-sm`} />
        </Field>
        <div>
          <p className="text-sm text-white/70">Preview</p>
          <div className="mt-1 min-h-40 rounded-md border border-white/10 p-4">
            <Markdown className="text-white/80">{body}</Markdown>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-built`} label="What I built" error={e.built} hint="One bullet per line">
          <textarea id={`${id}-built`} name="built" rows={5} defaultValue={project?.built.join("\n")} className={inputClass} />
        </Field>
        <Field id={`${id}-skills`} label="Skills" error={e.skills} hint="One per line">
          <textarea id={`${id}-skills`} name="skills" rows={5} defaultValue={project?.skills.join("\n")} className={inputClass} />
        </Field>
      </div>

      <MediaField name="thumbnail" label="Thumbnail" accept="image/jpeg,image/png,image/webp" value={project?.thumbnail} required />
      {e.thumbnail && (
        <p role="alert" className="text-sm text-brand-light">
          Thumbnail: {e.thumbnail}
        </p>
      )}
      <MediaField name="video" label="Video" accept="video/mp4" kind="video" value={project?.video} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? false} /> Published
        </label>
      </div>

      {e.form && (
        <p role="alert" className="text-sm text-brand-light">
          {e.form}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 font-medium text-black disabled:opacity-60">
          {pending ? "Saving…" : "Save project"}
        </button>
        {state.ok && project && <span className="text-sm text-white/60">Saved.</span>}
      </div>
    </form>
  );
}
