import { connection } from "next/server";
import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireSession } from "@/lib/auth/session";
import { getProjects, getSiteSettings } from "@/lib/content";

async function Settings() {
  await connection();
  await requireSession();
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()]);
  return <SettingsForm settings={settings} reelOptions={projects.filter((p) => p.video).map((p) => ({ slug: p.slug, title: p.title }))} />;
}

export default function SettingsPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Site settings</h1>
      <Suspense fallback={<p className="text-white/50">Loading…</p>}>
        <Settings />
      </Suspense>
    </>
  );
}
