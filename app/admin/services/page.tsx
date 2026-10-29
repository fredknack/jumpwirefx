import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ServiceList } from "@/components/admin/service-list";
import { requireSession } from "@/lib/auth/session";
import { getServices } from "@/lib/content";

async function Services() {
  await connection();
  await requireSession();
  return <ServiceList services={await getServices({ includeUnpublished: true })} />;
}

export default function AdminServices() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Services</h1>
        <Link href="/admin/services/new" className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-black">New service</Link>
      </div>
      <Suspense fallback={<p className="text-white/50">Loading…</p>}>
        <Services />
      </Suspense>
    </>
  );
}
