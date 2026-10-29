import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { Project } from "@/lib/types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), replace: vi.fn(), push: vi.fn() }) }));
vi.mock("@/app/admin/actions", () => ({ reorderAction: vi.fn(), togglePublishAction: vi.fn() }));

import { ProjectList } from "@/components/admin/project-list";

const mk = (slug: string, title: string): Project => ({
  id: slug, slug, title, tagline: "", kind: "kiosk", summary: "", body: "", built: [], skills: [],
  thumbnail: { url: `/media/${slug}/thumb.jpg`, alt: title }, gallery: [], featured: false, sortOrder: 1, published: true, archived: false,
});

describe("ProjectList", () => {
  test("every row has an explicit Edit link to the editor and a thumbnail", () => {
    render(<ProjectList projects={[mk("a", "Alpha"), mk("b", "Beta")]} />);
    const edits = screen.getAllByRole("link", { name: /edit alpha|edit beta/i });
    expect(edits).toHaveLength(2);
    expect(edits[0]).toHaveAttribute("href", "/admin/projects/a");
    expect(document.querySelectorAll("img")).toHaveLength(2);
  });
});

describe("ProjectList archive", () => {
  test("offers Archive on active rows, Unarchive on archived rows, grouped under an Archive heading", () => {
    render(<ProjectList projects={[mk("a", "Alpha"), { ...mk("b", "Beta"), archived: true }]} />);
    expect(screen.getByRole("button", { name: /archive alpha/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /unarchive beta/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^archive$/i })).toBeInTheDocument();
  });
});
