/**
 * Media pipeline: re-encode source videos, build poster thumbnails, upload
 * videos to Vercel Blob, and write content/media.json.
 *
 *   pnpm media              encode + thumbs + upload
 *   pnpm media --no-upload  encode + thumbs only (video left undefined)
 *
 * Safe to re-run: encodes are skipped when the output is newer than the
 * source, and media.json is only written once every step has succeeded.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ffmpegArgs, needsEncode, posterArgs } from "./lib/encode";
import { uploadVideo } from "./lib/upload";
import { projects } from "../content/projects";
import type { Media } from "../lib/types";

const ROOT = path.resolve(__dirname, "..");
const REF = path.join(ROOT, "_reference/firebase-export/public/assets");
const ENCODED = path.join(ROOT, "_reference/encoded");
const PUBLIC = path.join(ROOT, "public/media");
const OUT_JSON = path.join(ROOT, "content/media.json");
const NO_UPLOAD = process.argv.includes("--no-upload");

type Source = { video?: string; posterAt: number; thumbFrom?: string };
const SOURCES: Record<string, Source> = {
  "interactive-corporate-timeline": { video: "videos/Inflection-Wall-Case-Study.mp4", posterAt: 20, thumbFrom: "images/Inflection-Wall.jpg" },
  "netflix-cowboy-bebop-vending-machine": { video: "videos/CowBoy-Bebop-Case-Study.mp4", posterAt: 8, thumbFrom: "images/CowBoy-Bebop.jpg" },
  "nyit-interactive-video-wall": { video: "videos/NYIT-Case-Study.mp4", posterAt: 10, thumbFrom: "images/NYIT-NY.jpg" },
  "kaiser-permanente-health-quiz-kiosk": { video: "videos/Kaiser-Kiosk-Case-Study.mp4", posterAt: 15, thumbFrom: "images/KP-Kiosk.jpg" },
  "interactive-ipad-portfolio": { video: "videos/iPad-Portfolio-Case-Study.mp4", posterAt: 10, thumbFrom: "images/Portfolio.jpg" },
  "3d-first-person-shooter": { video: "videos/TTC-Case-Study.mp4", posterAt: 30, thumbFrom: "images/TTC.jpg" },
  "meta2-augmented-reality-breakout": { video: "videos/Meta2-Cylo-Case-Study.mp4", posterAt: 10, thumbFrom: "images/Breakout.jpg" },
  "interactive-work-reel": { video: "videos/Fred-Knack-Unity-Samples-V3.mp4", posterAt: 12 },
};

function run(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${r.stderr?.toString().slice(-800)}`);
}

async function main() {
  if (!NO_UPLOAD) {
    if (existsSync(path.join(ROOT, ".env.local"))) process.loadEnvFile(path.join(ROOT, ".env.local"));
    if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN missing (use --no-upload to skip)");
  }
  mkdirSync(ENCODED, { recursive: true });
  const results: Record<string, { video?: Media; thumbnail: Media }> = {};

  for (const p of projects) {
    const src = SOURCES[p.slug];
    if (!src) { console.log(`skip ${p.slug}: no source mapping`); continue; }
    const outDir = path.join(PUBLIC, p.slug);
    mkdirSync(outDir, { recursive: true });

    let encoded: string | undefined;
    if (src.video) {
      const input = path.join(REF, src.video);
      encoded = path.join(ENCODED, `${p.slug}.mp4`);
      if (needsEncode(input, encoded)) {
        console.log(`encode ${p.slug}`);
        run("ffmpeg", ffmpegArgs(input, encoded));
      } else {
        console.log(`encoded ${p.slug} (cached)`);
      }
    }

    let thumbSrc: string;
    if (src.thumbFrom) {
      thumbSrc = path.join(REF, src.thumbFrom);
    } else {
      if (!encoded) throw new Error(`${p.slug}: no thumbFrom and no video`);
      thumbSrc = path.join(ENCODED, `${p.slug}-poster.jpg`);
      run("ffmpeg", posterArgs(encoded, thumbSrc, src.posterAt));
    }
    const base = sharp(thumbSrc).resize(1280, 720, { fit: "cover", position: "attention" });
    await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(outDir, "thumb.jpg"));
    await base.clone().webp({ quality: 78 }).toFile(path.join(outDir, "thumb.webp"));

    const thumbnail: Media = { url: `/media/${p.slug}/thumb.jpg`, width: 1280, height: 720, alt: p.thumbnail.alt };
    let video: Media | undefined;
    if (encoded && !NO_UPLOAD) {
      console.log(`upload ${p.slug}`);
      video = await uploadVideo(p.slug, encoded, `${p.title} video`);
    }
    results[p.slug] = video ? { thumbnail, video } : { thumbnail };
  }

  const tmp = OUT_JSON + ".tmp";
  writeFileSync(tmp, JSON.stringify(results, null, 2) + "\n");
  renameSync(tmp, OUT_JSON);
  console.log(`wrote ${path.relative(ROOT, OUT_JSON)} (${Object.keys(results).length} entries)`);
}

main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
