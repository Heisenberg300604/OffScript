import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
  );
}

/**
 * Neon's serverless HTTP driver.
 *
 * Every query is a stateless HTTP round trip, so there is no connection pool to
 * exhaust across serverless invocations on Vercel — the failure mode a
 * long-lived TCP driver hits under load.
 *
 * For a throwaway database (local work, a test run, a preview deploy), create a
 * Neon branch and point DATABASE_URL at it. That keeps one driver and one code
 * path between development and production.
 */
export const db = drizzle({ client: neon(connectionString), schema });

export { schema };
