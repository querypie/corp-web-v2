type DeploymentEnvironment = {
  [key: string]: string | undefined;
  VERCEL_TARGET_ENV?: string;
};

export function isDlpPlatformPreviewEnabled(
  environment: DeploymentEnvironment = process.env,
) {
  return environment.VERCEL_TARGET_ENV === "preview";
}
