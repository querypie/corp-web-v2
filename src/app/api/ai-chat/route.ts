import { NextResponse } from "next/server";
import { isLocale } from "@/constants/i18n";
import { getAiChatConfig, useBrowserPreviewChat } from "@/features/ai/config.server";
import { answerProductQuestion, prepareProductQuestion, ChatServiceError } from "@/features/ai-chat/answer.server";
import type { ChatTurn } from "@/features/ai-chat/types";

export const runtime = "nodejs";
export const maxDuration = 60;
let windowStart = 0;
let requests = 0;
let active = 0;

const error = (code: string, status: number) => NextResponse.json({ code }, { status, headers: { "Cache-Control": "no-store" } });

async function readPayload(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty body");
  let size = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 64000) { await reader.cancel(); throw new Error("Body too large"); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}

export async function POST(request: Request) {
  if (!getAiChatConfig().enabled) return error("NOT_CONFIGURED", 503);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return error("INVALID_ORIGIN", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return error("INVALID_REQUEST", 400);
  let payload: unknown;
  try { payload = await readPayload(request); } catch { return error("INVALID_REQUEST", 400); }
  if (!payload || typeof payload !== "object") return error("INVALID_REQUEST", 400);
  const { locale, messages } = payload as { locale?: unknown; messages?: unknown };
  if (typeof locale !== "string" || !isLocale(locale) || !Array.isArray(messages) || !messages.length || messages.length > 8 ||
      !messages.every((message) => message && (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" && message.content.trim().length > 0 && message.content.length <= 6000) ||
      messages.at(-1).role !== "user" || messages.at(-1).content.length > 2000) return error("INVALID_REQUEST", 400);

  // Small single-instance budget for internal testing, not a production rate limiter.
  const now = Date.now();
  if (now - windowStart >= 60000) { windowStart = now; requests = 0; }
  if (requests >= 30 || active >= 3) return error("RATE_LIMITED", 429);
  requests++;
  active++;
  try {
    if (useBrowserPreviewChat()) {
      // Keyless, CORS-enabled internal endpoint: staff browsers can reach it even
      // when Vercel's outbound network cannot. Only public source excerpts are sent.
      return NextResponse.json(prepareProductQuestion(messages as ChatTurn[], locale), { headers: { "Cache-Control": "no-store" } });
    }
    const reply = await answerProductQuestion(messages as ChatTurn[], locale, AbortSignal.any([request.signal, AbortSignal.timeout(55000)]));
    return NextResponse.json(reply, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    if (cause instanceof ChatServiceError) return error(cause.code, cause.status);
    if (cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name)) return error("TIMEOUT", 504);
    return error("PROVIDER_ERROR", 502);
  } finally { active--; }
}
