import { createClient } from "@libsql/client";
import { readFileSync, rmSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "../local.db");

// Delete existing DB to ensure a clean slate
if (existsSync(dbPath)) {
  rmSync(dbPath, { force: true });
  console.log("✓ Removed stale local.db");
}

const client = createClient({
  url: "file:local.db",
});

const sql = readFileSync(
  join(__dirname, "../drizzle/0000_amused_shen.sql"),
  "utf8"
);

const statements = sql
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await client.execute(stmt);
}

console.log(`✓ Applied ${statements.length} statements — DB ready with correct schema`);
client.close();
