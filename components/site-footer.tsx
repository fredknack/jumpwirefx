import { Container } from "@/components/container";
import { getSiteSettings } from "@/lib/content";

const YEAR = new Date().getFullYear();

export async function SiteFooter() {
  const site = await getSiteSettings();
  return (
    <footer className="border-t border-white/10 bg-black py-10 text-sm text-white/60">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-white">Fred Knack</span> · Interactive kiosks and installations · {site.location}
        </p>
        <p>
          <a href={`mailto:${site.email}`} className="hover:text-brand">{site.email}</a>
          <span className="mx-2">·</span>© {YEAR}
        </p>
      </Container>
    </footer>
  );
}
