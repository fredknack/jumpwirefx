import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { DeleteProjectForm } from "@/components/admin/delete-project-form";
import { ProjectForm } from "@/components/admin/project-form";
import { requireSession } from "@/lib/auth/session";
import { getProjectById } from "@/lib/content";

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await requireSession();
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Edit: {project.title}</h1>
      <ProjectForm project={project} />
      <DeleteProjectForm id={project.id} slug={project.slug} />
    </>
  );
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-white/50">Loading…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
