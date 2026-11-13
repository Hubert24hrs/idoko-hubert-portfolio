/**
 * Hash Admin Password Script
 *
 * Prints a bcrypt hash to use as ADMIN_PASSWORD_HASH.
 * The password is read from stdin so it does not end up in shell history.
 *
 * Usage:
 *   npm run hash-password
 */

import { createInterface } from "node:readline";
import { hash } from "bcryptjs";

const rl = createInterface({ input: process.stdin, output: process.stderr });

rl.question("Password to hash: ", async (password) => {
    rl.close();

    if (password.length < 12) {
        console.error("Use at least 12 characters.");
        process.exit(1);
    }

    const hashed = await hash(password, 12);

    console.log("\nVercel (Project Settings > Environment Variables), paste as is:");
    console.log(`  ADMIN_PASSWORD_HASH=${hashed}`);
    console.log("\n.env.local (Next.js expands $ in .env files, so escape each one):");
    console.log(`  ADMIN_PASSWORD_HASH=${hashed.replaceAll("$", "\\$")}`);
});
