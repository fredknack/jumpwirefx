import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ServiceCards } from "@/components/service-cards";
import { services } from "@/content/services";

describe("ServiceCards", () => {
  test("renders a section with id services and a card linking to each service page", () => {
    render(<ServiceCards services={services} />);
    expect(document.querySelector("section#services")).not.toBeNull();
    for (const s of services) {
      expect(screen.getByRole("link", { name: s.title })).toHaveAttribute("href", `/services/${s.slug}`);
      expect(screen.getByText(s.summary)).toBeInTheDocument();
    }
  });

  test("renders nothing when there are no services", () => {
    const { container } = render(<ServiceCards services={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("ServiceCards layout", () => {
  test("a lone card in the last row spans all three columns", () => {
    render(<ServiceCards services={services} />);
    const cards = document.querySelectorAll("article");
    expect(cards).toHaveLength(4);
    expect(cards[3].className).toMatch(/md:col-span-3/);
    expect(cards[0].className).not.toMatch(/md:col-span-3/);
  });

  test("a full row needs no spanning card", () => {
    render(<ServiceCards services={services.slice(0, 3)} />);
    for (const c of document.querySelectorAll("article")) expect(c.className).not.toMatch(/md:col-span-3/);
  });
});
