import { existsSync, renameSync, rmSync, statSync } from "node:fs";

/** ffmpeg args: H.264 High, max 1080p (even dims), CRF 23, faststart, AAC 128k. */
export function ffmpegArgs(src: string, dst: string): string[] {
  return [
    "-y",
    "-i", src,
    "-vf", "scale=-2:'min(1080,ih)'",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-preset", "slow",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    dst,
  ];
}

/** True when dst is missing or older than src. */
export function needsEncode(src: string, dst: string): boolean {
  if (!existsSync(dst)) return true;
  return statSync(src).mtimeMs > statSync(dst).mtimeMs;
}

/** ffmpeg args to grab a single frame at `atSeconds` as an image. */
export function posterArgs(src: string, dst: string, atSeconds: number): string[] {
  return ["-y", "-ss", String(atSeconds), "-i", src, "-frames:v", "1", "-q:v", "2", dst];
}

export type Runner = (cmd: string, args: string[]) => void;

/**
 * Encode `src` to `dst` atomically: ffmpeg writes `<dst>.part.mp4`, which is
 * renamed to `dst` only after it exits cleanly. An interrupted encode therefore
 * never leaves a truncated `dst` that a later run would treat as finished.
 */
export function encode(src: string, dst: string, run: Runner): void {
  const part = dst.replace(/\.mp4$/, "") + ".part.mp4";
  try {
    run("ffmpeg", ffmpegArgs(src, part));
  } catch (e) {
    rmSync(part, { force: true });
    throw e;
  }
  renameSync(part, dst);
}
