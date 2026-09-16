import "server-only";

type AiEnvironment = Readonly<Record<string, string | undefined>>;

export const AI_CHAT_BASE_URL = "https://ai-gateway.stg.querypie.com/v1";
export const AI_CHAT_MODEL = "querypie-internal/glm53/glm-5.3";

// Non-secret defaults for CMS translation on Vercel Preview only.
const cmsPreviewModel = {
  baseUrl: "https://internal-llm.querypie.io/v1",
  model: "glm-5.3-flash",
};

export function getAiChatConfig(env: AiEnvironment = process.env) {
  return {
    baseUrl: AI_CHAT_BASE_URL,
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
