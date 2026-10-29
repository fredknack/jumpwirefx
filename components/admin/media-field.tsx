"use client";

import { useId, useState } from "react";
import { uploadMedia } from "@/lib/admin/upload-client";
import type { Media } from "@/lib/types";

type Props = {
  /** Form field prefix: produces `${name}Url` and `${name}Alt`. */
  name: string;
  label: string;
  accept: string;
  /** Initial value; the field owns its state afterwards. */
  value?: Media;
  kind?: "image" | "video";
  required?: boolean;
};

/**
 * URL + alt inputs for a media item, with a file picker that uploads straight
 * to Vercel Blob (token from /api/admin/upload) and fills the URL in.
 */
export function MediaField({ name, label, accept, value, kind = "image", required = false }: Props) {
  const id = useId();
  const [url, setUrl] = useState(value?.url ?? "");
  const [alt, setAlt] = useState(value?.alt ?? "");
  // Known pixel size travels with the URL; a new upload has none until measured.
  const [dims, setDims] = useState(value?.width && value?.height ? { width: value.width, height: value.height } : null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const uploaded = await uploadMedia(file, kind, { onProgress: setProgress });
      setUrl(uploaded.url);
      setDims(uploaded.width && uploaded.height ? { width: uploaded.width, height: uploaded.height } : null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
    }
  }

  const input = "mt-1 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-brand focus:outline-none";

  return (
    <fieldset className="rounded-lg border border-white/10 p-4">
      <legend className="px-1 text-sm font-medium text-white/80">{label}</legend>
      <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
        <div className="aspect-video overflow-hidden rounded-md bg-white/5">
          {url && kind === "video" ? (
            <video src={url} preload="metadata" controls className="h-full w-full object-cover" />
          ) : url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={alt} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="space-y-3">
          <label className="block" htmlFor={`${id}-file`}>
            <span className="text-sm text-white/70">Upload {label.toLowerCase()}</span>
            <input id={`${id}-file`} type="file" accept={accept} onChange={(e) => onFile(e.target.files?.[0])} className="mt-1 block w-full text-sm text-white/70" />
          </label>
          {progress !== null && (
            <progress value={progress} max={100} className="w-full">
              {progress}%
            </progress>
          )}
          {error && (
            <p role="alert" className="text-sm text-brand-light">
              {error}
            </p>
          )}
          <label className="block" htmlFor={`${id}-url`}>
            <span className="text-sm text-white/70">{label} URL</span>
            <input
              id={`${id}-url`}
              name={`${name}Url`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setDims(null);
              }}
              required={required}
              className={input}
            />
          </label>
          {dims && (
            <>
              <input type="hidden" name={`${name}Width`} value={dims.width} />
              <input type="hidden" name={`${name}Height`} value={dims.height} />
            </>
          )}
          <label className="block" htmlFor={`${id}-alt`}>
            <span className="text-sm text-white/70">{label} alt text</span>
            <input id={`${id}-alt`} name={`${name}Alt`} value={alt} onChange={(e) => setAlt(e.target.value)} required={required} className={input} />
          </label>
        </div>
      </div>
    </fieldset>
  );
}
