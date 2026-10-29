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
