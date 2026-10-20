import { NextResponse } from "next/server";
import { getAiChatConfig } from "@/features/ai/config.server";
import { createConversationToken } from "@/features/ai-chat/conversation.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const config = getAiChatConfig();
  if (!config.enabled || !config.apiKey) return NextResponse.json({ code: "NOT_CONFIGURED" }, { status: 503, headers });
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") && request.headers.get("origin") !== origin) {
    return NextResponse.json({ code: "INVALID_ORIGIN" }, { status: 403, headers });
  }
  try {
    return NextResponse.json({ conversationToken: createConversationToken(origin) }, { headers });
  } catch {
    return NextResponse.json({ code: "NOT_CONFIGURED" }, { status: 503, headers });
  }
}
