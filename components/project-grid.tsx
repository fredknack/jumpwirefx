import Link from "next/link";
import type { Project } from "@/lib/types";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";

export function ProjectGrid({ projects, id = "work", archiveCount = 0 }: { projects: Project[]; id?: string; archiveCount?: number }) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Selected work</h2>
          <p className="mt-3 text-white/70">Kiosks, walls and installations built for show floors and lobbies.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} priority={i < 3} />
          ))}
        </div>
        {archiveCount > 0 && (
          <p className="mt-10 text-center">
            <Link href="/work/archive" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand">
              View the archive ({archiveCount} more {archiveCount === 1 ? "project" : "projects"})
            </Link>
          </p>
        )}
      </Container>
    </section>
  );
}
