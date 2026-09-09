import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getAiChatConfig, getCmsTranslationConfig } from "./config.server";

describe("Preview AI 기본 설정", () => {
  it("Preview에서는 별도 AI 환경변수 없이 키 없는 사내 서버를 사용한다", () => {
    const env = { VERCEL_TARGET_ENV: "preview" };
    const config = { baseUrl: "https://internal-llm.querypie.io/v1", model: "glm-5.3-flash", apiKey: "" };
    expect(getAiChatConfig(env)).toEqual({ ...config, enabled: true });
    expect(getCmsTranslationConfig(env)).toEqual(config);
  });

  it.each(["staging", "production", "development", undefined])("%s에는 사내 Preview 기본값을 적용하지 않는다", (target) => {
    // VERCEL_ENV=preview alone also describes some custom environments.
    const env = { VERCEL_TARGET_ENV: target, VERCEL_ENV: "preview" };
    expect(getAiChatConfig(env)).toEqual({ baseUrl: "", model: "", apiKey: "", enabled: false });
    expect(getCmsTranslationConfig(env)).toEqual({ baseUrl: "", model: "", apiKey: "" });
  });

  it("명시한 환경변수와 비활성화 설정이 기본값보다 우선한다", () => {
    const env = {
      VERCEL_TARGET_ENV: "preview", AI_CHAT_ENABLED: "false",
      AI_CHAT_BASE_URL: "https://example.com/v1/", AI_CHAT_MODEL: "custom", AI_CHAT_API_KEY: "test-key",
      CMS_TRANSLATION_BASE_URL: "https://translation.example/v1/", CMS_TRANSLATION_MODEL: "translator",
    };
    expect(getAiChatConfig(env)).toEqual({ baseUrl: "https://example.com/v1", model: "custom", apiKey: "test-key", enabled: false });
    expect(getCmsTranslationConfig(env)).toEqual({ baseUrl: "https://translation.example/v1", model: "translator", apiKey: "" });
  });
});
