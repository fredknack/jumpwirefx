import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Container } from "@/components/container";

export function ContactCta({ site }: { site: SiteSettings }) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Have a trade show coming up?</h2>
          <p className="mt-3 text-white/70">{site.aboutShort}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-full bg-brand px-6 py-3 font-semibold text-black hover:bg-brand-light">
            Start a project
          </Link>
          <a href={`mailto:${site.email}`} className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:border-white">
            {site.email}
          </a>
        </div>
      </Container>
    </section>
  );
}
