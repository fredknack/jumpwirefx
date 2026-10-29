import Link from "next/link";
import type { Service } from "@/lib/types";
import { Container } from "@/components/container";

/** Home-page "Services" section: one card per published service page. */
export function ServiceCards({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <section id="services" className="scroll-mt-20 border-b border-white/10 py-16 sm:py-24">
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What JumpWire builds</h2>
          <p className="mt-3 text-white/70">Pick the one closest to your project.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => {
            // A lone card in the last row stretches across the grid instead of sitting in one corner.
            const wide = services.length % 3 === 1 && i === services.length - 1;
            return (
              <article
                key={s.id}
                className={`flex rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand/60 ${wide ? "flex-col gap-4 md:col-span-3 md:grid md:grid-cols-[1fr_2fr] md:items-start md:gap-10" : "flex-col"}`}
              >
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    <Link href={`/services/${s.slug}`} className="hover:text-brand">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm font-medium text-brand-light">{s.tagline}</p>
                </div>
                <div className={wide ? "flex flex-col" : "flex flex-1 flex-col"}>
                  <p className={wide ? "text-white/70" : "mt-3 text-white/70"}>{s.summary}</p>
                  <Link href={`/services/${s.slug}`} aria-label={`${s.title}: learn more`} className="mt-auto pt-5 text-sm font-semibold text-brand hover:text-brand-light">
                    Learn more →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
