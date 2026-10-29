import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  test("links the brand name home and offers Work and Contact", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /jumpwire/i })).toHaveAttribute("href", "/");
    expect(screen.queryByText(/fred knack/i)).toBeNull();
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/#services");
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});
