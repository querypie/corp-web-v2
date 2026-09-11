import "server-only";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;
let clientUrl: string | undefined;

export function getAiChatDatabaseUrl(env: NodeJS.ProcessEnv = process.env) {
  return env.AI_CHAT_DATABASE_URL || env.POSTGRES_URL || "";
}

export function getAiChatDatabase() {
  const url = getAiChatDatabaseUrl();
  if (!url) return null;
  if (!client || clientUrl !== url) {
    client = postgres(url, {
      connect_timeout: 10,
      idle_timeout: 20,
      max: 2,
      prepare: false,
    });
    clientUrl = url;
  }
  return client;
}
