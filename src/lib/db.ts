/**
 * Database Client Configuration
 * 
 * Falls back gracefully when Prisma client is not generated,
 * allowing the app to use JSON data fallback.
 */

let prisma: any = null;

try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || databaseUrl === "") {
        console.warn('DATABASE_URL is not set, using JSON data fallback.');
        prisma = null;
    } else {
        const { PrismaClient } = require('@prisma/client');
        const globalForPrisma = global as unknown as { prisma: any };
        prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query'] });
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
    }
} catch (e) {
    console.warn('Prisma client initialization failed, using JSON data fallback.');
    prisma = null;
}

export { prisma };
export default prisma;
