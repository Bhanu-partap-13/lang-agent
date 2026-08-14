import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/duolingo';

const queryClient = postgres(dbUrl);

export const db = drizzle({ client: queryClient, schema: { ...schema, ...authSchema } });
