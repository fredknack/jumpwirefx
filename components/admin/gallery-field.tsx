"use client";

import { useId, useState } from "react";
import { inputClass } from "@/components/admin/field";
import { uploadMedia } from "@/lib/admin/upload-client";
import type { Media } from "@/lib/types";

type Item = Media & { key: string };
let seq = 0;
const withKey = (m: Media): Item => ({ ...m, key: `g${++seq}` });

/**
 * Gallery editor: ordered images with alt text, add via multi-file upload,
 * remove, reorder. Emits repeated galleryUrl/Alt/Width/Height fields plus
 * galleryPresent so the action knows an empty list means "cleared".
 */
export function GalleryField({ value, error }: { value: Media[]; error?: string }) {
  const id = useId();
  const [items, setItems] = useState<Item[]>(() => value.map(withKey));
  const [busy, setBusy] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const update = (key: string, patch: Partial<Media>) => setItems((list) => list.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  const remove = (key: string) => setItems((list) => list.filter((it) => it.key !== key));
  const move = (key: string, dir: -1 | 1) =>
    setItems((list) => {
      const i = list.findIndex((it) => it.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        setBusy(file.name);
        const up = await uploadMedia(file, "image");
        setItems((list) => [...list, withKey({ url: up.url, alt: "", width: up.width, height: up.height })]);
      }
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <fieldset className="rounded-lg border border-white/10 p-4">
      <legend className="px-1 text-sm font-medium text-white/80">Gallery</legend>
      <input type="hidden" name="galleryPresent" value="1" />
      {items.length === 0 && <p className="text-sm text-white/50">No gallery images yet.</p>}
      <ol className="space-y-3">
        {items.map((it, i) => {
          const label = it.alt || `image ${i + 1}`;
          return (
            <li key={it.key} className="flex flex-wrap items-start gap-3 rounded-md border border-white/10 p-3">
              <input type="hidden" name="galleryUrl" value={it.url} />
              <input type="hidden" name="galleryWidth" value={it.width ?? ""} />
              <input type="hidden" name="galleryHeight" value={it.height ?? ""} />
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt={it.alt} className="h-full w-full object-cover" />
              </div>
              <label className="min-w-0 flex-1" htmlFor={`${id}-alt-${it.key}`}>
                <span className="text-sm text-white/70">Alt text</span>
                <input id={`${id}-alt-${it.key}`} name="galleryAlt" value={it.alt} onChange={(e) => update(it.key, { alt: e.target.value })} className={inputClass} />
                <span className="mt-1 block truncate text-xs text-white/40">{it.url}</span>
              </label>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(it.key, -1)} disabled={i === 0} aria-label={`Move ${label} up`} className="rounded border border-white/20 px-2 py-1 text-sm disabled:opacity-30">
                  ▲
                </button>
                <button type="button" onClick={() => move(it.key, 1)} disabled={i === items.length - 1} aria-label={`Move ${label} down`} className="rounded border border-white/20 px-2 py-1 text-sm disabled:opacity-30">
                  ▼
                </button>
                <button type="button" onClick={() => remove(it.key)} aria-label={`Remove ${label}`} className="rounded border border-brand-deep/60 px-2 py-1 text-sm text-white/80 hover:bg-brand-deep/40">
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <label className="mt-4 block" htmlFor={`${id}-files`}>
        <span className="text-sm text-white/70">Add images</span>
        <input id={`${id}-files`} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy !== null} onChange={(e) => addFiles(e.target.files)} className="mt-1 block w-full text-sm text-white/70" />
      </label>
      {busy && <p className="mt-2 text-sm text-white/60">Uploading {busy}…</p>}
      {(uploadError || error) && (
        <p role="alert" className="mt-2 text-sm text-brand-light">
          {uploadError ?? error}
        </p>
      )}
    </fieldset>
  );
}
