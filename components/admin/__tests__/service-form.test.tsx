import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { Service } from "@/lib/types";

vi.mock("@/app/admin/actions", () => ({ saveServiceAction: vi.fn(async () => ({ errors: { slug: "already in use" } })) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }) }));

import { ServiceForm } from "@/components/admin/service-form";

const service: Service = {
  id: "11111111-1111-4111-8111-111111111111", slug: "trade-show-kiosks", title: "Trade show kiosks", tagline: "Tag", summary: "Sum", body: "## Body",
  heroImage: { url: "/h.jpg", alt: "Hero" }, projectSlugs: ["two"], sortOrder: 10, published: true,
};
const options = [{ slug: "one", title: "One", published: true }, { slug: "two", title: "Two", published: false }];

describe("ServiceForm", () => {
  test("renders every field with current values and related-project checkboxes", () => {
    render(<ServiceForm service={service} projectOptions={options} />);
    expect(screen.getByLabelText(/^title/i)).toHaveValue("Trade show kiosks");
    expect(screen.getByLabelText(/^slug/i)).toHaveValue("trade-show-kiosks");
    expect(screen.getByLabelText(/tagline/i)).toHaveValue("Tag");
    expect(screen.getByLabelText(/summary/i)).toHaveValue("Sum");
    expect(screen.getByLabelText(/^body/i)).toHaveValue("## Body");
    expect(screen.getByLabelText(/hero image url/i)).toHaveValue("/h.jpg");
    expect(screen.getByLabelText(/sort order/i)).toHaveValue(10);
    expect(screen.getByLabelText(/published/i)).toBeChecked();
    expect(screen.getByLabelText(/^one$/i)).not.toBeChecked();
    expect(screen.getByLabelText(/two \(draft\)/i)).toBeChecked();
    expect(screen.getByLabelText(/two \(draft\)/i)).toHaveAttribute("name", "projectSlugs");
    expect(document.querySelector('input[name="id"]')).toHaveValue(service.id);
  });
});
