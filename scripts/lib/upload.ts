import { put } from "@vercel/blob";
import { readFileSync } from "node:fs";
import type { Media } from "@/lib/types";

/** Upload an encoded MP4 to Vercel Blob at a stable pathname and return its Media record. */
export async function uploadVideo(slug: string, file: string, alt: string): Promise<Media> {
  const body = readFileSync(file);
  const blob = await put(`videos/${slug}.mp4`, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "video/mp4",
  });
  return { url: blob.url, alt };
}
