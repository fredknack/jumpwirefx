import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <nav aria-label="Admin" className="mb-8 flex flex-wrap items-center gap-6 border-b border-white/10 pb-4 text-sm">
        <span className="font-semibold text-white/50">Admin</span>
        <Link href="/admin" className="hover:text-brand">Projects</Link>
        <Link href="/admin/projects/new" className="hover:text-brand">New project</Link>
        <Link href="/admin/services" className="hover:text-brand">Services</Link>
        <Link href="/admin/settings" className="hover:text-brand">Site settings</Link>
        <Link href="/" className="hover:text-brand">View site</Link>
        <form action="/admin/logout" method="post" className="ml-auto">
          <button type="submit" className="text-white/60 hover:text-white">Log out</button>
        </form>
      </nav>
      {children}
    </Container>
  );
}
