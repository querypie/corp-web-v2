import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AiChatStatusPage from "./AiChatStatusPage";

const readyConfig = {
  baseUrl: "https://ai-gateway.stg.querypie.com/v1",
  enabled: true,
  environment: "Preview",
  keyConfigured: true,
  model: "querypie-internal/glm53-flash/glm-5.3-flash",
  samplePrompt: "QueryPie AI Chat 상태 확인용 고정 요청입니다.",
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

describe("AI Chat 상태 진단 페이지", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("환경 설정과 고정 요청을 표시하고 같은 출처 API로 수동 진단을 실행한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        answer: "AI Gateway Stage 응답입니다.",
        checkedAt: "2026-09-16T04:00:02.000Z",
        code: "OK",
        durationMs: 1420,
        finishReason: "stop",
        ok: true,
        responseServer: null,
        responseType: "json",
        upstreamStatus: 200,
      }),
    );

    render(<AiChatStatusPage config={readyConfig} />);

    expect(screen.getByRole("heading", { name: "AI Chat 상태 진단" })).toBeVisible();
    expect(screen.getByText("Preview")).toBeVisible();
    expect(screen.getByText("활성화됨")).toBeVisible();
    expect(screen.getByText("설정됨")).toBeVisible();
    expect(screen.getByText(readyConfig.baseUrl)).toHaveClass("break-all");
    expect(screen.getByText(readyConfig.model)).toBeVisible();
    expect(screen.getByText(readyConfig.samplePrompt)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "기본 요청 테스트" }));

    expect(screen.getByRole("status")).toHaveTextContent("요청 중");
    expect(fetch).toHaveBeenCalledWith("/api/internal/ai-chat-status", {
      body: "{}",
      cache: "no-store",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: expect.any(AbortSignal),
    });

    expect(await screen.findByText("AI Gateway Stage 응답입니다.")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("성공");
    expect(screen.getByText("200")).toBeVisible();
    expect(screen.getByText("1,420ms")).toBeVisible();
    expect(screen.getByText("stop")).toBeVisible();
  });

  it("Gateway 앞단 ALB/WAF 403 HTML 응답을 성공으로 표시하지 않는다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        answer: null,
        checkedAt: "2026-09-16T04:00:02.000Z",
        code: "UPSTREAM_HTTP_ERROR",
        durationMs: 260,
        finishReason: null,
        ok: false,
        responseServer: "awselb",
        responseType: "html",
        upstreamStatus: 403,
      }),
    );

    render(<AiChatStatusPage config={readyConfig} />);
    fireEvent.click(screen.getByRole("button", { name: "기본 요청 테스트" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Gateway 앞단(ALB/WAF)에서 접근이 거부되었습니다.");
    expect(screen.getByText("실패")).toBeVisible();
    expect(screen.queryByText("성공")).not.toBeInTheDocument();
    expect(screen.getByText("403")).toBeVisible();
    expect(screen.getByText("HTML")).toBeVisible();
    expect(screen.getByText("AWS ALB")).toBeVisible();
  });

  it("API rate limit 응답이면 Retry-After 카운트다운 동안 버튼을 비활성화한다", async () => {
    vi.useFakeTimers();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { headers: { "Retry-After": "3" }, status: 429 }),
    );

    render(<AiChatStatusPage config={readyConfig} />);
    fireEvent.click(screen.getByRole("button", { name: "기본 요청 테스트" }));

    await act(async () => {});

    expect(screen.getByRole("alert")).toHaveTextContent("호출 횟수 제한");
    expect(screen.getByRole("button", { name: "3초 후 재시도" })).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole("button", { name: "1초 후 재시도" })).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("button", { name: "기본 요청 테스트" })).toBeEnabled();
  });

  it.each([
    [{ ...readyConfig, enabled: false }, "AI Chat이 비활성화되어 있어 진단 요청을 실행하지 않습니다."],
    [{ ...readyConfig, keyConfigured: false }, "AI_CHAT_API_KEY가 설정되지 않았습니다."],
  ])("설정상 요청할 수 없으면 사유를 보여주고 버튼을 막는다", (config, message) => {
    render(<AiChatStatusPage config={config} />);
    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(screen.getByRole("button", { name: "기본 요청 테스트" })).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("성공 HTTP라도 payload가 깨져 있으면 일반 오류로 표시한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(null));

    render(<AiChatStatusPage config={readyConfig} />);
    fireEvent.click(screen.getByRole("button", { name: "기본 요청 테스트" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("진단 요청을 완료하지 못했습니다.");
    expect(screen.queryByText("성공")).not.toBeInTheDocument();
  });
});
