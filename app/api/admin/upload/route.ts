import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { hasSession } from "@/lib/auth/session";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
export const MAX_BYTES = 600 * 1024 * 1024;
const PATH_RE = /^uploads\/(thumbnails|videos)\/[A-Za-z0-9._-]+$/;

/** Mints short-lived client upload tokens for the admin (browser → Blob, bypassing the 4.5 MB body limit). */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  // Token minting needs the admin session. Blob's upload-completed webhook has no
  // cookie; handleUpload verifies its x-vercel-signature instead.
  if (body.type === "blob.generate-client-token" && !(await hasSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!PATH_RE.test(pathname)) throw new Error("uploads must go under uploads/thumbnails or uploads/videos");
        return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
