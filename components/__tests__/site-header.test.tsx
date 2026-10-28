import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  test("links the brand name home and offers Work and Contact", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /fred knack/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});
