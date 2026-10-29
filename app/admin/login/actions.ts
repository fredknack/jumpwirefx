"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginLimiter } from "@/lib/auth/rate-limit";
import { createSession, verifyPassword } from "@/lib/auth/session";

export type LoginState = { error?: string };

function safeNext(next: unknown): string {
  return typeof next === "string" && /^\/admin(\/|\?|$)/.test(next) ? next : "/admin";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // Vercel overwrites x-forwarded-for with the real client IP. On any other host this
  // header is attacker-controlled and the limiter must key on something else.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!loginLimiter.check(ip).allowed) return { error: "Too many attempts. Try again in 15 minutes." };

  const password = String(formData.get("password") ?? "");
  if (!(await verifyPassword(password))) {
    loginLimiter.fail(ip);
    return { error: "Wrong password." };
  }
  loginLimiter.reset(ip);
  await createSession();
  redirect(safeNext(formData.get("next")));
}
