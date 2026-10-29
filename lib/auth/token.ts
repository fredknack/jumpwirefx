import { compare } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

export const COOKIE_NAME = "jw_admin";
export const SESSION_TTL_SECONDS = 7 * 24 * 3600;
const ALG = "HS256";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET ?? "";
  if (s.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(s);
}

/** Signed admin session JWT. `issuedAt` (unix seconds) is overridable for tests. */
export async function createSessionToken(issuedAt: number = Math.floor(Date.now() / 1000)): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_TTL_SECONDS)
    .sign(secret());
}

/** True only for an unexpired admin token signed with the current AUTH_SECRET. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [ALG] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

/** Compare against ADMIN_PASSWORD_HASH (bcrypt). False when unset or empty input. */
export async function verifyPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !plain) return false;
  try {
    return await compare(plain, hash);
  } catch {
    return false;
  }
}
