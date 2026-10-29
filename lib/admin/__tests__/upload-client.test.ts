import { describe, expect, test, vi } from "vitest";
import { blobPathFor, uploadMedia } from "@/lib/admin/upload-client";

describe("blobPathFor", () => {
  test("puts images under uploads/thumbnails and videos under uploads/videos with a safe name", () => {
    expect(blobPathFor("My Photo (1).JPG", "image")).toBe("uploads/thumbnails/My-Photo-1-.JPG");
    expect(blobPathFor("reel.mp4", "video")).toBe("uploads/videos/reel.mp4");
  });
});

describe("uploadMedia", () => {
  test("uploads, measures, and returns url with dimensions; videos are multipart", async () => {
    const upload = vi.fn(async () => ({ url: "https://blob/x.mp4" }));
    const measure = vi.fn(async () => ({ width: 1920, height: 1080 }));
    const progress: number[] = [];
    const file = new File(["x"], "clip.mp4", { type: "video/mp4" });
    const result = await uploadMedia(file, "video", { upload, measure, onProgress: (p) => progress.push(p) });
    expect(result).toEqual({ url: "https://blob/x.mp4", width: 1920, height: 1080 });
    const [pathname, f, opts] = upload.mock.calls[0] as unknown as [string, File, { multipart: boolean; handleUploadUrl: string; access: string; onUploadProgress: (p: { percentage: number }) => void }];
    expect(pathname).toBe("uploads/videos/clip.mp4");
    expect(f).toBe(file);
    expect(opts.multipart).toBe(true);
    expect(opts.handleUploadUrl).toBe("/api/admin/upload");
    opts.onUploadProgress({ percentage: 42 });
    expect(progress).toEqual([42]);
    expect(measure).toHaveBeenCalledWith(file);
  });

  test("a failed measurement still returns the url without dimensions", async () => {
    const upload = vi.fn(async () => ({ url: "https://blob/a.jpg" }));
    const measure = vi.fn(async () => { throw new Error("no decoder"); });
    const result = await uploadMedia(new File(["x"], "a.jpg", { type: "image/jpeg" }), "image", { upload, measure });
    expect(result).toEqual({ url: "https://blob/a.jpg" });
    expect((upload.mock.calls[0] as unknown as [string, File, { multipart: boolean }])[2].multipart).toBe(false);
  });
});
