import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: c.env.DRIZZLE_DATABASE_URL!,
  },
} as Config);
