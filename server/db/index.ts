// import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
// for query purposes
// const queryClient = postgres(process.env.DRIZZLE_DATABASE_URL!);
// export const db = drizzle(queryClient);

const client = new Client({
  connectionString: process.env.DRIZZLE_DATABASE_URL!,
});
client.connect();
export const db = drizzle(client);
