import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { open, postMessage } = vi.hoisted(() => ({ open: vi.fn(), postMessage: vi.fn() }));
vi.mock("@slack/web-api", () => ({
  WebClient: class {
    conversations = { open };
    chat = { postMessage };
  },
}));
vi.mock("./unanswered.server", () => ({ listUnansweredDigest: vi.fn() }));
import { listUnansweredDigest } from "./unanswered.server";
import { formatUnansweredDigest, previousKoreanDay, sendUnansweredDigest } from "./digest.server";

describe("미답변 일일 보고", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("오전 9시 실행 시 직전 한국 날짜 범위를 계산한다", () => {
    const range = previousKoreanDay(new Date("2026-09-10T00:00:00.000Z"));
    expect(range.since.toISOString()).toBe("2026-09-08T15:00:00.000Z");
    expect(range.until.toISOString()).toBe("2026-09-09T15:00:00.000Z");
  });

  it("중복 질문의 발생 횟수를 합쳐 Slack 문구를 만든다", () => {
    const text = formatUnansweredDigest([{
      id: 1, question: "Lingo의 수화 통역 지원 여부", locale: "ko", reason: "no_relevant_source",
      lastSeenAt: "2026-09-09T10:00:00.000Z", dailyOccurrenceCount: 4,
    }], new Date("2026-09-08T15:00:00.000Z"));
    expect(text).toContain("2026-09-09 AI 제품 상담 미답변");
    expect(text).toContain("총 4건 · 중복 제외 1개");
    expect(text).toContain("(4회)");
  });

  it("방문자 입력의 Slack 멘션 문법을 이스케이프한다", () => {
    const text = formatUnansweredDigest([{
      id: 1, question: "<!channel> 확인", locale: "ko", reason: "no_relevant_source",
      lastSeenAt: "2026-09-09T10:00:00.000Z", dailyOccurrenceCount: 1,
    }], new Date("2026-09-08T15:00:00.000Z"));
    expect(text).toContain("&lt;!channel&gt;");
    expect(text).not.toContain("<!channel>");
  });

  it("전날 미답변이 없어도 0건 보고를 보내고 Slack 실패는 호출자에게 전달한다", async () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("SLACK_CHANNEL_ALERT_AI_CHAT_UNANSWERED_TESTING", "C123");
    vi.stubEnv("AI_CHAT_DATABASE_URL", "postgres://test");
    vi.mocked(listUnansweredDigest).mockResolvedValue([]);
    expect(await sendUnansweredDigest(new Date("2026-09-10T00:00:00.000Z"))).toEqual({ sent: true, count: 0 });
    expect(postMessage).toHaveBeenCalledOnce();

    postMessage.mockRejectedValueOnce(new Error("Slack down"));
    await expect(sendUnansweredDigest(new Date("2026-09-10T00:00:00.000Z"))).rejects.toThrow("Slack down");
  });

  it("운영 환경에서는 지정한 사용자와 DM을 열어 보고한다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", "production");
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("SLACK_USER_ALERT_AI_CHAT_UNANSWERED", "U123");
    vi.stubEnv("AI_CHAT_DATABASE_URL", "postgres://test");
    vi.mocked(listUnansweredDigest).mockResolvedValue([]);
    open.mockResolvedValue({ channel: { id: "D123" } });

    await expect(sendUnansweredDigest()).resolves.toEqual({ sent: true, count: 0 });
    expect(open).toHaveBeenCalledWith({ users: "U123" });
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({ channel: "D123" }));
  });

  it("DB가 없으면 0건으로 오인할 Slack 보고를 보내지 않는다", async () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("SLACK_CHANNEL_ALERT_AI_CHAT_UNANSWERED_TESTING", "C123");

    await expect(sendUnansweredDigest()).resolves.toEqual({
      sent: false,
      reason: "not_configured",
      count: 0,
    });
    expect(listUnansweredDigest).not.toHaveBeenCalled();
    expect(postMessage).not.toHaveBeenCalled();
  });
});
