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

  it("브라우저가 저장소 접근을 차단해도 예외를 전파하지 않는다", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("unavailable"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("unavailable"); });
    expect(readPreviewSession()).toEqual({ draft: "", messages: [] });
    expect(() => savePreviewSession({ draft: "test", messages: [] })).not.toThrow();
  });
});
