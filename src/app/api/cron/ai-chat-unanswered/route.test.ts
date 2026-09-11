// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/features/ai-chat/digest.server", () => ({ sendUnansweredDigest: vi.fn() }));
import { sendUnansweredDigest } from "@/features/ai-chat/digest.server";
import { GET } from "./route";

const request = (token = "secret") => new Request("https://example.com/api/cron/ai-chat-unanswered", {
  headers: { Authorization: `Bearer ${token}` },
});

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "secret");
  vi.mocked(sendUnansweredDigest).mockResolvedValue({ sent: true, count: 2 });
});
afterEach(() => vi.unstubAllEnvs());

describe("미답변 보고 Cron API", () => {
  it("Cron secret을 검증한다", async () => {
    expect((await GET(request("wrong"))).status).toBe(401);
    expect(sendUnansweredDigest).not.toHaveBeenCalled();
  });

  it("인증된 요청은 일일 보고를 실행한다", async () => {
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true, count: 2 });
  });
});
