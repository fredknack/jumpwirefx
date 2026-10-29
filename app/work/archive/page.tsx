import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archive",
  description: "Older and smaller JumpWire projects: experiments, early kiosks and one-off builds kept for the record.",
  alternates: { canonical: "/work/archive" },
};

export default async function ArchivePage() {
  const projects = await getProjects({ archive: "only" });
  return (
    <Container className="py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Archive</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Older work</h1>
        <p className="mt-4 text-white/70">Experiments, early kiosks and one-off builds that shaped the current work. Kept here for the record.</p>
      </div>
      {projects.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-white/60">Nothing in the archive right now.</p>
      )}
      <p className="mt-12">
        <Link href="/#work" className="text-sm text-white/60 hover:text-white">← Selected work</Link>
      </p>
    </Container>
  );
}
