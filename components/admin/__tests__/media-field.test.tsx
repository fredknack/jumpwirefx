import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MediaField } from "@/components/admin/media-field";

describe("MediaField", () => {
  test("renders url and alt inputs named by prefix with current values, plus a file picker", () => {
    render(<MediaField name="thumbnail" label="Thumbnail" accept="image/jpeg,image/png,image/webp" value={{ url: "/media/x/thumb.jpg", alt: "X poster" }} />);
    expect(screen.getByLabelText(/thumbnail url/i)).toHaveValue("/media/x/thumb.jpg");
    expect(screen.getByLabelText(/thumbnail url/i)).toHaveAttribute("name", "thumbnailUrl");
    expect(screen.getByLabelText(/thumbnail alt/i)).toHaveValue("X poster");
    expect(screen.getByLabelText(/thumbnail alt/i)).toHaveAttribute("name", "thumbnailAlt");
    expect(screen.getByLabelText(/upload thumbnail/i)).toHaveAttribute("accept", "image/jpeg,image/png,image/webp");
  });

  test("shows an image preview for images and a video preview for mp4", () => {
    const img = render(<MediaField name="thumbnail" label="Thumbnail" accept="image/*" value={{ url: "/a.jpg", alt: "a" }} />);
    expect(img.container.querySelector("img")).toHaveAttribute("src", "/a.jpg");
    img.unmount();
    const vid = render(<MediaField name="video" label="Video" accept="video/mp4" value={{ url: "https://x/v.mp4", alt: "v" }} kind="video" />);
    expect(vid.container.querySelector("video")).toHaveAttribute("src", "https://x/v.mp4");
    expect(vid.container.querySelector("video")).toHaveAttribute("preload", "metadata");
  });
});

describe("MediaField dimensions", () => {
  test("carries width and height through hidden inputs so saves keep them", () => {
    render(<MediaField name="thumbnail" label="Thumbnail" accept="image/*" value={{ url: "/a.jpg", alt: "a", width: 1280, height: 720 }} />);
    expect(document.querySelector('input[name="thumbnailWidth"]')).toHaveValue("1280");
    expect(document.querySelector('input[name="thumbnailHeight"]')).toHaveValue("720");
  });

  test("omits the dimension inputs when the value has none", () => {
    render(<MediaField name="video" label="Video" accept="video/mp4" kind="video" value={{ url: "/v.mp4", alt: "v" }} />);
    expect(document.querySelector('input[name="videoWidth"]')).toBeNull();
  });
});
