import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';

console.log("DB URL IN USE:", process.env.DATABASE_URL ? "Set" : "Not Set");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing. Please set it in your .env or Vercel Environment Variables.");
}

const dbUrl = process.env.DATABASE_URL;

const queryClient = postgres(dbUrl);

export const db = drizzle({ client: queryClient, schema: { ...schema, ...authSchema } });
