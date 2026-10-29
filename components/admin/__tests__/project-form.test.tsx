import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { Project } from "@/lib/types";

const saveProjectAction = vi.fn(async () => ({ errors: { slug: "already in use" } }));
vi.mock("@/app/admin/actions", () => ({ saveProjectAction: (...a: unknown[]) => saveProjectAction(...(a as [])) }));
const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), refresh, push: vi.fn() }) }));

import { ProjectForm } from "@/components/admin/project-form";

const project: Project = {
  id: "11111111-1111-4111-8111-111111111111", slug: "demo-kiosk", title: "Demo Kiosk", tagline: "A kiosk", client: "Acme", year: 2024, kind: "installation",
  summary: "Summary text", body: "## Body\n\nText", built: ["LED strips", "Buttons"], skills: ["Unity", "Arduino"],
  thumbnail: { url: "/media/demo-kiosk/thumb.jpg", alt: "Demo poster" }, video: { url: "https://x/v.mp4", alt: "Demo video" },
  gallery: [], featured: true, sortOrder: 20, published: true,
};

describe("ProjectForm", () => {
  test("renders every field with the project's current values", () => {
    render(<ProjectForm project={project} />);
    expect(screen.getByLabelText(/^title/i)).toHaveValue("Demo Kiosk");
    expect(screen.getByLabelText(/^slug/i)).toHaveValue("demo-kiosk");
    expect(screen.getByLabelText(/tagline/i)).toHaveValue("A kiosk");
    expect(screen.getByLabelText(/client/i)).toHaveValue("Acme");
    expect(screen.getByLabelText(/year/i)).toHaveValue(2024);
    expect(screen.getByLabelText(/kind/i)).toHaveValue("installation");
    expect(screen.getByLabelText(/summary/i)).toHaveValue("Summary text");
    expect(screen.getByLabelText(/^body/i)).toHaveValue("## Body\n\nText");
    expect(screen.getByLabelText(/what i built/i)).toHaveValue("LED strips\nButtons");
    expect(screen.getByLabelText(/skills/i)).toHaveValue("Unity\nArduino");
    expect(screen.getByLabelText(/thumbnail url/i)).toHaveValue("/media/demo-kiosk/thumb.jpg");
    expect(screen.getByLabelText(/video url/i)).toHaveValue("https://x/v.mp4");
    expect(screen.getByLabelText(/featured/i)).toBeChecked();
    expect(screen.getByLabelText(/sort order/i)).toHaveValue(20);
    expect(screen.getByLabelText(/published/i)).toBeChecked();
    expect(document.querySelector('input[name="id"]')).toHaveValue(project.id);
  });

  test("a new project form starts empty, unpublished, with kind kiosk", () => {
    render(<ProjectForm />);
    expect(screen.getByLabelText(/^title/i)).toHaveValue("");
    expect(screen.getByLabelText(/published/i)).not.toBeChecked();
    expect(screen.getByLabelText(/kind/i)).toHaveValue("kiosk");
    expect(document.querySelector('input[name="id"]')).toBeNull();
  });

  test("shows a slug error returned from the action next to the slug field", async () => {
    const user = userEvent.setup();
    render(<ProjectForm project={project} />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText("already in use")).toBeInTheDocument();
    expect(screen.getByLabelText(/^slug/i)).toHaveAccessibleDescription(/already in use/);
    expect(saveProjectAction).toHaveBeenCalled();
  });
});

describe("ProjectForm after a successful edit", () => {
  test("refreshes the route so sibling forms see the new slug", async () => {
    const user = userEvent.setup();
    saveProjectAction.mockResolvedValueOnce({ ok: true, id: project.id } as never);
    render(<ProjectForm project={project} />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByText("Saved.");
    expect(refresh).toHaveBeenCalled();
  });
});
