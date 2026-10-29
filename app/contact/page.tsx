import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about an interactive kiosk, trade show installation or lobby experience. Based in Portland, Oregon.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  return (
    <Container className="py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Let&apos;s talk about your next show.</h1>
        <p className="prose-measure mt-6 text-lg text-white/80">
          Tell us about the event or the space, roughly when it opens, and what you want people to do when they walk up. You&apos;ll get ideas back and a straight answer on what it takes to build.
        </p>
        <a
          href={`mailto:${site.email}?subject=Interactive%20kiosk%20project`}
          className="mt-8 inline-block rounded-full bg-brand px-7 py-3 text-lg font-semibold text-black hover:bg-brand-light"
        >
          Email {site.email}
        </a>
        <p className="mt-6 text-white/60">Based in {site.location}. Available for projects across the US.</p>
        <p className="mt-2 text-white/60">Every build includes remote content control and a usage dashboard.</p>
      </div>
    </Container>
  );
}
