import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Match Next.js precedence: .env.local wins, .env is the fallback.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
