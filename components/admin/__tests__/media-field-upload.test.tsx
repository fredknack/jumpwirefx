import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

const uploadMedia = vi.fn(async () => ({ url: "https://blob.example.com/uploads/thumbnails/a.jpg", width: 1600, height: 900 }));
vi.mock("@/lib/admin/upload-client", () => ({ uploadMedia: (...a: unknown[]) => uploadMedia(...(a as [])) }));

import { MediaField } from "@/components/admin/media-field";

describe("MediaField upload", () => {
  test("uploads the chosen file and fills url plus measured dimensions into the form", async () => {
    const user = userEvent.setup();
    render(<MediaField name="thumbnail" label="Thumbnail" accept="image/*" />);
    await user.upload(screen.getByLabelText(/upload thumbnail/i), new File(["x"], "a.jpg", { type: "image/jpeg" }));
    await waitFor(() => expect(screen.getByLabelText(/thumbnail url/i)).toHaveValue("https://blob.example.com/uploads/thumbnails/a.jpg"));
    expect(document.querySelector('input[name="thumbnailWidth"]')).toHaveValue("1600");
    expect(document.querySelector('input[name="thumbnailHeight"]')).toHaveValue("900");
    const [file, kind] = uploadMedia.mock.calls[0] as unknown as [File, string];
    expect(file.name).toBe("a.jpg");
    expect(kind).toBe("image");
  });

  test("video fields upload as video", async () => {
    const user = userEvent.setup();
    render(<MediaField name="video" label="Video" accept="video/mp4" kind="video" />);
    await user.upload(screen.getByLabelText(/upload video/i), new File(["x"], "v.mp4", { type: "video/mp4" }));
    await waitFor(() => expect(uploadMedia).toHaveBeenCalled());
    expect((uploadMedia.mock.calls.at(-1) as unknown as [File, string])[1]).toBe("video");
  });
});
