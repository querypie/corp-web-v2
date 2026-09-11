import "server-only";
import { createHash } from "crypto";
import type { Locale } from "@/constants/i18n";
import type { ChatSource } from "./types";
import { getAiChatDatabase } from "./database.server";

export type UnansweredReason = "no_relevant_source" | "model_insufficient_evidence" | "negative_feedback";
export type UnansweredStatus = "pending" | "answered" | "ignored";

export type UnansweredQuestion = {
  id: number;
  question: string;
  locale: Locale;
  reason: UnansweredReason;
  candidateSources: ChatSource[];
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  status: UnansweredStatus;
  product: string | null;
  approvedAnswer: string | null;
  approvedSourceUrl: string | null;
  answerVersion: number;
  reviewedAt: string | null;
};

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /(?<!\d)(?:\+?\d[\d .()-]{7,}\d)(?!\d)/g;

export function redactQuestion(question: string) {
  return question.trim().slice(0, 2000)
    .replace(emailPattern, "[EMAIL]")
    .replace(phonePattern, "[PHONE]");
}

export function normalizeQuestion(question: string) {
  return redactQuestion(question).normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

export function questionHash(question: string) {
  return createHash("sha256").update(normalizeQuestion(question)).digest("hex");
}

export async function recordUnansweredQuestion(input: {
  question: string;
  locale: Locale;
  reason: UnansweredReason;
  candidateSources?: ChatSource[];
}) {
  const sql = getAiChatDatabase();
  if (!sql) return false;
  const question = redactQuestion(input.question);
  if (!question) return false;
  const candidateSources = (input.candidateSources ?? []).slice(0, 8);

  try {
    await sql`
      WITH saved AS (
        INSERT INTO ai_chat_unanswered_questions (
          question_hash, question, locale, reason, candidate_sources
        ) VALUES (
          ${questionHash(question)}, ${question}, ${input.locale}, ${input.reason}, ${sql.json(candidateSources)}
        )
        ON CONFLICT (question_hash, locale) DO UPDATE SET
          question = EXCLUDED.question,
          reason = EXCLUDED.reason,
          candidate_sources = EXCLUDED.candidate_sources,
          occurrence_count = ai_chat_unanswered_questions.occurrence_count + 1,
          last_seen_at = NOW()
        RETURNING id
      )
      INSERT INTO ai_chat_unanswered_events (question_id)
      SELECT id FROM saved
    `;
    return true;
  } catch (error) {
    console.error("[ai-chat] unanswered question storage failed", error);
    return false;
  }
}

export type UnansweredDigestItem = Pick<
  UnansweredQuestion,
  "id" | "question" | "locale" | "reason" | "lastSeenAt"
> & { dailyOccurrenceCount: number };

export async function listUnansweredDigest(since: Date, until: Date, limit = 50): Promise<UnansweredDigestItem[]> {
  const sql = getAiChatDatabase();
  if (!sql) return [];
  const rows = await sql<{
    id: number;
    question: string;
    locale: Locale;
    reason: UnansweredReason;
    last_seen_at: Date;
    daily_occurrence_count: number;
  }[]>`
    SELECT question.id::integer AS id, question.question, question.locale, question.reason, question.last_seen_at,
      COUNT(event.id)::integer AS daily_occurrence_count
    FROM ai_chat_unanswered_events event
    JOIN ai_chat_unanswered_questions question ON question.id = event.question_id
    WHERE question.status = 'pending' AND event.created_at >= ${since} AND event.created_at < ${until}
    GROUP BY question.id
    ORDER BY daily_occurrence_count DESC, question.last_seen_at DESC
    LIMIT ${Math.min(Math.max(limit, 1), 100)}
  `;
  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    locale: row.locale,
    reason: row.reason,
    lastSeenAt: row.last_seen_at.toISOString(),
    dailyOccurrenceCount: row.daily_occurrence_count,
  }));
}

export async function listUnansweredQuestions(options: {
  status?: UnansweredStatus;
  since?: Date;
  limit?: number;
} = {}): Promise<UnansweredQuestion[]> {
  const sql = getAiChatDatabase();
  if (!sql) return [];
  const status = options.status ?? "pending";
  const since = options.since ?? new Date(0);
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 500);
  const rows = await sql<{
    id: number;
    question: string;
    locale: Locale;
    reason: UnansweredReason;
    candidate_sources: ChatSource[];
    occurrence_count: number;
    first_seen_at: Date;
    last_seen_at: Date;
    status: UnansweredStatus;
    product: string | null;
    approved_answer: string | null;
    approved_source_url: string | null;
    answer_version: number;
    reviewed_at: Date | null;
  }[]>`
    SELECT id::integer AS id, question, locale, reason, candidate_sources, occurrence_count,
      first_seen_at, last_seen_at, status, product, approved_answer,
      approved_source_url, answer_version, reviewed_at
    FROM ai_chat_unanswered_questions
    WHERE status = ${status} AND last_seen_at >= ${since}
    ORDER BY occurrence_count DESC, last_seen_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    locale: row.locale,
    reason: row.reason,
    candidateSources: row.candidate_sources,
    occurrenceCount: row.occurrence_count,
    firstSeenAt: row.first_seen_at.toISOString(),
    lastSeenAt: row.last_seen_at.toISOString(),
    status: row.status,
    product: row.product,
    approvedAnswer: row.approved_answer,
    approvedSourceUrl: row.approved_source_url,
    answerVersion: row.answer_version,
    reviewedAt: row.reviewed_at?.toISOString() ?? null,
  }));
}

export async function reviewUnansweredQuestion(input: {
  id: number;
  status: Exclude<UnansweredStatus, "pending">;
  product?: string;
  approvedAnswer?: string;
  approvedSourceUrl?: string;
}) {
  const sql = getAiChatDatabase();
  if (!sql) return false;
  const answer = input.approvedAnswer?.trim().slice(0, 6000) || null;
  const product = input.product?.trim().slice(0, 100) || null;
  const sourceUrl = input.approvedSourceUrl?.trim().slice(0, 2000) || null;
  if (input.status === "answered" && (!answer || !product || !sourceUrl)) return false;
  const rows = await sql<{ id: number }[]>`
    UPDATE ai_chat_unanswered_questions
    SET status = ${input.status}, product = ${product}, approved_answer = ${answer},
      approved_source_url = ${sourceUrl},
      answer_version = CASE WHEN ${input.status} = 'answered' THEN answer_version + 1 ELSE answer_version END,
      reviewed_at = NOW()
    WHERE id = ${input.id}
    RETURNING id
  `;
  return rows.length === 1;
}

export async function listApprovedAnswers() {
  return listUnansweredQuestions({ status: "answered", limit: 500 });
}
