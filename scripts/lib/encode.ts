import { existsSync, statSync } from "node:fs";

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
