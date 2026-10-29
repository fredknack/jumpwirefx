import { describe, expect, test } from "vitest";
import { existsSync, mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { encode, ffmpegArgs, needsEncode, posterArgs } from "@/scripts/lib/encode";

describe("ffmpegArgs", () => {
  const args = ffmpegArgs("in.mp4", "out.mp4");
  const joined = args.join(" ");

  test("encodes H.264 High at CRF 23 with faststart and 128k AAC", () => {
    expect(joined).toContain("-c:v libx264");
    expect(joined).toContain("-profile:v high");
    expect(joined).toContain("-crf 23");
    expect(joined).toContain("-movflags +faststart");
    expect(joined).toContain("-c:a aac");
    expect(joined).toContain("-b:a 128k");
  });

  test("caps height at 1080 and keeps dimensions even", () => {
    const vf = args[args.indexOf("-vf") + 1];
    expect(vf).toMatch(/scale=.*min\(1080,ih\)/);
    expect(vf).toMatch(/-2/);
  });

  test("ends with the output path and overwrites", () => {
    expect(args[0]).toBe("-y");
    expect(args[args.length - 1]).toBe("out.mp4");
  });
});

describe("needsEncode", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "enc-"));
  const src = path.join(dir, "src.mp4");
  const dst = path.join(dir, "dst.mp4");
  writeFileSync(src, "x");

  test("true when the output is missing", () => {
    expect(needsEncode(src, dst)).toBe(true);
  });

  test("false when the output is newer than the source", () => {
    writeFileSync(dst, "y");
    utimesSync(src, new Date(1000), new Date(1000));
    expect(needsEncode(src, dst)).toBe(false);
  });

  test("true when the source is newer than the output", () => {
    utimesSync(dst, new Date(1000), new Date(1000));
    utimesSync(src, new Date(), new Date());
    expect(needsEncode(src, dst)).toBe(true);
  });
});

describe("posterArgs", () => {
  test("seeks to the requested second and grabs one frame", () => {
    const args = posterArgs("in.mp4", "poster.jpg", 12.5);
    const joined = args.join(" ");
    expect(joined).toContain("-ss 12.5");
    expect(joined).toContain("-frames:v 1");
    expect(args[args.length - 1]).toBe("poster.jpg");
  });
});

describe("encode", () => {
  test("writes to a .part file and renames only after ffmpeg succeeds", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "enc-"));
    const src = path.join(dir, "src.mp4");
    const dst = path.join(dir, "dst.mp4");
    writeFileSync(src, "x");
    const seen: string[] = [];
    encode(src, dst, (_cmd, args) => {
      const out = args[args.length - 1];
      seen.push(out);
      writeFileSync(out, "encoded");
    });
    expect(seen[0]).not.toBe(dst);
    expect(seen[0]).toMatch(/\.part\.mp4$/);
    expect(existsSync(dst)).toBe(true);
    expect(existsSync(seen[0])).toBe(false);
  });

  test("leaves no output behind when ffmpeg fails, so the next run re-encodes", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "enc-"));
    const src = path.join(dir, "src.mp4");
    const dst = path.join(dir, "dst.mp4");
    writeFileSync(src, "x");
    expect(() =>
      encode(src, dst, (_cmd, args) => {
        writeFileSync(args[args.length - 1], "trunc");
        throw new Error("ffmpeg failed");
      }),
    ).toThrow(/ffmpeg failed/);
    expect(existsSync(dst)).toBe(false);
    expect(needsEncode(src, dst)).toBe(true);
  });
});
