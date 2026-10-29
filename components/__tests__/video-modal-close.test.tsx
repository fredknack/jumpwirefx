import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { VideoThumb } from "@/components/video-thumb";

const thumbnail = { url: "/media/demo/thumb.jpg", width: 1280, height: 720, alt: "Demo poster" };
const video = { url: "https://blob.example.com/videos/demo.mp4", alt: "Demo video" };

async function openModal() {
  const user = userEvent.setup();
  const utils = render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
  await user.click(screen.getByRole("button", { name: /play video/i }));
  return { user, ...utils };
}

// Every close path must go through the dialog's native close() so the browser
// lifts the modal/inert state and restores focus itself (jsdom has no top layer,
// so an explicit focus() on the play button while the dialog is still modal is a no-op in real browsers).
describe("VideoModal close paths use the native dialog close()", () => {
  afterEach(() => vi.restoreAllMocks());

  test("Escape closes through dialog.close()", async () => {
    const spy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const { user, container } = await openModal();
    await user.keyboard("{Escape}");
    expect(spy).toHaveBeenCalled();
    expect(container.querySelector("video")).toBeNull();
  });

  test("the Close button closes through dialog.close()", async () => {
    const spy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const { user, container } = await openModal();
    await user.click(screen.getByRole("button", { name: /close video/i }));
    expect(spy).toHaveBeenCalled();
    expect(container.querySelector("video")).toBeNull();
  });

  test("a backdrop click closes through dialog.close()", async () => {
    const spy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const { user, container } = await openModal();
    await user.click(container.querySelector("dialog")!);
    expect(spy).toHaveBeenCalled();
    expect(container.querySelector("video")).toBeNull();
  });

  test("the Close button sits inside the dialog box, not offset above it", async () => {
    await openModal();
    const btn = screen.getByRole("button", { name: /close video/i });
    expect(btn.className).not.toMatch(/-top-/);
    expect(btn.className).toMatch(/\btop-/);
  });
});
