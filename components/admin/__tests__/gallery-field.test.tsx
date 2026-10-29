import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

const uploadMedia = vi.fn(async (file: File) => ({ url: `https://blob/${file.name}`, width: 800, height: 600 }));
vi.mock("@/lib/admin/upload-client", () => ({ uploadMedia: (file: File) => uploadMedia(file) }));

import { GalleryField } from "@/components/admin/gallery-field";

const items = [{ url: "/g1.jpg", alt: "one", width: 1600, height: 900 }, { url: "/g2.jpg", alt: "two" }];
const hidden = (name: string) => [...document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)].map((i) => i.value);

describe("GalleryField", () => {
  test("renders every image with editable alt text and hidden inputs in order", () => {
    render(<GalleryField value={items} />);
    expect(document.querySelector('input[name="galleryPresent"]')).not.toBeNull();
    expect(hidden("galleryUrl")).toEqual(["/g1.jpg", "/g2.jpg"]);
    expect(hidden("galleryWidth")).toEqual(["1600", ""]);
    expect(hidden("galleryHeight")).toEqual(["900", ""]);
    const alts = screen.getAllByLabelText(/alt text/i);
    expect(alts.map((a) => (a as HTMLInputElement).value)).toEqual(["one", "two"]);
    expect(alts[0]).toHaveAttribute("name", "galleryAlt");
    expect(document.querySelectorAll("img")).toHaveLength(2);
  });

  test("remove and move buttons edit the list", async () => {
    const user = userEvent.setup();
    render(<GalleryField value={items} />);
    await user.click(screen.getByRole("button", { name: /move .*two.* up/i }));
    expect(hidden("galleryUrl")).toEqual(["/g2.jpg", "/g1.jpg"]);
    await user.click(screen.getByRole("button", { name: /remove .*one/i }));
    expect(hidden("galleryUrl")).toEqual(["/g2.jpg"]);
  });

  test("adding files uploads each one and appends it with its dimensions", async () => {
    const user = userEvent.setup();
    render(<GalleryField value={[]} />);
    const input = screen.getByLabelText(/add images/i);
    expect(input).toHaveAttribute("multiple");
    await user.upload(input, [new File(["a"], "a.jpg", { type: "image/jpeg" }), new File(["b"], "b.png", { type: "image/png" })]);
    await waitFor(() => expect(hidden("galleryUrl")).toEqual(["https://blob/a.jpg", "https://blob/b.png"]));
    expect(hidden("galleryWidth")).toEqual(["800", "800"]);
    const row = within(screen.getAllByRole("listitem")[0]);
    expect(row.getByLabelText(/alt text/i)).toHaveValue("");
  });
});
