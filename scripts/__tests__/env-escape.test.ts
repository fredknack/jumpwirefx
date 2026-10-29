import { describe, expect, test } from "vitest";
import { envEscape } from "@/scripts/lib/env-escape";

describe("envEscape", () => {
  test("escapes every $ so Next's .env expansion leaves a bcrypt hash intact", () => {
    expect(envEscape("$2b$10$abcDEF/ghi.jkl")).toBe("\\$2b\\$10\\$abcDEF/ghi.jkl");
  });
  test("leaves values without $ alone", () => {
    expect(envEscape("plain-value")).toBe("plain-value");
  });
});
