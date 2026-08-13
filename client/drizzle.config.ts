import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: ["./db/schema.ts", "./db/auth-schema.ts"],
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:local.db",
  },
  verbose: true,
  strict: true,
});
