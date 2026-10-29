import { connection } from "next/server";
import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/content";

async function Settings() {
  await connection();
  return <SettingsForm settings={await getSiteSettings()} />;
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
