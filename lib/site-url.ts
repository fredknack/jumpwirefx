/** Public base URL without a trailing slash. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://jumpwirefx.com";
  return raw.replace(/\/+$/, "");
}
