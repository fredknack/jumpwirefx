import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/types";

const base: Project = {
  id: "p1",
  slug: "demo-kiosk",
  title: "Demo Kiosk",
  tagline: "A kiosk for demos.",
  kind: "kiosk",
  summary: "Summary.",
  body: "Body.",
  built: ["Thing one"],
  skills: ["Arduino", "Unity"],
  thumbnail: { url: "/media/demo-kiosk/thumb.jpg", width: 1280, height: 720, alt: "Demo kiosk poster" },
  gallery: [],
  featured: true,
  sortOrder: 1,
  published: true,
};

describe("ProjectCard", () => {
  test("shows title, tagline, skills and a link to the project page", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByRole("heading", { name: "Demo Kiosk" })).toBeInTheDocument();
    expect(screen.getByText("A kiosk for demos.")).toBeInTheDocument();
    expect(screen.getByText("Arduino")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /demo kiosk/i })).toHaveAttribute("href", "/work/demo-kiosk");
  });

  test("shows a play button only when the project has a video", () => {
    const { rerender } = render(<ProjectCard project={base} />);
    expect(screen.queryByRole("button", { name: /play video/i })).toBeNull();
    rerender(<ProjectCard project={{ ...base, video: { url: "https://x/v.mp4", alt: "v" } }} />);
    expect(screen.getByRole("button", { name: /play video: demo kiosk/i })).toBeInTheDocument();
  });
});
