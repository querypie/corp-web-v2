import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AI_CHAT_BASE_URL, AI_CHAT_MODEL, getAiChatConfig, getCmsTranslationConfig } from "./config.server";

describe("AI Chat Stage 설정", () => {
  it("AI Chat은 코드의 Stage Gateway 주소와 모델을 사용하고 환경변수 URL·모델 override를 무시한다", () => {
    const env = {
      VERCEL_TARGET_ENV: "preview",
      AI_CHAT_ENABLED: "true",
      AI_CHAT_BASE_URL: "https://old.example/v1/",
      AI_CHAT_MODEL: "old-model",
      AI_CHAT_API_KEY: "test-key",
    };
    expect(AI_CHAT_BASE_URL).toBe("https://ai-gateway.stg.querypie.com/v1");
    expect(AI_CHAT_MODEL).toBe("querypie-internal/glm53-flash/glm-5.3-flash");
    expect(getAiChatConfig(env)).toEqual({
      baseUrl: AI_CHAT_BASE_URL,
      model: AI_CHAT_MODEL,
      apiKey: "test-key",
      enabled: true,
    });
  });

  it("AI Chat은 AI_CHAT_ENABLED가 정확히 true일 때만 활성화한다", () => {
    const enabledConfig = {
      baseUrl: AI_CHAT_BASE_URL,
      model: AI_CHAT_MODEL,
      apiKey: "",
      enabled: true,
    };
    expect(getAiChatConfig({ AI_CHAT_ENABLED: "true" })).toEqual(enabledConfig);
    expect(getAiChatConfig({ VERCEL_TARGET_ENV: "preview" })).toEqual({ ...enabledConfig, enabled: false });
    expect(getAiChatConfig({ AI_CHAT_ENABLED: "TRUE" })).toEqual({ ...enabledConfig, enabled: false });
    expect(getAiChatConfig({ AI_CHAT_ENABLED: "false" })).toEqual({ ...enabledConfig, enabled: false });
  });

  it("CMS Translation은 기존 Preview 기본값을 유지한다", () => {
    expect(getCmsTranslationConfig({ VERCEL_TARGET_ENV: "preview" })).toEqual({
      baseUrl: "https://internal-llm.querypie.io/v1",
      model: "glm-5.3-flash",
      apiKey: "",
    });
  });

  it.each(["staging", "production", "development", undefined])("%s에는 사내 Preview 기본값을 적용하지 않는다", (target) => {
    // VERCEL_ENV=preview alone also describes some custom environments.
    const env = { VERCEL_TARGET_ENV: target, VERCEL_ENV: "preview" };
    expect(getAiChatConfig(env)).toEqual({ baseUrl: AI_CHAT_BASE_URL, model: AI_CHAT_MODEL, apiKey: "", enabled: false });
    expect(getCmsTranslationConfig(env)).toEqual({ baseUrl: "", model: "", apiKey: "" });
  });

  it("CMS Translation 환경변수 동작은 유지한다", () => {
    const env = {
      VERCEL_TARGET_ENV: "preview", AI_CHAT_ENABLED: "false",
      AI_CHAT_BASE_URL: "https://example.com/v1/", AI_CHAT_MODEL: "custom", AI_CHAT_API_KEY: "test-key",
      CMS_TRANSLATION_BASE_URL: "https://translation.example/v1/", CMS_TRANSLATION_MODEL: "translator",
    };
    expect(getAiChatConfig(env)).toEqual({ baseUrl: AI_CHAT_BASE_URL, model: AI_CHAT_MODEL, apiKey: "test-key", enabled: false });
    expect(getCmsTranslationConfig(env)).toEqual({ baseUrl: "https://translation.example/v1", model: "translator", apiKey: "" });
  });
});
