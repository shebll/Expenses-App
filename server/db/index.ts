import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { Context } from "hono";
import { Env } from "../src/types/type";

// Function to create a new database client
export function createDbClient(c: Context<Env>) {
  const client = new Client({
    connectionString: process.env.DRIZZLE_DATABASE_URL, // Use process.env for environment variables
  });
  return client;
}

// Function to create and initialize Drizzle ORM instance
export function createDrizzleInstance(client: Client) {
  return drizzle(client);
}

// Exported function to initialize db instance
export async function initializeDb(c: Context<Env>) {
  const client = createDbClient(c);
  await client.connect();
  const db = createDrizzleInstance(client);
  return { db, client };
}

export const dbMiddleware = async (
  c: Context<Env>,
  next: () => Promise<void>
) => {
  const { db, client } = await initializeDb(c);
  c.set("db", db);
  c.set("dbClient", client);
  await next();
  await client.end();
};
