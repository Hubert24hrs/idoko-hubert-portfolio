/**
 * Database Client Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create .env file with: DATABASE_URL="file:./dev.db"
 * 2. Run: npx prisma generate
 * 3. Run: npx prisma db push
 * 4. Uncomment the Prisma imports below
 * 
 * Once Prisma is configured, replace this stub with the actual client.
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;
