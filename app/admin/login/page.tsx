import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { hasSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

async function FormWithNext({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await hasSession()) redirect(next && next.startsWith("/admin") ? next : "/admin");
  return <LoginForm next={next ?? "/admin"} />;
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <Suspense fallback={<LoginForm next="/admin" />}>
        <FormWithNext searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
