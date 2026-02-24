import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Creates a singleton PrismaClient with PostgreSQL adapter.
 * Uses a connection pool with a 10-second timeout to prevent
 * hanging when the database is unreachable.
 */
function createPrismaClient() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000, // 10s timeout — fail fast if DB is down
        max: 5,                         // Limit pool size for serverless
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
