import { readFile } from "node:fs/promises";
import process from "node:process";
import postgres from "postgres";

const databaseUrl = process.env.AI_CHAT_DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl) throw new Error("AI_CHAT_DATABASE_URL or POSTGRES_URL is required");

const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
const sql = postgres(databaseUrl, { max: 1, prepare: false });
try {
  await sql.unsafe(schema);
  console.log("AI chat database schema is ready.");
} finally {
  await sql.end();
}
