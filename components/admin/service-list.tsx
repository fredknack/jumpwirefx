"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { reorderServicesAction, toggleServicePublishAction } from "@/app/admin/actions";
import type { Service } from "@/lib/types";

export function ServiceList({ services }: { services: Service[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const ids = services.map((s) => s.id);
  const move = (i: number, dir: -1 | 1) => {
    const next = [...ids];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    start(async () => {
      await reorderServicesAction(next);
      router.refresh();
    });
  };
  const toggle = (id: string) =>
    start(async () => {
      await toggleServicePublishAction(id);
      router.refresh();
    });

  if (services.length === 0) return <p className="text-white/60">No services yet.</p>;
  return (
    <ol className={`divide-y divide-white/10 rounded-lg border border-white/10 ${pending ? "opacity-60" : ""}`}>
      {services.map((s, i) => (
        <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex flex-col">
            <button type="button" onClick={() => move(i, -1)} disabled={pending || i === 0} aria-label={`Move ${s.title} up`} className="text-white/60 hover:text-white disabled:opacity-30">▲</button>
            <button type="button" onClick={() => move(i, 1)} disabled={pending || i === services.length - 1} aria-label={`Move ${s.title} down`} className="text-white/60 hover:text-white disabled:opacity-30">▼</button>
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/admin/services/${s.id}`} className="font-medium hover:text-brand">{s.title}</Link>
            <p className="truncate text-sm text-white/50">/services/{s.slug} · {s.projectSlugs.length} related</p>
          </div>
          <button type="button" onClick={() => toggle(s.id)} disabled={pending} aria-pressed={s.published} className={`rounded-full px-3 py-1 text-sm ${s.published ? "bg-brand text-black" : "border border-white/30 text-white/70"}`}>
            {s.published ? "Published" : "Draft"}
          </button>
          <Link href={`/admin/services/${s.id}`} aria-label={`Edit ${s.title}`} className="rounded-md border border-white/20 px-3 py-1 text-sm hover:border-brand hover:text-brand">Edit</Link>
          <Link href={`/services/${s.slug}`} target="_blank" className="text-sm text-white/60 hover:text-white">View</Link>
        </li>
      ))}
    </ol>
  );
}
