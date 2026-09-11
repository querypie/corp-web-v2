import "server-only";

type AiEnvironment = Readonly<Record<string, string | undefined>>;

// Non-secret defaults for internal testing on Vercel Preview only.
// VERCEL_TARGET_ENV distinguishes custom staging from ordinary Preview.
const previewModel = {
  baseUrl: "https://internal-llm.querypie.io/v1",
  model: "glm-5.3-flash",
};

function modelConfig(env: AiEnvironment, prefix: "AI_CHAT" | "AI_CHAT_EMBEDDING" | "CMS_TRANSLATION", allowPreviewDefaults = true) {
  const defaults = allowPreviewDefaults && env.VERCEL_TARGET_ENV === "preview" ? previewModel : undefined;
  return {
    baseUrl: (env[`${prefix}_BASE_URL`] ?? defaults?.baseUrl ?? "").replace(/\/+$/, ""),
    model: env[`${prefix}_MODEL`] ?? defaults?.model ?? "",
    apiKey: env[`${prefix}_API_KEY`] ?? "",
  };
}

export function getAiChatConfig(env: AiEnvironment = process.env) {
  return {
    ...modelConfig(env, "AI_CHAT", false),
    enabled: env.AI_CHAT_ENABLED === "true",
  };
}

export function getAiChatEmbeddingConfig(env: AiEnvironment = process.env) {
  return modelConfig(env, "AI_CHAT_EMBEDDING", false);
}

export function getCmsTranslationConfig(env: AiEnvironment = process.env) {
  return modelConfig(env, "CMS_TRANSLATION");
}
