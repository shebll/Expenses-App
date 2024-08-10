import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// for migrations
const migrationClient = postgres(c.env.DRIZZLE_DATABASE_URL!, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
