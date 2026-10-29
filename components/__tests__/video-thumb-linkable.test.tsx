import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { VideoThumb } from "@/components/video-thumb";

const thumbnail = { url: "/media/demo/thumb.jpg", width: 1280, height: 720, alt: "Demo poster" };
const video = { url: "https://blob.example.com/videos/demo.mp4", alt: "Demo video" };

describe("VideoThumb linkable (?video=1)", () => {
  beforeEach(() => window.history.replaceState(null, "", "/work/demo"));
  afterEach(() => window.history.replaceState(null, "", "/"));

  test("opens the modal on load when the URL has ?video=1", async () => {
    window.history.replaceState(null, "", "/work/demo?video=1");
    const { container } = render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" linkable />);
    expect(await screen.findByRole("button", { name: /close video/i })).toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeNull();
  });

  test("adds ?video=1 while open and removes it on close", async () => {
    const user = userEvent.setup();
    render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" linkable />);
    await user.click(screen.getByRole("button", { name: /play video/i }));
    expect(window.location.search).toBe("?video=1");
    await user.keyboard("{Escape}");
    expect(window.location.search).toBe("");
    expect(window.location.pathname).toBe("/work/demo");
  });

  test("does not touch the URL when not linkable", async () => {
    const user = userEvent.setup();
    render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
    await user.click(screen.getByRole("button", { name: /play video/i }));
    expect(window.location.search).toBe("");
  });

  test("ignores ?video=1 when not linkable", () => {
    window.history.replaceState(null, "", "/?video=1");
    const { container } = render(<VideoThumb thumbnail={thumbnail} video={video} title="Demo" />);
    expect(container.querySelector("video")).toBeNull();
  });
});
