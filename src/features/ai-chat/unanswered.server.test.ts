import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("./database.server", () => ({ getAiChatDatabase: vi.fn() }));
import { getAiChatDatabase } from "./database.server";
import { normalizeQuestion, questionHash, recordUnansweredQuestion, redactQuestion } from "./unanswered.server";

describe("미답변 질문 개인정보 최소화", () => {
  afterEach(() => vi.clearAllMocks());

  it("이메일과 전화번호를 저장 전에 마스킹한다", () => {
    expect(redactQuestion("연락처 test@example.com 또는 010-1234-5678로 답해주세요"))
      .toBe("연락처 [EMAIL] 또는 [PHONE]로 답해주세요");
  });

  it("공백과 대소문자가 다른 동일 질문을 같은 해시로 묶는다", () => {
    expect(normalizeQuestion("  Lingo   PRICE? ")).toBe("lingo price?");
    expect(questionHash("Lingo PRICE?")).toBe(questionHash("  lingo   price? "));
  });

  it("마스킹한 질문을 영구 저장 쿼리에 전달한다", async () => {
    const sql = Object.assign(vi.fn().mockResolvedValue([]), { json: (value: unknown) => value });
    vi.mocked(getAiChatDatabase).mockReturnValue(sql as never);
    expect(await recordUnansweredQuestion({
      question: "Lingo 답변은 test@example.com으로 보내줘",
      locale: "ko",
      reason: "no_relevant_source",
    })).toBe(true);
    expect(sql.mock.calls.flat().join(" ")).toContain("[EMAIL]");
    expect(sql.mock.calls.flat().join(" ")).not.toContain("test@example.com");
  });
});
