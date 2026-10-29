// @vitest-environment node
import { beforeEach, describe, expect, test } from "vitest";
import { COOKIE_NAME, SESSION_TTL_SECONDS, createSessionToken, sessionCookieOptions, verifyPassword, verifySessionToken } from "@/lib/auth/token";

const SECRET = "0123456789abcdef0123456789abcdef-test-secret";

describe("session tokens", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = SECRET;
  });

  test("a freshly created token verifies", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
  });

  test("an expired token fails", async () => {
    const eightDaysAgo = Math.floor(Date.now() / 1000) - 8 * 24 * 3600;
    const token = await createSessionToken(eightDaysAgo);
    expect(await verifySessionToken(token)).toBe(false);
  });

  test("a token signed with another secret fails", async () => {
    process.env.AUTH_SECRET = "another-secret-another-secret-another-secret";
    const token = await createSessionToken();
    process.env.AUTH_SECRET = SECRET;
    expect(await verifySessionToken(token)).toBe(false);
  });

  test("garbage and empty tokens fail without throwing", async () => {
    expect(await verifySessionToken("not.a.jwt")).toBe(false);
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken(undefined)).toBe(false);
  });

  test("refuses to sign with a short secret", async () => {
    process.env.AUTH_SECRET = "short";
    await expect(createSessionToken()).rejects.toThrow(/AUTH_SECRET/);
  });

  test("cookie is jw_admin, HttpOnly, SameSite=Lax, path /, 7 days", () => {
    expect(COOKIE_NAME).toBe("jw_admin");
    expect(SESSION_TTL_SECONDS).toBe(7 * 24 * 3600);
    const opts = sessionCookieOptions();
    expect(opts).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: 7 * 24 * 3600 });
    expect(typeof opts.secure).toBe("boolean");
  });
});

describe("verifyPassword", () => {
  test("matches the bcrypt hash in ADMIN_PASSWORD_HASH and rejects others", async () => {
    // bcrypt hash of "correct horse" (cost 4 for test speed)
    const { hashSync } = await import("bcryptjs");
    process.env.ADMIN_PASSWORD_HASH = hashSync("correct horse", 4);
    expect(await verifyPassword("correct horse")).toBe(true);
    expect(await verifyPassword("wrong")).toBe(false);
    expect(await verifyPassword("")).toBe(false);
  });

  test("rejects everything when no hash is configured", async () => {
    delete process.env.ADMIN_PASSWORD_HASH;
    expect(await verifyPassword("anything")).toBe(false);
  });
});
