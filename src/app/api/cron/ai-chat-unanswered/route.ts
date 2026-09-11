import { NextResponse } from "next/server";
import { sendUnansweredDigest } from "@/features/ai-chat/digest.server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ code: "NOT_CONFIGURED" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  }
  try {
    return NextResponse.json(await sendUnansweredDigest(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[ai-chat] daily unanswered digest failed", error);
    return NextResponse.json({ code: "DIGEST_FAILED" }, { status: 500 });
  }
}
