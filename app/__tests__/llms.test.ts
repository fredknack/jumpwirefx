import { describe, expect, test } from "vitest";
import { GET } from "@/app/llms.txt/route";

describe("llms.txt", () => {
  test("opens with the JumpWire heading and lists every published project", async () => {
    const text = await (await GET()).text();
    expect(text.startsWith("# JumpWire — Interactive kiosks for trade shows and lobbies")).toBe(true);
    expect(text).not.toMatch(/fred knack/i);
    expect(text).toMatch(/\/work\/interactive-corporate-timeline/);
  });
});
