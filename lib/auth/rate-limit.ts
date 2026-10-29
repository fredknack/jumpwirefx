/**
 * In-memory failed-login limiter: after `max` failures from one key within
 * `windowMs`, block for `blockMs`. Per server instance; fine for one admin.
 */
export type RateLimiter = {
  check(key: string, now?: number): { allowed: boolean; retryAfterMs: number };
  fail(key: string, now?: number): void;
  reset(key: string): void;
};

type Entry = { failures: number[]; blockedUntil: number };

export function createRateLimiter({ max = 5, windowMs = 15 * 60_000, blockMs = 15 * 60_000 } = {}): RateLimiter {
  const entries = new Map<string, Entry>();
  const get = (key: string) => entries.get(key) ?? { failures: [], blockedUntil: 0 };

  return {
    check(key, now = Date.now()) {
      const e = get(key);
      if (e.blockedUntil > now) return { allowed: false, retryAfterMs: e.blockedUntil - now };
      return { allowed: true, retryAfterMs: 0 };
    },
    fail(key, now = Date.now()) {
      const e = get(key);
      e.failures = e.failures.filter((t) => now - t < windowMs);
      e.failures.push(now);
      if (e.failures.length >= max) {
        e.blockedUntil = now + blockMs;
        e.failures = [];
      }
      entries.set(key, e);
    },
    reset(key) {
      entries.delete(key);
    },
  };
}

/** Shared limiter for the login action. */
export const loginLimiter = createRateLimiter();
