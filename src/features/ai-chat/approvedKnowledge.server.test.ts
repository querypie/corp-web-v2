import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildApprovedKnowledgeSnapshot } from "./approvedKnowledge.server";
import type { UnansweredQuestion } from "./unanswered.server";

const item: UnansweredQuestion = {
  id: 7,
  question: "Lingo는 수화 통역을 지원하나요?",
  locale: "ko",
  reason: "no_relevant_source",
  candidateSources: [],
  occurrenceCount: 3,
  firstSeenAt: "2026-09-09T00:00:00.000Z",
  lastSeenAt: "2026-09-10T00:00:00.000Z",
  status: "answered",
  product: "lingo",
  approvedAnswer: "현재 수화 통역은 지원하지 않습니다.",
  approvedSourceUrl: "https://lingo.querypie.ai/ko/faq",
  answerVersion: 1,
  reviewedAt: "2026-09-10T01:00:00.000Z",
};

describe("승인 Q&A 지식 스냅샷", () => {
  it("승인 답변을 검색 가능한 공식 문서 형식으로 변환한다", () => {
    const snapshot = buildApprovedKnowledgeSnapshot([item], new Date("2026-09-10T02:00:00.000Z"));
    expect(snapshot.documents).toEqual([{
      id: "approved-question-7-v1",
      product: "lingo",
      locale: "ko",
      title: item.question,
      url: item.approvedSourceUrl,
      chunks: [{ heading: "Approved Q&A", text: `Question: ${item.question}\nAnswer: ${item.approvedAnswer}` }],
    }]);
  });

  it("허용하지 않은 출처와 제품은 지식에서 제외한다", () => {
    expect(buildApprovedKnowledgeSnapshot([{ ...item, approvedSourceUrl: "https://example.com" }]).documents).toEqual([]);
    expect(buildApprovedKnowledgeSnapshot([{ ...item, product: "unknown" }]).documents).toEqual([]);
  });
});
