import { describe, expect, test } from "vitest";
import { createRateLimiter } from "@/lib/auth/rate-limit";

const MIN = 60_000;

describe("login rate limiter", () => {
  test("allows five failures then blocks the sixth within 15 minutes", () => {
    const rl = createRateLimiter();
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(rl.check("1.2.3.4", t0 + i * MIN).allowed).toBe(true);
      rl.fail("1.2.3.4", t0 + i * MIN);
    }
    expect(rl.check("1.2.3.4", t0 + 5 * MIN).allowed).toBe(false);
    expect(rl.check("5.6.7.8", t0 + 5 * MIN).allowed).toBe(true);
  });

  test("unblocks 15 minutes after the block started", () => {
    const rl = createRateLimiter();
    const t0 = 0;
    for (let i = 0; i < 5; i++) rl.fail("ip", t0);
    expect(rl.check("ip", t0 + 14 * MIN).allowed).toBe(false);
    expect(rl.check("ip", t0 + 15 * MIN + 1).allowed).toBe(true);
  });

  test("failures older than 15 minutes do not count", () => {
    const rl = createRateLimiter();
    for (let i = 0; i < 4; i++) rl.fail("ip", 0);
    rl.fail("ip", 16 * MIN);
    expect(rl.check("ip", 16 * MIN).allowed).toBe(true);
  });

  test("a successful login resets the counter", () => {
    const rl = createRateLimiter();
    for (let i = 0; i < 4; i++) rl.fail("ip", 0);
    rl.reset("ip");
    for (let i = 0; i < 4; i++) rl.fail("ip", 0);
    expect(rl.check("ip", 0).allowed).toBe(true);
  });
});
