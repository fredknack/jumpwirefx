import Link from "next/link";
import type { Project, SiteSettings } from "@/lib/types";
import { Container } from "@/components/container";
import { SITE_NAME } from "@/lib/brand";
import { VideoThumb } from "@/components/video-thumb";

export function Hero({ site, reel }: { site: SiteSettings; reel: Project | null }) {
  return (
    <section className="relative overflow-hidden bg-hero text-black">
      <div className="pointer-events-none absolute inset-0 bg-hex-dots opacity-20" aria-hidden="true" />
      <Container className="relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-black/70">
            {SITE_NAME} · {site.location}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{site.headline}</h1>
          <p className="mt-5 text-xl font-medium text-black/80 sm:text-2xl">{site.subhead}</p>
          <p className="prose-measure mt-6 text-black/80">{site.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#work" className="rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-black/85">
              See the work
            </Link>
            <Link href="/contact" className="rounded-full border-2 border-black px-6 py-3 font-semibold hover:bg-black/10">
              Start a project
            </Link>
          </div>
        </div>
        {reel && (
          <div className="rounded-2xl bg-black/20 p-2 shadow-2xl">
            <VideoThumb thumbnail={reel.thumbnail} video={reel.video} title={reel.title} priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <p className="px-2 pb-1 pt-3 text-sm font-medium text-black/80">{reel.tagline}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
