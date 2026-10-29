"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { reorderAction, toggleArchiveAction, togglePublishAction } from "@/app/admin/actions";
import type { Project } from "@/lib/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const move = (list: Project[], i: number, dir: -1 | 1) => {
    const next = list.map((p) => p.id);
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    start(async () => {
      await reorderAction(next);
      router.refresh();
    });
  };
  const toggle = (id: string) =>
    start(async () => {
      await togglePublishAction(id);
      router.refresh();
    });
  const archive = (id: string) =>
    start(async () => {
      await toggleArchiveAction(id);
      router.refresh();
    });

  if (projects.length === 0) return <p className="text-white/60">No projects yet.</p>;
  const active = projects.filter((p) => !p.archived);
  const archived = projects.filter((p) => p.archived);

  const rows = (list: Project[]) => (
    <ol className={`divide-y divide-white/10 rounded-lg border border-white/10 ${pending ? "opacity-60" : ""}`}>
      {list.map((p, i) => (
        <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex flex-col">
            <button type="button" onClick={() => move(list, i, -1)} disabled={pending || i === 0} aria-label={`Move ${p.title} up`} className="text-white/60 hover:text-white disabled:opacity-30">
              ▲
            </button>
            <button type="button" onClick={() => move(list, i, 1)} disabled={pending || i === list.length - 1} aria-label={`Move ${p.title} down`} className="text-white/60 hover:text-white disabled:opacity-30">
              ▼
            </button>
          </div>
          <div className="relative hidden h-12 w-20 shrink-0 overflow-hidden rounded bg-white/5 sm:block">
            <Image src={p.thumbnail.url} alt="" fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-brand">
              {p.title}
            </Link>
            <p className="truncate text-sm text-white/50">
              /work/{p.slug} · {p.kind}
              {p.featured ? " · featured" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle(p.id)}
            disabled={pending}
            aria-pressed={p.published}
            className={`rounded-full px-3 py-1 text-sm ${p.published ? "bg-brand text-black" : "border border-white/30 text-white/70"}`}
          >
            {p.published ? "Published" : "Draft"}
          </button>
          <button
            type="button"
            onClick={() => archive(p.id)}
            disabled={pending}
            aria-label={`${p.archived ? "Unarchive" : "Archive"} ${p.title}`}
            className="rounded-md border border-white/20 px-3 py-1 text-sm text-white/80 hover:border-white hover:text-white"
          >
            {p.archived ? "Unarchive" : "Archive"}
          </button>
          <Link href={`/admin/projects/${p.id}`} aria-label={`Edit ${p.title}`} className="rounded-md border border-white/20 px-3 py-1 text-sm hover:border-brand hover:text-brand">
            Edit
          </Link>
          <Link href={`/work/${p.slug}`} target="_blank" className="text-sm text-white/60 hover:text-white">
            View
          </Link>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="space-y-10">
      {active.length > 0 ? rows(active) : <p className="text-white/60">Every project is archived.</p>}
      {archived.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-white/80">Archive</h2>
          <p className="mb-3 text-sm text-white/50">Archived projects keep their pages and are listed at /work/archive, but stay out of the home grid and related work.</p>
          {rows(archived)}
        </section>
      )}
    </div>
  );
}
