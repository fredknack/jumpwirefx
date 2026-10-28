import type { Project } from "@/lib/types";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";

export function ProjectGrid({ projects, id = "work" }: { projects: Project[]; id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Selected work</h2>
          <p className="mt-3 text-white/70">
            Kiosks, walls and installations built for show floors and lobbies. Tap a thumbnail to watch; open a project for the build details.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} priority={i < 3} />
          ))}
        </div>
      </Container>
    </section>
  );
}
