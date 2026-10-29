"use client";

import { upload as blobUpload } from "@vercel/blob/client";

export type MediaKind = "image" | "video";
export type Uploaded = { url: string; width?: number; height?: number };
type Size = { width: number; height: number };

/** The slice of @vercel/blob's upload() this module relies on; injectable for tests. */
type UploadFn = (
  pathname: string,
  body: File,
  options: { access: "public"; handleUploadUrl: string; multipart: boolean; onUploadProgress: (p: { percentage: number }) => void },
) => Promise<{ url: string }>;

type Deps = {
  upload?: UploadFn;
  measure?: (file: File) => Promise<Size>;
  onProgress?: (percentage: number) => void;
};

/** Blob pathname for an admin upload: uploads/{thumbnails|videos}/<safe-name>. */
export function blobPathFor(fileName: string, kind: MediaKind): string {
  const safe = fileName.replace(/[^A-Za-z0-9._-]+/g, "-");
  return `uploads/${kind === "video" ? "videos" : "thumbnails"}/${safe}`;
}

/** Pixel size of an image or video file, decoded in the browser. */
export async function measureMedia(file: File): Promise<Size> {
  const url = URL.createObjectURL(file);
  try {
    if (file.type.startsWith("video/")) {
      return await new Promise<Size>((resolve, reject) => {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => resolve({ width: v.videoWidth, height: v.videoHeight });
        v.onerror = () => reject(new Error("could not read video metadata"));
        v.src = url;
      });
    }
    return await new Promise<Size>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("could not decode image"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Upload a file browser-to-Blob through the session-gated token route and
 * return its public URL plus measured dimensions (omitted if measuring fails).
 */
export async function uploadMedia(file: File, kind: MediaKind, deps: Deps = {}): Promise<Uploaded> {
  const { upload = blobUpload, measure = measureMedia, onProgress } = deps;
  const blob = await upload(blobPathFor(file.name, kind), file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    multipart: kind === "video",
    onUploadProgress: (p) => onProgress?.(p.percentage),
  });
  try {
    const { width, height } = await measure(file);
    return width > 0 && height > 0 ? { url: blob.url, width, height } : { url: blob.url };
  } catch {
    return { url: blob.url };
  }
}
