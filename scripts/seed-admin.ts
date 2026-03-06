/**
 * Seed Admin User Script
 *
 * Creates or updates the admin user in the database.
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Prerequisites:
 *   - DATABASE_URL must be set in .env
 *   - Prisma client must be generated (npx prisma generate)
 */

// @ts-nocheck

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error(
            "Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
        );
        console.error("Example:");
        console.error('  ADMIN_EMAIL="admin@example.com"');
        console.error('  ADMIN_PASSWORD="your-secure-password"');
        process.exit(1);
    }

    console.log(`Seeding admin user: ${email}`);

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: "admin",
            name: "Admin",
        },
        create: {
            email,
            password: hashedPassword,
            role: "admin",
            name: "Admin",
        },
    });

    console.log(`Admin user created/updated successfully.`);
    console.log(`  ID:    ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role:  ${user.role}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Failed to seed admin user:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
