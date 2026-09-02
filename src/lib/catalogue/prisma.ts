import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * From Prisma 7 the client takes a driver adapter rather than reading a URL out
 * of the schema, so the connection string is resolved here at construction.
 *
 * Next.js hot-reloads modules in development, which would otherwise open a new
 * connection pool on every save until PostgreSQL refuses further clients.
 * Caching the instance on `globalThis` survives the reload.
 *
 * `getPrisma()` returns null when DATABASE_URL is unset, so the app can run
 * against the bundled seed data with no database at all — see `repository.ts`.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPrisma(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return null;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}
