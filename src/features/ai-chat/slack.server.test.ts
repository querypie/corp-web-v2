// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { postMessage, callbacks, clientOptions } = vi.hoisted(() => ({
  postMessage: vi.fn(), callbacks: [] as Array<() => Promise<void>>, clientOptions: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ after: (callback: () => Promise<void>) => callbacks.push(callback) }));
vi.mock("@slack/web-api", () => ({
  LogLevel: { ERROR: "error" },
  WebClient: class {
    constructor(...args: unknown[]) { clientOptions(...args); }
    chat = { postMessage };
  },
}));
import { notifyAiChatTurn } from "./slack.server";

const input = { locale: "ko" as const, question: "AIP 설명해줘", outcome: { answer: "제품 답변", sources: [] }, upstreamDurationMs: 1234 };

beforeEach(() => {
  vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "existing-test-token");
  vi.stubEnv("VERCEL_TARGET_ENV", "preview");
  vi.stubEnv("VERCEL_ENV", undefined);
  postMessage.mockReset().mockResolvedValue({ ok: true, ts: "1234567890.000001" });
  clientOptions.mockClear();
  callbacks.length = 0;
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("AI 챗 Slack 알림", () => {
  it.each([
    ["preview", "C0C211STFRR"], ["production", "C08FXKA72SU"],
    ["staging", "C0C211STFRR"], ["development", "C0C211STFRR"],
  ])("%s 환경의 고정 채널과 기존 토큰을 사용한다", async (environment, channel) => {
    vi.stubEnv("VERCEL_TARGET_ENV", environment);
    vi.stubEnv("VERCEL_ENV", "production");
    const token = await notifyAiChatTurn(input);
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({ channel }));
    expect(clientOptions).toHaveBeenCalledWith("existing-test-token", expect.objectContaining({
      timeout: 2000, retryConfig: { retries: 0 }, rejectRateLimitedCalls: true,
    }));
    expect(token).toMatch(/^1234567890\.000001:[\w-]{43}$/);
    expect(token).not.toContain("existing-test-token");
  });
  it("TARGET_ENV 누락 시 VERCEL_ENV를 사용하고 로컬은 개발 채널로 보낸다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", undefined);
    vi.stubEnv("VERCEL_ENV", "production");
    await notifyAiChatTurn(input);
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ channel: "C08FXKA72SU" }));
    vi.stubEnv("VERCEL_ENV", undefined);
    await notifyAiChatTurn(input);
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ channel: "C0C211STFRR" }));
  });
  it("토큰이 없으면 알림을 건너뛴다", async () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", undefined);
    expect(await notifyAiChatTurn(input)).toBeUndefined();
    expect(postMessage).not.toHaveBeenCalled();
  });
  it("역할 제목과 본문을 분리하고 구분선과 하단 보조정보를 표시한다", async () => {
    await notifyAiChatTurn(input);
    expect(postMessage.mock.calls[0][0].blocks).toEqual([
      { type: "header", text: { type: "plain_text", text: "사용자 질문", emoji: false } },
      { type: "section", text: { type: "plain_text", text: input.question, emoji: false } },
      { type: "divider" },
      { type: "header", text: { type: "plain_text", text: "AI 답변", emoji: false } },
      { type: "section", text: { type: "plain_text", text: input.outcome.answer, emoji: false } },
      { type: "context", elements: [{ type: "plain_text", text: "Preview · 한국어 · Upstream 응답 시간: 1.23초", emoji: false }] },
    ]);
  });
  it("응답 실패는 정상 답변과 다른 제목으로 표시한다", async () => {
    await notifyAiChatTurn({ ...input, outcome: { code: "INVALID_RESPONSE" } });
    const blocks = postMessage.mock.calls[0][0].blocks;
    expect(blocks[3]).toMatchObject({ type: "header", text: { text: "AI 응답 실패" } });
    expect(blocks[4]).toMatchObject({ type: "section", text: { type: "plain_text", text: "INVALID_RESPONSE" } });
  });
  it.each([[0, "0.00"], [5, "0.01"], [1999, "2.00"], [28125, "28.13"]])(
    "upstream %dms를 %s초로 표시한다", async (upstreamDurationMs, seconds) => {
      await notifyAiChatTurn({ ...input, upstreamDurationMs });
      expect(JSON.stringify(postMessage.mock.calls[0][0].blocks)).toContain(`Upstream 응답 시간: ${seconds}초`);
    },
  );
  it("첫 요청 오류도 대화 기록과 별개로 채널에 오류 코드와 지연시간을 알린다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", "production");
    const failed = { ...input, outcome: { code: "PROVIDER_ERROR" }, upstreamDurationMs: 32936 };
    const token = await notifyAiChatTurn(failed);
    expect(token).toMatch(/^1234567890\.000001:[\w-]{43}$/);
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(callbacks).toHaveLength(1);
    await callbacks[0]();
    expect(postMessage).toHaveBeenCalledTimes(2);
    const alert = postMessage.mock.calls[1][0];
    expect(alert).toMatchObject({ channel: "C08FXKA72SU", mrkdwn: false, parse: "none", link_names: false });
    expect(alert).not.toHaveProperty("thread_ts");
    expect(alert.blocks[0]).toMatchObject({ type: "header", text: { type: "plain_text", text: "AI 응답 오류 발생" } });
    const alertText = JSON.stringify(alert);
    expect(alertText).toContain("PROVIDER_ERROR");
    expect(alertText).toContain("32.94초");
    expect(alertText).toContain("Production · 한국어");
  });
  it("후속 요청 오류는 같은 스레드와 별도 채널 메시지에 질문 앞부분 80자만 기록한다", async () => {
    const token = await notifyAiChatTurn(input);
    postMessage.mockClear();
    const prefix = "가🙂".repeat(40);
    const question = `${prefix}노출하지 않을 질문 뒷부분`;
    expect(await notifyAiChatTurn({ ...input, question, outcome: { code: "TIMEOUT" }, upstreamDurationMs: 55000, slackThreadToken: token })).toBe(token);
    expect(postMessage).not.toHaveBeenCalled();
    await callbacks[0]();
    expect(postMessage).toHaveBeenCalledTimes(2);
    const payloads = postMessage.mock.calls.map(([message]) => message);
    expect(payloads.filter((message) => message.thread_ts === "1234567890.000001")).toHaveLength(1);
    expect(payloads.filter((message) => !("thread_ts" in message))).toHaveLength(1);
    for (const message of payloads) {
      const text = JSON.stringify(message);
      expect(text).toContain(`${prefix}…`);
      expect(text).not.toContain("노출하지 않을 질문 뒷부분");
      expect(text).toContain("TIMEOUT");
      expect(text).toContain("55.00초");
      expect(message.channel).toBe("C0C211STFRR");
      expect(message.blocks.filter((block: { type: string }) => block.type === "section")
        .every((block: { text: { type: string } }) => block.text.type === "plain_text")).toBe(true);
    }
  });
  it.each(["PROVIDER_ERROR", "INVALID_RESPONSE", "TIMEOUT"])("%s 오류의 짧은 질문은 생략 표시 없이 기록한다", async (code) => {
    await notifyAiChatTurn({ ...input, outcome: { code } });
    await callbacks[0]();
    for (const [message] of postMessage.mock.calls) {
      const text = JSON.stringify(message);
      expect(text).toContain(input.question);
      expect(text).not.toContain(`${input.question}…`);
    }
  });
  it("스레드 전송 실패와 별개로 채널 오류 알림을 시도한다", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const token = await notifyAiChatTurn(input);
    postMessage.mockReset().mockRejectedValueOnce(new Error("private Slack details"))
      .mockResolvedValueOnce({ ok: true, ts: "1234567890.000002" });
    await notifyAiChatTurn({ ...input, outcome: { code: "PROVIDER_ERROR" }, slackThreadToken: token });
    await expect(callbacks[0]()).resolves.toBeUndefined();
    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(postMessage.mock.calls[1][0]).not.toHaveProperty("thread_ts");
    expect(warning.mock.calls).toEqual([["[ai-chat]", { event: "slack_notification_error" }]]);
  });
  it("첫 대화 기록 전송에 실패해도 별도 채널 오류 알림을 보낸다", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    postMessage.mockRejectedValueOnce(new Error("private Slack details"));
    expect(await notifyAiChatTurn({ ...input, outcome: { code: "PROVIDER_ERROR" } })).toBeUndefined();
    await expect(callbacks[0]()).resolves.toBeUndefined();
    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(postMessage.mock.calls[1][0]).not.toHaveProperty("thread_ts");
    expect(warning.mock.calls).toEqual([["[ai-chat]", { event: "slack_notification_error" }]]);
  });
  it("별도 오류 알림 실패는 스레드 연결값과 대화 기록에 영향을 주지 않는다", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const token = await notifyAiChatTurn({ ...input, outcome: { code: "PROVIDER_ERROR" } });
    postMessage.mockRejectedValueOnce(new Error("private Slack details"));
    await expect(callbacks[0]()).resolves.toBeUndefined();
    expect(token).toMatch(/^1234567890\.000001:[\w-]{43}$/);
    expect(warning.mock.calls).toEqual([["[ai-chat]", { event: "slack_notification_error" }]]);
  });
  it("서버 인스턴스가 바뀌어도 같은 대화는 응답 후 부모 스레드에 추가한다", async () => {
    const token = await notifyAiChatTurn(input);
    vi.resetModules();
    const { notifyAiChatTurn: newInstance } = await import("./slack.server");
    expect(await newInstance({ ...input, slackThreadToken: token })).toBe(token);
    expect(postMessage).toHaveBeenCalledTimes(1);
    await callbacks[0]();
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ thread_ts: "1234567890.000001", reply_broadcast: false }));
  });
  it("다른 대화는 새로운 부모 메시지를 만든다", async () => {
    const first = await notifyAiChatTurn(input);
    postMessage.mockResolvedValue({ ok: true, ts: "1234567890.000002" });
    const second = await notifyAiChatTurn(input);
    expect(first).not.toBe(second);
    expect(postMessage.mock.calls[1][0]).not.toHaveProperty("thread_ts");
  });
  it("변조되거나 환경이 다른 연결값으로 기존 스레드에 쓸 수 없다", async () => {
    const token = await notifyAiChatTurn(input);
    for (const invalid of ["1234567890.000001", token!.replace("000001", "000002"), "x".repeat(513), {}, null]) {
      await notifyAiChatTurn({ ...input, slackThreadToken: invalid });
      expect(postMessage.mock.calls.at(-1)![0]).not.toHaveProperty("thread_ts");
    }
    vi.stubEnv("VERCEL_TARGET_ENV", "production");
    await notifyAiChatTurn({ ...input, slackThreadToken: token });
    expect(postMessage.mock.calls.at(-1)![0]).not.toHaveProperty("thread_ts");
    expect(callbacks).toHaveLength(0);
  });
  it("긴 대화와 멘션 문법을 plain_text 블록으로 온전히 기록한다", async () => {
    const question = "<!channel><@U123>&";
    const answer = "가".repeat(6000);
    await notifyAiChatTurn({ ...input, question, outcome: { ...input.outcome, answer } });
    const payload = postMessage.mock.calls[0][0];
    expect(payload).toMatchObject({ mrkdwn: false, parse: "none", link_names: false, unfurl_links: false, unfurl_media: false });
    const blocks = payload.blocks as Array<{ type: string; text?: { type: string; text: string } }>;
    const bodies = blocks.filter((block) => block.type === "section");
    expect(bodies.every((block) => block.text?.type === "plain_text" && block.text.text.length <= 2800)).toBe(true);
    const text = bodies.map((block) => block.text!.text).join("");
    expect(text).toContain(question);
    expect(text).toContain(answer);
  });
  it("실패는 안전한 이벤트만 남기며 AI 처리에 전파하지 않는다", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const token = await notifyAiChatTurn(input);
    postMessage.mockRejectedValue(new Error("private question and token"));
    expect(await notifyAiChatTurn(input)).toBeUndefined();
    expect(await notifyAiChatTurn({ ...input, slackThreadToken: token })).toBe(token);
    await expect(callbacks[0]()).resolves.toBeUndefined();
    expect(warning.mock.calls).toEqual(Array(2).fill(["[ai-chat]", { event: "slack_notification_error" }]));
  });
});
