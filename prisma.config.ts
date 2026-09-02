import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * `prisma generate` does not open a connection, so a placeholder keeps codegen
 * working on a machine with no database — which is the default state of this
 * repo. Commands that do connect (`db push`, `migrate`, `db seed`) require the
 * real value in `.env`, and will fail loudly against the placeholder.
 */
const connectionString =
  process.env.DATABASE_URL?.trim() ||
  "postgresql://localhost:5432/carbikekharido";

/**
 * Prisma 7 configuration.
 *
 * From version 7 the connection URL lives here rather than in the schema's
 * datasource block: the CLI reads it for migrations, and the runtime client
 * gets a driver adapter instead (see `src/lib/catalogue/prisma.ts`).
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: connectionString,
  },
});
