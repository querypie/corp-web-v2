import "server-only";

type AiEnvironment = Readonly<Record<string, string | undefined>>;

// Non-secret defaults for internal testing on Vercel Preview only.
// VERCEL_TARGET_ENV distinguishes custom staging from ordinary Preview.
const previewModel = {
  baseUrl: "https://internal-llm.querypie.io/v1",
  model: "glm-5.3-flash",
};

function modelConfig(env: AiEnvironment, prefix: "AI_CHAT" | "CMS_TRANSLATION") {
  const defaults = env.VERCEL_TARGET_ENV === "preview" ? previewModel : undefined;
  return {
    baseUrl: (env[`${prefix}_BASE_URL`] ?? defaults?.baseUrl ?? "").replace(/\/+$/, ""),
    model: env[`${prefix}_MODEL`] ?? defaults?.model ?? "",
    apiKey: env[`${prefix}_API_KEY`] ?? "",
  };
}

export function getAiChatConfig(env: AiEnvironment = process.env) {
  return {
    ...modelConfig(env, "AI_CHAT"),
    enabled: env.AI_CHAT_ENABLED === undefined
      ? env.VERCEL_TARGET_ENV === "preview"
      : env.AI_CHAT_ENABLED === "true",
  };
}

export function getCmsTranslationConfig(env: AiEnvironment = process.env) {
  return modelConfig(env, "CMS_TRANSLATION");
}

export function useBrowserPreviewChat(env: AiEnvironment = process.env) {
  const config = getAiChatConfig(env);
  return env.VERCEL_TARGET_ENV === "preview" && config.enabled && !config.apiKey &&
    config.baseUrl === previewModel.baseUrl;
}
