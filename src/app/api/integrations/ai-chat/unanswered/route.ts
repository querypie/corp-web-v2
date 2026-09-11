import { NextResponse } from "next/server";
import { getAiChatDatabaseUrl } from "@/features/ai-chat/database.server";
import { listUnansweredQuestions } from "@/features/ai-chat/unanswered.server";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const apiKey = process.env.AI_CHAT_REPORT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ code: "NOT_CONFIGURED" }, { status: 503, headers: NO_STORE });
  }
  if (request.headers.get("authorization") !== `Bearer ${apiKey}`) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers: NO_STORE });
  }
  if (!getAiChatDatabaseUrl()) {
    return NextResponse.json({ code: "NOT_CONFIGURED" }, { status: 503, headers: NO_STORE });
  }

  const url = new URL(request.url);
  const sinceValue = url.searchParams.get("since");
  const since = sinceValue ? new Date(sinceValue) : new Date(Date.now() - ONE_DAY_MS);
  const limitValue = url.searchParams.get("limit");
  const limit = limitValue === null ? 100 : Number(limitValue);
  if (Number.isNaN(since.getTime()) || !Number.isInteger(limit) || limit < 1 || limit > 500) {
    return NextResponse.json({ code: "INVALID_QUERY" }, { status: 400, headers: NO_STORE });
  }

  try {
    const questions = await listUnansweredQuestions({ status: "pending", since, limit });
    const items = questions.map((question) => ({
      id: question.id,
      question: question.question,
      locale: question.locale,
      reason: question.reason,
      occurrenceCount: question.occurrenceCount,
      firstSeenAt: question.firstSeenAt,
      lastSeenAt: question.lastSeenAt,
    }));
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      since: since.toISOString(),
      count: items.length,
      items,
    }, { headers: NO_STORE });
  } catch (error) {
    console.error("[ai-chat] integration report failed", error);
    return NextResponse.json({ code: "DATABASE_ERROR" }, { status: 500, headers: NO_STORE });
  }
}
