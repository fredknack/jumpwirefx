import { connection } from "next/server";
import { Suspense } from "react";
import { ProjectList } from "@/components/admin/project-list";
import { getProjects } from "@/lib/content";

async function Projects() {
  await connection();
  const projects = await getProjects({ includeUnpublished: true });
  return <ProjectList projects={projects} />;
}

export default function AdminHome() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Projects</h1>
      <Suspense fallback={<p className="text-white/50">Loading…</p>}>
        <Projects />
      </Suspense>
    </>
  );
}
