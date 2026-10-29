/** Escape `$` for a .env file: Next.js expands `$VAR` even inside quotes, so a bcrypt hash must be written as `\$2b\$10\$…`. */
export function envEscape(value: string): string {
  return value.replace(/\$/g, "\\$");
}
