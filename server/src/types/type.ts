import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { Client } from "pg";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export type Env = {
  Bindings: {
    KINDE_DOMAIN: string;
    KINDE_CLIENT_ID: string;
    KINDE_CLIENT_SECRET: string;
    KINDE_REDIRECT_URI: string;
    KINDE_LOGOUT_REDIRECT_URI: string;
    DRIZZLE_DATABASE_URL: string;
  };
  Variables: {
    user: UserType;
    dbClient: Client;
    db: NodePgDatabase<Record<string, never>>;
  };
};
