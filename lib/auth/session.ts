import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, createSessionToken, sessionCookieOptions, verifySessionToken } from "./token";

export { verifyPassword } from "./token";

/** Mint a session token and set the jw_admin cookie. */
export async function createSession(): Promise<string> {
  const token = await createSessionToken();
  (await cookies()).set(COOKIE_NAME, token, sessionCookieOptions());
  return token;
}

export async function clearSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", { ...sessionCookieOptions(), maxAge: 0 });
}

export async function hasSession(): Promise<boolean> {
  return verifySessionToken((await cookies()).get(COOKIE_NAME)?.value);
}

/** Server actions and routes call this first; redirects to the login page without a valid session. */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect("/admin/login");
}
