import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export type KoEnLegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

type RedirectConfig = {
  source: string;
  destination: string;
};

type KoEnLegacyRedirectConfig = {
  version: 1;
  redirects: RedirectConfig[];
};

export const koEnLegacyRedirectConfigPath = path.join(
  process.cwd(),
  "config/redirects/ko-en-legacy-content.yaml",
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid Korean/English legacy redirect config: ${label} must be a non-empty string.`);
  }

  return value;
}

function assertRootRelative(value: string, label: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    throw new Error(`Invalid Korean/English legacy redirect config: ${label} must be root-relative.`);
  }
}

function parseRedirect(value: unknown, index: number): RedirectConfig {
  const label = `redirects[${index}]`;
  if (!isRecord(value)) {
    throw new Error(`Invalid Korean/English legacy redirect config: ${label} must be an object.`);
  }

  const source = assertString(value.source, `${label}.source`);
  const destination = assertString(value.destination, `${label}.destination`);
  assertRootRelative(source, `${label}.source`);
  assertRootRelative(destination, `${label}.destination`);

  if (!source.startsWith("/:locale(en|ko)/")) {
    throw new Error(
      `Invalid Korean/English legacy redirect config: ${label}.source must start with /:locale(en|ko)/.`,
    );
  }

  return { source, destination };
}

export function loadKoEnLegacyRedirectConfig(
  configPath = koEnLegacyRedirectConfigPath,
): KoEnLegacyRedirectConfig {
  const parsed = parse(fs.readFileSync(configPath, "utf8"));
  if (!isRecord(parsed)) {
    throw new Error("Invalid Korean/English legacy redirect config: root must be an object.");
  }
  if (parsed.version !== 1) {
    throw new Error("Invalid Korean/English legacy redirect config: version must be 1.");
  }
  if (!Array.isArray(parsed.redirects) || parsed.redirects.length === 0) {
    throw new Error("Invalid Korean/English legacy redirect config: redirects must be a non-empty array.");
  }

  const redirects = parsed.redirects.map(parseRedirect);
  const sources = new Set<string>();
  redirects.forEach(({ source }) => {
    if (sources.has(source)) {
      throw new Error(`Invalid Korean/English legacy redirect config: duplicate source ${source}.`);
    }
    sources.add(source);
  });

  return { version: 1, redirects };
}

export function createKoEnLegacyRedirects(
  config = loadKoEnLegacyRedirectConfig(),
): KoEnLegacyRedirect[] {
  return config.redirects.map((redirect) => ({ ...redirect, permanent: true }));
}

export const koEnLegacyRedirectConfig = loadKoEnLegacyRedirectConfig();
export const koEnLegacyRedirects = createKoEnLegacyRedirects(koEnLegacyRedirectConfig);
