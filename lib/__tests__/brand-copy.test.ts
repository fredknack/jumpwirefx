import { describe, expect, test } from "vitest";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

// The site is the JumpWire business, not a personal portfolio: no personal name
// in the copy, and the voice is the studio's ("we"), not "I".
describe("seed copy", () => {
  test("site settings carry no personal name or first-person voice", () => {
    for (const v of [site.intro, site.aboutShort, site.headline, site.subhead]) {
      expect(v).not.toMatch(/fred|knack/i);
      expect(v).not.toMatch(/\b(I|I'm|I’m|my|me)\b/);
    }
    expect(site.aboutShort).toMatch(/JumpWire/);
  });

  test("project copy carries no personal name or first-person voice", () => {
    for (const p of projects) {
      for (const v of [p.title, p.tagline, p.summary, p.body, ...p.built]) {
        expect(v, `${p.slug}: ${v.slice(0, 60)}`).not.toMatch(/fred|knack/i);
        expect(v, `${p.slug}: ${v.slice(0, 60)}`).not.toMatch(/\b(I|I'm|I’m|my|me)\b/);
      }
    }
  });
});
