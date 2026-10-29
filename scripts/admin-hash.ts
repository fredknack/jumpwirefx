/**
 * Print a bcrypt hash for ADMIN_PASSWORD_HASH. The password is read from a
 * hidden prompt, never from argv (which would land in shell history).
 *   pnpm admin:hash
 */
import { hashSync } from "bcryptjs";
import { envEscape } from "./lib/env-escape";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";

const muted = new Writable({ write(_chunk, _enc, cb) { cb(); } });
const rl = createInterface({ input: process.stdin, output: muted, terminal: true });
process.stdout.write("Admin password (hidden): ");
rl.question("", (password) => {
  rl.close();
  process.stdout.write("\n");
  if (password.length < 12) {
    console.error("Use at least 12 characters.");
    process.exit(1);
  }
  const hash = hashSync(password, 12);
  console.log("Vercel dashboard / `vercel env add` value (paste as-is):");
  console.log(hash);
  console.log("\n.env.local line (every $ escaped, or Next.js mangles it):");
  console.log(`ADMIN_PASSWORD_HASH=${envEscape(hash)}`);
});
