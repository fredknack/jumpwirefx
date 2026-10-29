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

describe("llms.txt services", () => {
  test("has a Services section with each page and its summary", async () => {
    const text = await (await GET()).text();
    expect(text).toMatch(/## Services/);
    expect(text).toMatch(/\[Trade show kiosks\]\(https:\/\/jumpwirefx\.com\/services\/trade-show-kiosks\): /);
  });
});
