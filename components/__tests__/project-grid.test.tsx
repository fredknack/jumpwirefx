import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProjectGrid } from "@/components/project-grid";
import { projects } from "@/content/projects";

describe("ProjectGrid archive link", () => {
  test("links to the archive at the bottom when told there are archived projects", () => {
    render(<ProjectGrid projects={projects.slice(0, 2)} archiveCount={3} />);
    expect(screen.getByRole("link", { name: /view the archive/i })).toHaveAttribute("href", "/work/archive");
  });

  test("shows no archive link when nothing is archived", () => {
    render(<ProjectGrid projects={projects.slice(0, 2)} archiveCount={0} />);
    expect(screen.queryByRole("link", { name: /archive/i })).toBeNull();
  });
});
