import { NextResponse } from "next/server";
import { writeApprovedKnowledgeSnapshot } from "@/features/ai-chat/approvedKnowledge.server";
import { getAiChatDatabaseUrl } from "@/features/ai-chat/database.server";
import { listUnansweredQuestions, reviewUnansweredQuestion } from "@/features/ai-chat/unanswered.server";
import { isChatSourceUrl } from "@/features/ai-chat/types";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const products = new Set(["aip", "acp", "lingo", "notepie", "linkpie", "corpnavi"]);

export async function GET() {
  try {
    return NextResponse.json({
      configured: Boolean(getAiChatDatabaseUrl()),
      items: await listUnansweredQuestions({ limit: 200 }),
    }, { headers: NO_STORE });
  } catch (error) {
    console.error("[ai-chat] admin list failed", error);
    return NextResponse.json({ code: "DATABASE_ERROR" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null) as {
    id?: unknown;
    status?: unknown;
    product?: unknown;
    approvedAnswer?: unknown;
    approvedSourceUrl?: unknown;
  } | null;
  if (!body || !Number.isInteger(body.id) || (body.status !== "answered" && body.status !== "ignored")) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }
  if (body.status === "answered" && (
    typeof body.product !== "string" || !products.has(body.product) ||
    typeof body.approvedAnswer !== "string" || !body.approvedAnswer.trim() || body.approvedAnswer.length > 6000 ||
    typeof body.approvedSourceUrl !== "string" || !isChatSourceUrl(body.approvedSourceUrl)
  )) return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });

  try {
    const updated = await reviewUnansweredQuestion({
      id: body.id as number,
      status: body.status,
      product: typeof body.product === "string" ? body.product : undefined,
      approvedAnswer: typeof body.approvedAnswer === "string" ? body.approvedAnswer : undefined,
      approvedSourceUrl: typeof body.approvedSourceUrl === "string" ? body.approvedSourceUrl : undefined,
    });
    if (!updated) return NextResponse.json({ code: "NOT_FOUND_OR_NOT_CONFIGURED" }, { status: 404 });
    const indexedCount = await writeApprovedKnowledgeSnapshot();
    return NextResponse.json({ success: true, indexedCount }, { headers: NO_STORE });
  } catch (error) {
    console.error("[ai-chat] admin review failed", error);
    return NextResponse.json({ code: "DATABASE_ERROR" }, { status: 500 });
  }
}
