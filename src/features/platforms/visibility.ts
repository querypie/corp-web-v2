import type { Locale } from "@/constants/i18n";

type DeploymentEnvironment = {
  [key: string]: string | undefined;
  VERCEL_TARGET_ENV?: string;
};

export function isDlpPlatformVisible(
  locale: Locale,
  environment: DeploymentEnvironment = process.env,
) {
  return environment.VERCEL_TARGET_ENV === "preview" && locale !== "ja";
}
