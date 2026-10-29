import Link from "next/link";
import { Container } from "@/components/container";

const ITEMS = [
  { title: "Update it from anywhere", body: "Clients edit the videos, images and text a kiosk plays from any browser. The kiosk updates itself within a minute, on the loading dock or on the show floor." },
  { title: "See what visitors did", body: "Every tap and button press is logged to the cloud. A dashboard shows engagement by hour, the most popular content and how one show compared to the last." },
];

/** Home-page section: what the client gets after the build ships. Hidden until the remote-content page exists. */
export function AfterLaunch({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <section className="border-b border-white/10 py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">It keeps working after launch</h2>
          <p className="mt-3 text-white/70">Every build includes remote content control and a live usage dashboard, so the kiosk stays current and proves what it did.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ITEMS.map((it) => (
            <div key={it.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-xl font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-3 text-white/70">{it.body}</p>
            </div>
          ))}
        </div>
        <Link href={href} className="mt-8 inline-block rounded-full border border-white/30 px-6 py-3 font-semibold hover:border-brand hover:text-brand">
          How it works →
        </Link>
      </Container>
    </section>
  );
}
