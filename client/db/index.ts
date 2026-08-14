import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as authSchema from './auth-schema';

let dbUrl = process.env.DATABASE_URL || 'file:local.db';
if (dbUrl.startsWith('sqlite+libsql://')) {
  dbUrl = dbUrl.replace('sqlite+', '');
}

const client = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema: { ...schema, ...authSchema } });
