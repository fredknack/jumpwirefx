/**
 * Print a bcrypt hash for ADMIN_PASSWORD_HASH. The password is read from a
 * hidden prompt, never from argv (which would land in shell history).
 *   pnpm admin:hash
 */
import { hashSync } from "bcryptjs";
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
  console.log(hashSync(password, 12));
});
