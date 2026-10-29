import { connection } from "next/server";
import { Suspense } from "react";
import { ServiceForm } from "@/components/admin/service-form";
import { requireSession } from "@/lib/auth/session";
import { getProjects } from "@/lib/content";

async function NewForm() {
  await connection();
  await requireSession();
  const projects = await getProjects({ includeUnpublished: true });
  return <ServiceForm projectOptions={projects.map((p) => ({ slug: p.slug, title: p.title, published: p.published }))} />;
}

export default function NewServicePage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">New service</h1>
      <Suspense fallback={<p className="text-white/50">Loading…</p>}>
        <NewForm />
      </Suspense>
    </>
  );
}
