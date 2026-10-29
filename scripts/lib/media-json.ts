import type { Media } from "../../lib/types";

export type MediaEntry = { thumbnail: Media; video?: Media };

/**
 * Merge a fresh pipeline run over the existing content/media.json.
 * Fresh thumbnails and videos win; a fresh entry with no video (e.g. a
 * --no-upload run) keeps the existing video URL; entries absent from the
 * fresh run are preserved.
 */
export function mergeMediaJson(
  existing: Record<string, MediaEntry>,
  fresh: Record<string, MediaEntry>,
): Record<string, MediaEntry> {
  const out: Record<string, MediaEntry> = { ...existing };
  for (const [slug, entry] of Object.entries(fresh)) {
    const video = entry.video ?? existing[slug]?.video;
    out[slug] = video ? { thumbnail: entry.thumbnail, video } : { thumbnail: entry.thumbnail };
  }
  return out;
}
