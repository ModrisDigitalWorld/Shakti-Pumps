import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;
const g = globalThis as unknown as { __sp_db?: Db };

/** Lazily-created Drizzle client (so builds without DATABASE_URL still work). */
export function db(): Db {
  if (g.__sp_db) return g.__sp_db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  const client = postgres(url, {
    prepare: false, // required for Supabase transaction pooler
    max: process.env.NODE_ENV === "production" ? 3 : 5,
    idle_timeout: 20,
    ssl: local ? false : "require",
  });
  g.__sp_db = drizzle(client, { schema });
  return g.__sp_db;
}

export { schema };
