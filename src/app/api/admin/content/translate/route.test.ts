// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { POST } from "./route";

const originalBody = JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "제품을 소개합니다.", marks: [{ type: "bold" }] }] }] });
const request = () => new Request("http://localhost:3000/api/admin/content/translate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ locale: "en", title: "AI 제품 상담", summary: "공식 문서를 사용합니다.", bodyRichText: originalBody }),
});

beforeEach(() => {
  vi.stubEnv("CMS_TRANSLATION_BASE_URL", "https://internal-llm.querypie.io/v1/");
  vi.stubEnv("CMS_TRANSLATION_MODEL", "glm-5.3-flash");
  vi.stubEnv("CMS_TRANSLATION_API_KEY", "");
  vi.stubEnv("ANTHROPIC_BASE_URL", "https://legacy.example");
  vi.stubEnv("ANTHROPIC_AUTH_TOKEN", "old-test-token");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
    choices: [{ finish_reason: "stop", message: { content: JSON.stringify({ translations: [
      { index: 1, translation: "AI product advisor" },
      { index: 2, translation: "Uses official documentation." },
      { index: 3, translation: "Introducing the product." },
    ] }) } }],
  }), { headers: { "Content-Type": "application/json" } })));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("CMS 사내 번역 연결", () => {
  it("키 없는 사내 서버·모델을 우선 사용하고 기존 인증 토큰을 전달하지 않는다", async () => {
    const result = await POST(request());
    expect(result.status).toBe(200);
    const [endpoint, options] = vi.mocked(fetch).mock.calls[0];
    expect(endpoint).toBe("https://internal-llm.querypie.io/v1/chat/completions");
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
    const body = JSON.parse(options?.body as string);
    expect(body.model).toBe("glm-5.3-flash");
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.thinking).toBeUndefined();
  });

  it("제목·요약·본문을 번역하고 Tiptap 서식을 유지한다", async () => {
    const result = await (await POST(request())).json();
    expect(result.title).toBe("AI product advisor");
    expect(result.summary).toBe("Uses official documentation.");
    const paragraph = JSON.parse(result.bodyRichText).content[0];
    expect(paragraph.content[0]).toEqual({ type: "text", text: "Introducing the product.", marks: [{ type: "bold" }] });
  });

  it("전용 API key를 지정한 경우에만 인증 헤더를 보낸다", async () => {
    vi.stubEnv("CMS_TRANSLATION_API_KEY", "cms-test-token");
    expect((await POST(request())).status).toBe(200);
    expect(vi.mocked(fetch).mock.calls[0][1]?.headers).toEqual({ "Content-Type": "application/json", Authorization: "Bearer cms-test-token" });
  });

  it("새 서버에 모델이 설정되지 않았으면 레거시 서버로 임의 우회하지 않는다", async () => {
    vi.stubEnv("CMS_TRANSLATION_MODEL", "");
    expect((await POST(request())).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
});
