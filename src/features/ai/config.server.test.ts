import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AI_CHAT_BASE_URL_DEV, AI_CHAT_BASE_URL_PROD, AI_CHAT_MODEL, getAiChatConfig, getCmsTranslationConfig } from "./config.server";

describe("AI Chat URL 상수", () => {
  it("dev URL은 partner-portal.app.dev, prod URL은 partner-portal.app를 사용한다", () => {
    expect(AI_CHAT_BASE_URL_DEV).toBe("https://partner-portal.app.dev.querypie.io/api/hermes/v1");
    expect(AI_CHAT_BASE_URL_PROD).toBe("https://partner-portal.app.querypie.com/api/hermes/v1");
    expect(AI_CHAT_MODEL).toBe("querypie-product-guide");
  });
});

describe("AI Chat 환경별 baseUrl", () => {
  it("Development (VERCEL_TARGET_ENV 없음)에서는 dev URL을 사용한다", () => {
    expect(getAiChatConfig({}).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
    expect(getAiChatConfig({ VERCEL_ENV: "development" }).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
  });

  it("PR Preview (VERCEL_TARGET_ENV=preview, main 아닌 브랜치)에서는 dev URL을 사용한다", () => {
    expect(getAiChatConfig({ VERCEL_TARGET_ENV: "preview" }).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
    expect(getAiChatConfig({ VERCEL_TARGET_ENV: "preview", VERCEL_GIT_COMMIT_REF: "feat/my-feature" }).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
  });

  it("Preview Main (Stage)에서는 네트워크 우회를 위해 임시로 dev URL을 사용한다", () => {
    expect(getAiChatConfig({ VERCEL_TARGET_ENV: "preview", VERCEL_GIT_COMMIT_REF: "main" }).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
  });

  it("Production도 네트워크 우회를 위해 임시로 dev URL을 사용한다", () => {
    expect(getAiChatConfig({ VERCEL_TARGET_ENV: "production" }).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
    expect(getAiChatConfig({ VERCEL_TARGET_ENV: "production", VERCEL_GIT_COMMIT_REF: "release" }).baseUrl).toBe(AI_CHAT_BASE_URL_DEV);
  });
});

describe("AI Chat 설정", () => {
  it("AI_CHAT_ENABLED가 정확히 true일 때만 활성화한다", () => {
    expect(getAiChatConfig({ AI_CHAT_ENABLED: "true" }).enabled).toBe(true);
    expect(getAiChatConfig({ AI_CHAT_ENABLED: "TRUE" }).enabled).toBe(false);
    expect(getAiChatConfig({ AI_CHAT_ENABLED: "false" }).enabled).toBe(false);
    expect(getAiChatConfig({}).enabled).toBe(false);
  });

  it("apiKey는 AI_CHAT_API_KEY 환경변수에서 가져온다", () => {
    expect(getAiChatConfig({ AI_CHAT_API_KEY: "test-key" }).apiKey).toBe("test-key");
    expect(getAiChatConfig({}).apiKey).toBe("");
  });

  it("모델명은 항상 querypie-product-guide를 사용한다", () => {
    expect(getAiChatConfig({ AI_CHAT_MODEL: "other-model" }).model).toBe(AI_CHAT_MODEL);
  });
});

describe("CMS Translation 설정", () => {
  it("Preview에서는 사내 AI 기본값을 사용한다", () => {
    expect(getCmsTranslationConfig({ VERCEL_TARGET_ENV: "preview" })).toEqual({
      baseUrl: "https://internal-llm.querypie.io/v1",
      model: "glm-5.3-flash",
      apiKey: "",
    });
  });

  it.each(["staging", "production", "development", undefined])("%s에는 사내 Preview 기본값을 적용하지 않는다", (target) => {
    const env = { VERCEL_TARGET_ENV: target, VERCEL_ENV: "preview" };
    expect(getCmsTranslationConfig(env)).toEqual({ baseUrl: "", model: "", apiKey: "" });
  });

  it("환경변수 명시 시 기본값보다 우선한다", () => {
    const env = {
      VERCEL_TARGET_ENV: "preview",
      CMS_TRANSLATION_BASE_URL: "https://translation.example/v1/",
      CMS_TRANSLATION_MODEL: "translator",
    };
    expect(getCmsTranslationConfig(env)).toEqual({ baseUrl: "https://translation.example/v1", model: "translator", apiKey: "" });
  });
});
