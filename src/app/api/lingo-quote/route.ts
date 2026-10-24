import { NextResponse } from "next/server";
import { getLingoQuotePlan } from "@/features/lingo-quote/catalog";
import { createLingoQuoteWorkbook } from "@/features/lingo-quote/workbook.server";

export const runtime = "nodejs";
export const maxDuration = 20;

const MAX_BODY_BYTES = 12_000;
let windowStart = 0;
let requests = 0;

type QuotePayload = {
  companyName?: unknown;
  contactName?: unknown;
  department?: unknown;
  plan?: unknown;
  privacyConsent?: unknown;
};

function jsonError(code: string, status: number) {
  return NextResponse.json({ code }, { status, headers: { "Cache-Control": "no-store" } });
}

async function readPayload(request: Request): Promise<QuotePayload> {
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
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("Body too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    const payload = JSON.parse(text + decoder.decode());
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid payload");
    return payload as QuotePayload;
  } finally {
    reader.releaseLock();
  }
}

function readText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(trimmed)) return "";
  return trimmed;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return jsonError("INVALID_ORIGIN", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("INVALID_REQUEST", 400);
  }

  const now = Date.now();
  if (now - windowStart >= 60_000) {
    windowStart = now;
    requests = 0;
  }
  if (requests >= 20) return jsonError("RATE_LIMITED", 429);
  requests++;

  let payload: QuotePayload;
  try {
    payload = await readPayload(request);
  } catch {
    return jsonError("INVALID_REQUEST", 400);
  }

  const companyName = readText(payload.companyName, 160);
  const contactName = readText(payload.contactName, 80);
  const department = readText(payload.department, 80);
  const plan = getLingoQuotePlan(payload.plan);
  if (!companyName || !plan || payload.privacyConsent !== true) {
    return jsonError("MISSING_REQUIRED_FIELDS", 400);
  }

  try {
    const quote = await createLingoQuoteWorkbook({ companyName, contactName, department, plan });
    const encodedFileName = encodeURIComponent(quote.fileName);
    return new NextResponse(new Uint8Array(quote.bytes), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${quote.fileName}"; filename*=UTF-8''${encodedFileName}`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Length": String(quote.bytes.byteLength),
      },
    });
  } catch {
    return jsonError("GENERATION_FAILED", 500);
  }
}
