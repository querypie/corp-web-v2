import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AiChatStatusPageCopy } from "./AiChatStatusPage";
import AiChatStatusPage from "./AiChatStatusPage";

const koreanCopy: AiChatStatusPageCopy = {
  metadataTitle: "AI Chat 상태 진단",
  title: "AI Chat 상태 진단",
  description: "Vercel Server에서 AI Gateway Stage로 직접 연결되는지 확인합니다.",
  configTitle: "실행 설정",
  probeTitle: "기본 요청",
  resultTitle: "응답 결과",
  eyebrow: "Vercel Server Probe",
  fixedRequestLabel: "고정 테스트 요청",
  action: "기본 요청 테스트",
  loading: "요청 중",
  retryAfter: "{seconds}초 후 재시도",
  status: {
    enabled: "활성화됨",
    disabled: "비활성화됨",
    configured: "설정됨",
    missing: "미설정",
    success: "성공",
    failure: "실패",
    idle: "아직 요청하지 않았습니다.",
  },
  labels: {
    environment: "환경",
    enabled: "AI Chat Enabled",
    keyConfigured: "API Key",
    baseUrl: "Base URL",
    model: "Model",
    upstreamStatus: "Upstream HTTP status",
    elapsed: "Elapsed",
    finishReason: "Finish reason",
    responseType: "Response type",
    responseServer: "Response server",
    checkedAt: "Checked at",
    result: "Result",
    finalAnswer: "Final answer",
  },
  values: { other: "Other" },
  notices: {
    disabled: "AI Chat이 비활성화되어 있어 진단 요청을 실행하지 않습니다.",
    missingKey: "AI_CHAT_API_KEY가 설정되지 않았습니다.",
    productionDisabled: "Production 환경에서는 probe를 실행하지 않습니다.",
    rateLimit: "서버 인스턴스별 호출 제한은 분당 30회, 동시 실행 1회입니다.",
  },
  errors: {
    rateLimited: "호출 횟수 제한에 걸렸습니다.",
    albForbidden: "Gateway 앞단(ALB/WAF)에서 접근이 거부되었습니다.",
    disabled: "서버에서 AI Chat이 비활성화되어 있다고 응답했습니다.",
    notConfigured: "서버에서 AI_CHAT_API_KEY가 없다고 응답했습니다.",
    invalidResponse: "Gateway 응답 형식이 예상과 다릅니다.",
    timeout: "Gateway 요청 시간이 초과되었습니다.",
    network: "Gateway 또는 Vercel Server 네트워크 연결에 실패했습니다.",
    generic: "진단 요청을 완료하지 못했습니다.",
  },
};

const englishCopy: AiChatStatusPageCopy = {
  ...koreanCopy,
  metadataTitle: "AI Chat Status",
  title: "AI Chat Status",
  description: "The browser is not used as a proxy.",
  action: "Run basic request",
};

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

    render(<AiChatStatusPage config={readyConfig} copy={koreanCopy} locale="ko" />);

    expect(screen.getByRole("heading", { name: "AI Chat 상태 진단" })).toBeVisible();
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
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

    render(<AiChatStatusPage config={readyConfig} copy={koreanCopy} locale="ko" />);
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

    render(<AiChatStatusPage config={readyConfig} copy={koreanCopy} locale="ko" />);
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
    render(<AiChatStatusPage config={config} copy={koreanCopy} locale="ko" />);
    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(screen.getByRole("button", { name: "기본 요청 테스트" })).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("성공 HTTP라도 payload가 깨져 있으면 일반 오류로 표시한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(null));

    render(<AiChatStatusPage config={readyConfig} copy={koreanCopy} locale="ko" />);
    fireEvent.click(screen.getByRole("button", { name: "기본 요청 테스트" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("진단 요청을 완료하지 못했습니다.");
    expect(screen.queryByText("성공")).not.toBeInTheDocument();
  });

  it("선택한 locale의 lang 속성과 문구를 표시한다", () => {
    const { container } = render(
      <AiChatStatusPage config={readyConfig} copy={englishCopy} locale="en" />,
    );

    expect(container.firstElementChild).toHaveAttribute("lang", "en");
    expect(screen.getByRole("heading", { name: "AI Chat Status" })).toBeVisible();
    expect(screen.getByText("Run basic request")).toBeVisible();
    expect(screen.queryByText("AI Chat 상태 진단")).not.toBeInTheDocument();
  });
});
