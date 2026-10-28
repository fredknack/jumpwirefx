import Link from "next/link";
import type { Project } from "@/lib/types";
import { SkillList } from "@/components/skill-list";
import { VideoThumb } from "@/components/video-thumb";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-brand/60">
      <VideoThumb thumbnail={project.thumbnail} video={project.video} title={project.title} priority={priority} />
      <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
        <h3 className="text-xl font-semibold leading-snug tracking-tight">
          <Link href={`/work/${project.slug}`} className="hover:text-brand">
            {project.title}
          </Link>
        </h3>
        <p className="text-white/70">{project.tagline}</p>
        <SkillList skills={project.skills.slice(0, 4)} className="mt-auto" />
      </div>
    </article>
  );
}
