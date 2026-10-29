import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { deleteServiceAction } from "@/app/admin/actions";
import { DeleteProjectForm } from "@/components/admin/delete-project-form";
import { ServiceForm } from "@/components/admin/service-form";
import { requireSession } from "@/lib/auth/session";
import { getProjects, getServiceById } from "@/lib/content";

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await requireSession();
  const { id } = await params;
  const [service, projects] = await Promise.all([getServiceById(id), getProjects({ includeUnpublished: true })]);
  if (!service) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Edit: {service.title}</h1>
      <ServiceForm service={service} projectOptions={projects.map((p) => ({ slug: p.slug, title: p.title, published: p.published }))} />
      <DeleteProjectForm id={service.id} slug={service.slug} action={deleteServiceAction} redirectTo="/admin/services" noun="service" />
    </>
  );
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-white/50">Loading…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
