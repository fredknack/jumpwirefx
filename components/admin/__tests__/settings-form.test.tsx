import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SettingsForm } from "@/components/admin/settings-form";
import { site } from "@/content/site";

vi.mock("@/app/admin/actions", () => ({ saveSettingsAction: vi.fn() }));

describe("SettingsForm", () => {
  test("offers the hero reel as a select of published slugs with the current one chosen", () => {
    render(<SettingsForm settings={site} reelOptions={[{ slug: "interactive-work-reel", title: "Reel" }, { slug: "other", title: "Other" }]} />);
    const select = screen.getByLabelText(/hero reel/i);
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("interactive-work-reel");
    expect(select).toHaveAttribute("name", "heroReelSlug");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["None", "Reel", "Other"]);
  });
});
