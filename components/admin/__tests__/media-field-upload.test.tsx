import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

const upload = vi.fn(async () => ({ url: "https://blob.example.com/uploads/videos/v-abc.mp4" }));
vi.mock("@vercel/blob/client", () => ({ upload: (...a: unknown[]) => upload(...(a as [])) }));

import { MediaField } from "@/components/admin/media-field";

describe("MediaField upload", () => {
  test("videos upload multipart under uploads/videos and fill the URL in", async () => {
    const user = userEvent.setup();
    render(<MediaField name="video" label="Video" accept="video/mp4" kind="video" />);
    const file = new File(["x"], "My Reel (final).mp4", { type: "video/mp4" });
    await user.upload(screen.getByLabelText(/upload video/i), file);
    await waitFor(() => expect(screen.getByLabelText(/video url/i)).toHaveValue("https://blob.example.com/uploads/videos/v-abc.mp4"));
    const [pathname, , opts] = upload.mock.calls.at(-1) as unknown as [string, File, { multipart?: boolean; handleUploadUrl: string }];
    expect(pathname).toBe("uploads/videos/My-Reel-final-.mp4");
    expect(opts.multipart).toBe(true);
    expect(opts.handleUploadUrl).toBe("/api/admin/upload");
  });

  test("images upload as a single request", async () => {
    const user = userEvent.setup();
    render(<MediaField name="thumbnail" label="Thumbnail" accept="image/*" />);
    await user.upload(screen.getByLabelText(/upload thumbnail/i), new File(["x"], "a.jpg", { type: "image/jpeg" }));
    await waitFor(() => expect(screen.getByLabelText(/thumbnail url/i)).toHaveValue("https://blob.example.com/uploads/videos/v-abc.mp4"));
    const [pathname, , opts] = upload.mock.calls.at(-1) as unknown as [string, File, { multipart?: boolean }];
    expect(pathname).toBe("uploads/thumbnails/a.jpg");
    expect(opts.multipart).toBe(false);
  });
});
