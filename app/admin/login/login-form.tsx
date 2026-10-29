"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-sm text-white/70">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          autoFocus
          className="mt-1 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-brand focus:outline-none"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-brand-light">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 font-medium text-black disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
