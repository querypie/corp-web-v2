import "server-only";
import { createHmac, randomBytes } from "crypto";
import { getAiChatDatabase } from "./database.server";

const localWindow = { startedAt: 0, requests: 0, active: 0 };
const processSalt = randomBytes(32).toString("hex");

function limitFromEnv() {
  const value = Number(process.env.AI_CHAT_RATE_LIMIT_PER_MINUTE ?? 10);
  return Number.isInteger(value) && value > 0 && value <= 300 ? value : 10;
}

export function anonymousRequestKey(request: Request, secret = process.env.AI_CHAT_RATE_LIMIT_SALT || processSalt) {
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const address = forwarded.split(",")[0]?.trim() || "unknown";
  return createHmac("sha256", secret).update(address).digest("hex");
}

export async function acquireAiChatRequest(request: Request) {
  const now = Date.now();
  const limit = limitFromEnv();
  const sql = getAiChatDatabase();
  const sharedSecret = process.env.AI_CHAT_RATE_LIMIT_SALT;

  if (sql && sharedSecret) {
    try {
      const key = anonymousRequestKey(request, sharedSecret);
      const rows = await sql<{ request_count: number }[]>`
        INSERT INTO ai_chat_rate_limits (bucket_key, window_started_at, request_count)
        VALUES (${key}, NOW(), 1)
        ON CONFLICT (bucket_key) DO UPDATE SET
          window_started_at = CASE
            WHEN ai_chat_rate_limits.window_started_at < NOW() - INTERVAL '1 minute' THEN NOW()
            ELSE ai_chat_rate_limits.window_started_at
          END,
          request_count = CASE
            WHEN ai_chat_rate_limits.window_started_at < NOW() - INTERVAL '1 minute' THEN 1
            ELSE ai_chat_rate_limits.request_count + 1
          END
        RETURNING request_count
      `;
      return { allowed: rows[0].request_count <= limit, release: () => undefined };
    } catch (error) {
      console.error("[ai-chat] shared rate limit failed; using local fallback", error);
    }
  }

  if (now - localWindow.startedAt >= 60000) {
    localWindow.startedAt = now;
    localWindow.requests = 0;
  }
  if (localWindow.requests >= limit || localWindow.active >= 3) return { allowed: false, release: () => undefined };
  localWindow.requests++;
  localWindow.active++;
  let released = false;
  return {
    allowed: true,
    release: () => {
      if (!released) localWindow.active--;
      released = true;
    },
  };
}
