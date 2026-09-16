import { NextResponse } from "next/server";
import { getAiChatStatusConfig, probeAiChat } from "@/features/ai-chat/status.server";

export const runtime = "nodejs";
export const maxDuration = 30;

let windowStart = 0;
let requests = 0;
let active = 0;

const windowMs = 60000;
const maxRequests = 2;
const maxActive = 1;

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON");
  }
}

function isEmptyObject(payload: unknown) {
  return !!payload && typeof payload === "object" && !Array.isArray(payload) && Object.keys(payload).length === 0;
}

function retryAfterSeconds(now: number) {
  return Math.max(1, Math.ceil((windowMs - (now - windowStart)) / 1000));
}

function reserveBudget() {
  const now = Date.now();
  if (now - windowStart >= windowMs) {
    windowStart = now;
    requests = 0;
  }
  if (requests >= maxRequests || active >= maxActive) {
    return { ok: false, retryAfter: retryAfterSeconds(now) };
  }
  requests++;
  active++;
  return { ok: true, retryAfter: 0 };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ code: "INVALID_ORIGIN" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ code: "INVALID_REQUEST" }, 400);

  let payload: unknown;
  try {
    payload = await readJson(request);
  } catch {
    return json({ code: "INVALID_REQUEST" }, 400);
  }
  if (!isEmptyObject(payload)) return json({ code: "INVALID_REQUEST" }, 400);

  const config = getAiChatStatusConfig();
  if (!config.enabled || !config.keyConfigured) {
    const result = await probeAiChat(request.signal);
    return json(result, 503);
  }

  const budget = reserveBudget();
  if (!budget.ok) {
    return json(
      { code: "RATE_LIMITED", retryAfterSeconds: budget.retryAfter },
      429,
      { "Retry-After": String(budget.retryAfter) },
    );
  }

  try {
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(20000)]);
    const result = await probeAiChat(signal);
    return json(result, 200);
  } finally {
    active--;
  }
}
