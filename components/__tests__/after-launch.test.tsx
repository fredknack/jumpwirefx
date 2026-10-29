import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AfterLaunch } from "@/components/after-launch";

describe("AfterLaunch", () => {
  test("shows the two after-launch promises and links to the remote content page", () => {
    render(<AfterLaunch href="/services/remote-content-and-usage-data" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/keeps working after launch/i);
    expect(screen.getByRole("heading", { level: 3, name: /update it from anywhere/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /see what visitors did/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /how it works/i })).toHaveAttribute("href", "/services/remote-content-and-usage-data");
  });

  test("renders nothing without a target page", () => {
    const { container } = render(<AfterLaunch href={null} />);
    expect(container.innerHTML).toBe("");
  });
});
