import { MAX_DIAGNOSTIC_BYTES, parseClientDiagnostic } from "@/features/ai-chat/clientDiagnostics";

export const runtime = "nodejs";
let windowStart = 0;
let reports = 0;
const reply = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply(403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply(400);
  // Best-effort per-instance cap on public diagnostic log volume.
  const now = Date.now();
  if (now - windowStart >= 60000) { windowStart = now; reports = 0; }
  if (reports >= 20) return reply(429);
  reports++;

  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  let size = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_DIAGNOSTIC_BYTES) { await reader.cancel(); return reply(413); }
      text += decoder.decode(value, { stream: true });
    }
    const report = parseClientDiagnostic(JSON.parse(text + decoder.decode()));
    if (!report) return reply(400);
    console.error("[ai-chat-client-error]", JSON.stringify({
      ...report,
      receivedAt: new Date().toISOString(),
      serverDeploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? "",
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
    }));
    return reply(204);
  } catch {
    return reply(400);
  } finally {
    reader.releaseLock();
  }
}
