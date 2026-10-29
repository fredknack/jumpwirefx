import { describe, expect, test } from "vitest";
import { mergeMediaJson, type MediaEntry } from "@/scripts/lib/media-json";

const thumb = (slug: string) => ({ url: `/media/${slug}/thumb.jpg`, width: 1280, height: 720, alt: slug });
const vid = (slug: string) => ({ url: `https://blob.example.com/videos/${slug}.mp4`, alt: slug });

describe("mergeMediaJson", () => {
  test("keeps an existing video URL when the fresh entry has none (--no-upload)", () => {
    const existing: Record<string, MediaEntry> = { a: { thumbnail: thumb("a"), video: vid("a") } };
    const fresh: Record<string, MediaEntry> = { a: { thumbnail: thumb("a") } };
    expect(mergeMediaJson(existing, fresh).a.video).toEqual(vid("a"));
  });

  test("a fresh video URL replaces the existing one", () => {
    const existing: Record<string, MediaEntry> = { a: { thumbnail: thumb("a"), video: vid("old-a") } };
    const fresh: Record<string, MediaEntry> = { a: { thumbnail: thumb("a"), video: vid("a") } };
    expect(mergeMediaJson(existing, fresh).a.video).toEqual(vid("a"));
  });

  test("fresh thumbnails always win", () => {
    const existing: Record<string, MediaEntry> = { a: { thumbnail: { ...thumb("a"), alt: "stale" } } };
    const fresh: Record<string, MediaEntry> = { a: { thumbnail: thumb("a") } };
    expect(mergeMediaJson(existing, fresh).a.thumbnail.alt).toBe("a");
  });

  test("entries only in the existing file are preserved", () => {
    const existing: Record<string, MediaEntry> = { b: { thumbnail: thumb("b"), video: vid("b") } };
    const fresh: Record<string, MediaEntry> = { a: { thumbnail: thumb("a") } };
    expect(Object.keys(mergeMediaJson(existing, fresh)).sort()).toEqual(["a", "b"]);
  });
});
