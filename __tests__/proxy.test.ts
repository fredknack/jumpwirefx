// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test } from "vitest";
import { createSessionToken } from "@/lib/auth/token";
import { config, proxy } from "@/proxy";

const SECRET = "0123456789abcdef0123456789abcdef-test-secret";
const req = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, { headers: cookie ? { cookie: `jw_admin=${cookie}` } : {} });

describe("proxy guards /admin (Review Focus 2)", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = SECRET;
  });

  test("matcher covers /admin and its subpaths", () => {
    expect(config.matcher).toEqual(["/admin/:path*"]);
  });

  test("no cookie redirects to /admin/login with next=", async () => {
    const res = await proxy(req("/admin/projects"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/admin/login?next=%2Fadmin%2Fprojects");
  });

  test("an expired cookie redirects", async () => {
    const old = await createSessionToken(Math.floor(Date.now() / 1000) - 8 * 24 * 3600);
    const res = await proxy(req("/admin", old));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  test("a cookie signed with another secret redirects", async () => {
    process.env.AUTH_SECRET = "another-secret-another-secret-another-secret";
    const forged = await createSessionToken();
    process.env.AUTH_SECRET = SECRET;
    const res = await proxy(req("/admin/settings", forged));
    expect(res.status).toBe(307);
  });

  test("a valid cookie passes through", async () => {
    const res = await proxy(req("/admin/projects", await createSessionToken()));
    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  test("/admin/login is reachable without a cookie", async () => {
    const res = await proxy(req("/admin/login"));
    expect(res.status).toBe(200);
  });
});
