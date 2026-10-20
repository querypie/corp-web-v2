import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_MESSAGE_LENGTH, MAX_PREVIEW_MESSAGES, readPreviewSession, savePreviewSession } from "./previewSession";

describe("AI 상담 미리보기 세션", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("저장된 데이터가 손상되어도 빈 세션으로 시작한다", () => {
    sessionStorage.setItem("querypie-ai-chat:v1", "invalid json");
    expect(readPreviewSession()).toEqual({ draft: "", messages: [] });
  });

  it("유효하지 않은 메시지를 제외하고 보관 크기를 제한한다", () => {
    sessionStorage.setItem("querypie-ai-chat:v1", JSON.stringify({
      draft: "x".repeat(MAX_MESSAGE_LENGTH + 1),
      messages: [null, { text: "bad locale", locale: "fr" }, ...Array.from({ length: 25 }, (_, i) => ({ id: String(i), role: "user", text: `message ${i}`, locale: "ko" }))],
      slackThreadToken: "thread-token-1",
    }));
    const session = readPreviewSession();
    expect(session.draft).toHaveLength(MAX_MESSAGE_LENGTH);
    expect(session.messages).toHaveLength(MAX_PREVIEW_MESSAGES);
    expect(session.messages[0].text).toBe("message 5");
    expect(session.slackThreadToken).toBe("thread-token-1");
  });

  it("Slack thread token은 유효한 bounded 문자열만 복원한다", () => {
    sessionStorage.setItem("querypie-ai-chat:v1", JSON.stringify({
      draft: "",
      messages: [],
      slackThreadToken: "x".repeat(513),
    }));
    expect(readPreviewSession()).toEqual({ draft: "", messages: [] });

    savePreviewSession({ draft: "질문", messages: [], slackThreadToken: "thread-token-2" });
    expect(readPreviewSession()).toEqual({ draft: "질문", messages: [], slackThreadToken: "thread-token-2" });
  });

  it("이전 세션의 answered 품질 판정값을 복원하지 않는다", () => {
    sessionStorage.setItem("querypie-ai-chat:v1", JSON.stringify({
      draft: "",
      messages: [{
        id: "assistant-1",
        role: "assistant",
        text: "Hermes 답변",
        locale: "ko",
        answered: true,
        sources: [{ title: "Docs", url: "https://example.com/docs" }],
      }],
    }));

    expect(readPreviewSession().messages).toEqual([{
      id: "assistant-1",
      role: "assistant",
      text: "Hermes 답변",
      locale: "ko",
      sources: [{ title: "Docs", url: "https://example.com/docs" }],
    }]);
  });

  it("현재 탭의 최근 대화와 초안을 세션 토큰 없이 복원한다", () => {
    sessionStorage.setItem("querypie-ai-chat:v1", JSON.stringify({ draft: "새 질문", messages: [{
      id: "old", role: "assistant", text: "현재 창의 이전 답변", locale: "ko",
    }], slackThreadToken: "old-thread" }));
    expect(readPreviewSession()).toEqual({ draft: "새 질문", slackThreadToken: "old-thread", messages: [{
      id: "old", role: "assistant", text: "현재 창의 이전 답변", locale: "ko", sources: [],
    }] });
  });

  it("타임아웃·페이지 이동 뒤 재시도할 요청 ID를 복원한다", () => {
    const pendingTurn = { id: "11111111-1111-4111-8111-111111111111", text: "DLP 기능", locale: "ko" as const };
    savePreviewSession({ draft: pendingTurn.text, messages: [], pendingTurn });
    expect(readPreviewSession()).toEqual({ draft: pendingTurn.text, messages: [], pendingTurn });
  });

  it("브라우저가 저장소 접근을 차단해도 예외를 전파하지 않는다", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("unavailable"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("unavailable"); });
    expect(readPreviewSession()).toEqual({ draft: "", messages: [] });
    expect(() => savePreviewSession({ draft: "test", messages: [] })).not.toThrow();
  });
});
