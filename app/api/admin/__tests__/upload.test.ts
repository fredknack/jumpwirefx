// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

const hasSession = vi.fn(async () => false);
type Opts = { onBeforeGenerateToken: (p: string, c: string | null, m: boolean) => Promise<Record<string, unknown>> };
let captured: Opts | undefined;
const handleUpload = vi.fn(async (opts: Opts) => {
  captured = opts;
  return { type: "blob.generate-client-token", clientToken: "tok" };
});
vi.mock("@/lib/auth/session", () => ({ hasSession: () => hasSession() }));
vi.mock("@vercel/blob/client", () => ({ handleUpload: (o: Opts) => handleUpload(o) }));

import { POST } from "@/app/api/admin/upload/route";

const body = { type: "blob.generate-client-token", payload: { pathname: "uploads/thumbnails/a.jpg", callbackUrl: "http://localhost/api/admin/upload", clientPayload: null, multipart: false } };
const post = () => POST(new Request("http://localhost/api/admin/upload", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } }));

describe("POST /api/admin/upload", () => {
  beforeEach(() => {
    handleUpload.mockClear();
    captured = undefined;
  });

  test("without a session returns 401 and never mints a token (Review Focus 3)", async () => {
    hasSession.mockResolvedValueOnce(false);
    const res = await post();
    expect(res.status).toBe(401);
    expect(handleUpload).not.toHaveBeenCalled();
  });

  test("with a session restricts content types to jpeg/png/webp/mp4 and 600 MB", async () => {
    hasSession.mockResolvedValueOnce(true);
    const res = await post();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ clientToken: "tok" });
    const opts = await captured!.onBeforeGenerateToken("uploads/thumbnails/a.jpg", null, false);
    expect(opts.allowedContentTypes).toEqual(["image/jpeg", "image/png", "image/webp", "video/mp4"]);
    expect(opts.maximumSizeInBytes).toBe(600 * 1024 * 1024);
    expect(opts.addRandomSuffix).toBe(true);
  });

  test("rejects pathnames outside uploads/", async () => {
    hasSession.mockResolvedValueOnce(true);
    await post();
    await expect(captured!.onBeforeGenerateToken("videos/interactive-work-reel.mp4", null, false)).rejects.toThrow(/uploads\//);
    await expect(captured!.onBeforeGenerateToken("uploads/../x", null, false)).rejects.toThrow();
  });
});
