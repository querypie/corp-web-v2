import "server-only";

type AiEnvironment = Readonly<Record<string, string | undefined>>;

// Development / PR Preview → dev partner-portal
// Preview Main (stage.querypie.com) / Production → prod partner-portal
export const AI_CHAT_BASE_URL_DEV = "https://partner-portal.app.dev.querypie.io/api/hermes/v1";
export const AI_CHAT_BASE_URL_PROD = "https://partner-portal.app.querypie.io/api/hermes/v1";
export const AI_CHAT_MODEL = "querypie-product-guide";

// Non-secret defaults for CMS translation on Vercel Preview only.
const cmsPreviewModel = {
  baseUrl: "https://internal-llm.querypie.io/v1",
  model: "glm-5.3-flash",
};

/**
 * Preview Main (VERCEL_TARGET_ENV=preview, VERCEL_GIT_COMMIT_REF=main) 또는
 * Production (VERCEL_TARGET_ENV=production)에서는 prod partner-portal을 사용한다.
 * Development / PR Preview에서는 dev partner-portal을 사용한다.
 */
function getAiChatBaseUrl(env: AiEnvironment): string {
  const target = env.VERCEL_TARGET_ENV;
  if (target === "production") return AI_CHAT_BASE_URL_PROD;
  if (target === "preview" && env.VERCEL_GIT_COMMIT_REF === "main") return AI_CHAT_BASE_URL_PROD;
  return AI_CHAT_BASE_URL_DEV;
}

export function getAiChatConfig(env: AiEnvironment = process.env) {
  return {
    baseUrl: getAiChatBaseUrl(env),
    model: AI_CHAT_MODEL,
    apiKey: env.AI_CHAT_API_KEY ?? "",
    enabled: env.AI_CHAT_ENABLED === "true",
  };
}

export function getCmsTranslationConfig(env: AiEnvironment = process.env) {
  const defaults = env.VERCEL_TARGET_ENV === "preview" ? cmsPreviewModel : undefined;
  return {
    baseUrl: (env.CMS_TRANSLATION_BASE_URL ?? defaults?.baseUrl ?? "").replace(/\/+$/, ""),
    model: env.CMS_TRANSLATION_MODEL ?? defaults?.model ?? "",
    apiKey: env.CMS_TRANSLATION_API_KEY ?? "",
  };
}
