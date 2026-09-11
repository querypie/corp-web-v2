import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("./database.server", () => ({ getAiChatDatabase: vi.fn() }));
import { getAiChatDatabase } from "./database.server";
import { acquireAiChatRequest, anonymousRequestKey } from "./rateLimit.server";

describe("AI 상담 익명 요청 키", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("같은 주소는 같은 키, 다른 주소는 다른 키로 해시한다", () => {
    const first = new Request("https://example.com/api/ai-chat", { headers: { "x-forwarded-for": "203.0.113.10" } });
    const same = new Request("https://example.com/api/ai-chat", { headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" } });
    const other = new Request("https://example.com/api/ai-chat", { headers: { "x-forwarded-for": "203.0.113.11" } });
    expect(anonymousRequestKey(first, "secret")).toBe(anonymousRequestKey(same, "secret"));
    expect(anonymousRequestKey(first, "secret")).not.toBe(anonymousRequestKey(other, "secret"));
    expect(anonymousRequestKey(first, "secret")).not.toContain("203.0.113.10");
  });

  it("DB와 salt가 있으면 공용 제한 카운터 결과를 사용한다", async () => {
    const sql = vi.fn().mockResolvedValue([{ request_count: 11 }]);
    vi.mocked(getAiChatDatabase).mockReturnValue(sql as never);
    vi.stubEnv("AI_CHAT_RATE_LIMIT_SALT", "shared-secret");
    vi.stubEnv("AI_CHAT_RATE_LIMIT_PER_MINUTE", "10");
    const request = new Request("https://example.com/api/ai-chat", { headers: { "x-forwarded-for": "203.0.113.10" } });
    expect((await acquireAiChatRequest(request)).allowed).toBe(false);
    expect(sql).toHaveBeenCalledOnce();
    expect(sql.mock.calls[0].join(" ")).not.toContain("203.0.113.10");
  });
});
