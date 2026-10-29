import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { SkillList } from "@/components/skill-list";
import { VideoThumb } from "@/components/video-thumb";
import { getProject, getProjects, getSiteSettings } from "@/lib/content";
import { projectJsonLd, projectMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [project, site] = await Promise.all([getProject(slug), getSiteSettings()]);
  if (!project) return { title: "Not found" };
  return projectMetadata(project);
}

const KIND_LABEL = { kiosk: "Kiosk", installation: "Installation", game: "Game", experiment: "Experiment" } as const;

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === project.slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i < all.length - 1 ? all[i + 1] : null;

  return (
    <article>
      <JsonLd data={projectJsonLd(project, siteUrl())} />
      <Container className="py-12 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          {KIND_LABEL[project.kind]}
          {project.client && <span className="text-white/60"> · {project.client}</span>}
          {project.year && <span className="text-white/60"> · {project.year}</span>}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="prose-measure mt-4 text-xl text-white/80 sm:text-2xl">{project.tagline}</p>

        <div className="mt-10">
          <VideoThumb thumbnail={project.thumbnail} video={project.video} title={project.title} linkable priority sizes="(min-width: 1152px) 1152px, 100vw" className="rounded-2xl" />
          {project.video && <p className="mt-2 text-sm text-white/50">Tap to watch the case study video. Share this page with <code className="text-white/70">?video=1</code> to open it directly.</p>}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            <p className="prose-measure text-lg text-white/85">{project.summary}</p>
            <Markdown className="mt-6 text-white/75">{project.body}</Markdown>
          </div>
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">What we built</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/80">
              {project.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Skills</h2>
            <SkillList skills={project.skills} className="mt-3" />
          </aside>
        </div>

        {project.gallery.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((g) => (
              <div key={g.url} className="relative aspect-video overflow-hidden rounded-xl bg-white/5">
                <Image src={g.url} alt={g.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <nav aria-label="More work" className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          {prev ? <Link href={`/work/${prev.slug}`} className="hover:text-brand">← {prev.title}</Link> : <span />}
          {next ? <Link href={`/work/${next.slug}`} className="hover:text-brand">{next.title} →</Link> : <span />}
        </nav>
      </Container>
    </article>
  );
}
