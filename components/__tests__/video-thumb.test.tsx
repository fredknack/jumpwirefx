import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { VideoThumb } from "@/components/video-thumb";

const thumbnail = { url: "/media/demo/thumb.jpg", width: 1280, height: 720, alt: "Demo poster" };
const video = { url: "https://blob.example.com/videos/demo.mp4", alt: "Demo video" };

describe("VideoThumb", () => {
  test("renders no video element before the play button is clicked", () => {
    const { container } = render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("button", { name: /play video: demo/i })).toBeInTheDocument();
  });

  test("clicking play opens a dialog with a metadata-preload video of the source", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
    await user.click(screen.getByRole("button", { name: /play video/i }));
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(dialog!.open).toBe(true);
    const v = container.querySelector("video")!;
    expect(v).not.toBeNull();
    expect(v.getAttribute("preload")).toBe("metadata");
    expect(v.getAttribute("src")).toBe(video.url);
  });

  test("Escape closes the dialog and removes the video", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
    await user.click(screen.getByRole("button", { name: /play video/i }));
    expect(container.querySelector("video")).not.toBeNull();
    await user.keyboard("{Escape}");
    expect(container.querySelector("video")).toBeNull();
  });

  test("focus returns to the play button after closing", async () => {
    const user = userEvent.setup();
    render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
    const play = screen.getByRole("button", { name: /play video/i });
    await user.click(play);
    await user.keyboard("{Escape}");
    expect(play).toHaveFocus();
  });

  test("renders a plain image and no button when there is no video", () => {
    const { container } = render(<VideoThumb thumbnail={thumbnail} title="Demo" />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("alt", "Demo poster");
  });
});
