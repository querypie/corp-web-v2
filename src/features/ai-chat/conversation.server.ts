import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { isConversationToken } from "./types";

function signature(value: string, origin: string) {
  const secret = process.env.AI_CHAT_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("AI chat session signing is not configured");
  const environment = process.env.VERCEL_TARGET_ENV ?? process.env.VERCEL_ENV ?? "development";
  return createHmac("sha256", secret).update(JSON.stringify(["ai-chat-session:v1", environment, origin, value])).digest();
}

export function createConversationToken(origin: string) {
  const id = randomUUID();
  return `v1.${id}.${signature(id, origin).toString("base64url")}`;
}

export function resolveConversationId(token: unknown, origin: string): string | undefined {
  if (!isConversationToken(token)) return undefined;
  const [, id, supplied] = token.split(".");
  const expected = signature(id, origin);
  if (!timingSafeEqual(Buffer.from(supplied, "base64url"), expected)) return undefined;
  return `webchat-${signature(`native:${id}`, origin).toString("hex")}`;
}
