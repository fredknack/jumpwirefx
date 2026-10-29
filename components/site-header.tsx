import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { SITE_NAME } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-black">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/art/logo.svg" alt="" width={32} height={34} className="h-8 w-auto" priority />
          <span className="text-base font-semibold tracking-tight">{SITE_NAME}</span>
          <span className="hidden text-sm text-white/60 sm:inline">Interactive kiosks</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#work" className="hover:text-brand">Work</Link>
          <Link href="/contact" className="rounded-full bg-brand px-4 py-2 text-black hover:bg-brand-light">Contact</Link>
        </nav>
      </Container>
    </header>
  );
}
