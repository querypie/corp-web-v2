import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export type NextRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

type StaticRedirectConfig = {
  source: string;
  destination: string;
};

type ContentRowConfig = {
  source_slug: string;
  target_id?: string;
  target_slug?: string;
  destination?: string;
};

type ContentFamilyFallbackConfig = {
  source: string;
  destination: string;
};

type ContentFamilyConfig = {
  name: string;
  source_templates: string[];
  destination_template: string;
  download_source_templates?: string[];
  download_destination_template?: string;
  rows: ContentRowConfig[];
  fallback: ContentFamilyFallbackConfig;
};

type RedirectConfig = {
  version: 1;
  destination_origin: string;
  static_redirects: StaticRedirectConfig[];
  content_families: ContentFamilyConfig[];
  final_fallback: StaticRedirectConfig;
};

export const japaneseRedirectConfigPath = path.join(
  process.cwd(),
  "config/redirects/ja-to-querypie-ai.yaml",
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid Japanese redirect config: ${label} must be a non-empty string.`);
  }

  return value;
}

function assertStringArray(value: unknown, label: string) {
  if (
    !Array.isArray(value)
    || value.length === 0
    || !value.every((item) => typeof item === "string" && item.trim())
  ) {
    throw new Error(`Invalid Japanese redirect config: ${label} must be a non-empty string array.`);
  }

  return value;
}

function assertRootRelative(value: string, label: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    throw new Error(`Invalid Japanese redirect config: ${label} must be root-relative.`);
  }
}

function assertJapaneseSource(value: string, label: string) {
  if (value !== "/ja" && !value.startsWith("/ja/")) {
    throw new Error(`Invalid Japanese redirect config: ${label} must start with /ja.`);
  }
}

function assertAllowedPlaceholders(template: string, label: string, allowed: string[]) {
  const placeholders = [...template.matchAll(/\{([a-z_]+)\}/g)].map((match) => match[1]);
  const unknown = placeholders.find((placeholder) => !allowed.includes(placeholder));
  if (unknown) {
    throw new Error(`Invalid Japanese redirect config: ${label} uses unknown placeholder {${unknown}}.`);
  }
}

function normalizeDestination(origin: string, destination: string) {
  if (destination === "/") {
    return `${origin}/`;
  }

  return `${origin}${destination}`;
}

function replaceTemplate(template: string, row: ContentRowConfig) {
  return template
    .replaceAll("{source_slug}", row.source_slug)
    .replaceAll("{target_id}", row.target_id ?? "")
    .replaceAll("{target_slug}", row.target_slug ?? "");
}

function normalizeRowDestination(family: ContentFamilyConfig, row: ContentRowConfig, download: boolean) {
  if (row.destination) {
    return row.destination;
  }

  if (!row.target_id || !row.target_slug) {
    throw new Error(
      `Invalid Japanese redirect config: ${family.name}/${row.source_slug} needs target_id and target_slug or destination.`,
    );
  }

  const template = download
    ? family.download_destination_template ?? family.destination_template
    : family.destination_template;

  return replaceTemplate(template, row);
}

function parseStaticRedirect(value: unknown, label: string): StaticRedirectConfig {
  if (!isRecord(value)) {
    throw new Error(`Invalid Japanese redirect config: ${label} must be an object.`);
  }

  const source = assertString(value.source, `${label}.source`);
  const destination = assertString(value.destination, `${label}.destination`);
  assertJapaneseSource(source, `${label}.source`);
  assertRootRelative(destination, `${label}.destination`);

  return { source, destination };
}

function parseContentFamily(value: unknown, index: number): ContentFamilyConfig {
  const label = `content_families[${index}]`;
  if (!isRecord(value)) {
    throw new Error(`Invalid Japanese redirect config: ${label} must be an object.`);
  }

  const name = assertString(value.name, `${label}.name`);
  const sourceTemplates = assertStringArray(value.source_templates, `${label}.source_templates`);
  const destinationTemplate = assertString(value.destination_template, `${label}.destination_template`);
  const downloadSourceTemplates = value.download_source_templates === undefined
    ? undefined
    : assertStringArray(value.download_source_templates, `${label}.download_source_templates`);
  const downloadDestinationTemplate = value.download_destination_template === undefined
    ? undefined
    : assertString(value.download_destination_template, `${label}.download_destination_template`);

  sourceTemplates.forEach((template, templateIndex) => {
    assertJapaneseSource(template, `${label}.source_templates[${templateIndex}]`);
    assertAllowedPlaceholders(template, `${label}.source_templates[${templateIndex}]`, ["source_slug"]);
    if (!template.includes("{source_slug}")) {
      throw new Error(`Invalid Japanese redirect config: ${label}.source_templates[${templateIndex}] needs {source_slug}.`);
    }
  });
  downloadSourceTemplates?.forEach((template, templateIndex) => {
    assertJapaneseSource(template, `${label}.download_source_templates[${templateIndex}]`);
    assertAllowedPlaceholders(template, `${label}.download_source_templates[${templateIndex}]`, ["source_slug"]);
    if (!template.includes("{source_slug}")) {
      throw new Error(`Invalid Japanese redirect config: ${label}.download_source_templates[${templateIndex}] needs {source_slug}.`);
    }
  });

  assertRootRelative(destinationTemplate, `${label}.destination_template`);
  assertAllowedPlaceholders(destinationTemplate, `${label}.destination_template`, ["target_id", "target_slug"]);
  if (downloadDestinationTemplate) {
    assertRootRelative(downloadDestinationTemplate, `${label}.download_destination_template`);
    assertAllowedPlaceholders(downloadDestinationTemplate, `${label}.download_destination_template`, ["target_id", "target_slug"]);
  }

  if (!Array.isArray(value.rows)) {
    throw new Error(`Invalid Japanese redirect config: ${label}.rows must be an array.`);
  }

  const rows = value.rows.map((rowValue, rowIndex) => {
    const rowLabel = `${label}.rows[${rowIndex}]`;
    if (!isRecord(rowValue)) {
      throw new Error(`Invalid Japanese redirect config: ${rowLabel} must be an object.`);
    }

    const row: ContentRowConfig = {
      source_slug: assertString(rowValue.source_slug, `${rowLabel}.source_slug`),
      target_id: rowValue.target_id === undefined ? undefined : assertString(rowValue.target_id, `${rowLabel}.target_id`),
      target_slug: rowValue.target_slug === undefined ? undefined : assertString(rowValue.target_slug, `${rowLabel}.target_slug`),
      destination: rowValue.destination === undefined ? undefined : assertString(rowValue.destination, `${rowLabel}.destination`),
    };

    if (row.destination) {
      assertRootRelative(row.destination, `${rowLabel}.destination`);
    } else if (!row.target_id || !row.target_slug) {
      throw new Error(`Invalid Japanese redirect config: ${rowLabel} needs target_id and target_slug or destination.`);
    }

    return row;
  });

  const fallback = parseStaticRedirect(value.fallback, `${label}.fallback`);

  return {
    name,
    source_templates: sourceTemplates,
    destination_template: destinationTemplate,
    download_source_templates: downloadSourceTemplates,
    download_destination_template: downloadDestinationTemplate,
    rows,
    fallback,
  };
}

export function loadJapaneseRedirectConfig(configPath = japaneseRedirectConfigPath): RedirectConfig {
  const parsed = parse(fs.readFileSync(configPath, "utf8"));

  if (!isRecord(parsed)) {
    throw new Error("Invalid Japanese redirect config: root must be an object.");
  }

  if (parsed.version !== 1) {
    throw new Error("Invalid Japanese redirect config: version must be 1.");
  }

  const destinationOrigin = assertString(parsed.destination_origin, "destination_origin");
  if (destinationOrigin !== "https://querypie.ai") {
    throw new Error("Invalid Japanese redirect config: destination_origin must be https://querypie.ai.");
  }

  if (!Array.isArray(parsed.static_redirects)) {
    throw new Error("Invalid Japanese redirect config: static_redirects must be an array.");
  }

  if (!Array.isArray(parsed.content_families)) {
    throw new Error("Invalid Japanese redirect config: content_families must be an array.");
  }

  const config: RedirectConfig = {
    version: 1,
    destination_origin: destinationOrigin,
    static_redirects: parsed.static_redirects.map((redirect, index) =>
      parseStaticRedirect(redirect, `static_redirects[${index}]`),
    ),
    content_families: parsed.content_families.map(parseContentFamily),
    final_fallback: parseStaticRedirect(parsed.final_fallback, "final_fallback"),
  };

  if (config.final_fallback.source !== "/ja/:path*" || config.final_fallback.destination !== "/") {
    throw new Error("Invalid Japanese redirect config: final_fallback must map /ja/:path* to /.");
  }

  return config;
}

export function createJapaneseRedirects(config = loadJapaneseRedirectConfig()): NextRedirect[] {
  const redirects: NextRedirect[] = [];
  const expandedSources = new Set<string>();

  const addRedirect = (source: string, destination: string) => {
    assertJapaneseSource(source, "redirect.source");
    assertRootRelative(destination, "redirect.destination");

    if (expandedSources.has(source)) {
      throw new Error(`Invalid Japanese redirect config: duplicate expanded source ${source}.`);
    }

    expandedSources.add(source);
    redirects.push({
      source,
      destination: normalizeDestination(config.destination_origin, destination),
      permanent: true,
    });
  };

  config.static_redirects.forEach((redirect) => addRedirect(redirect.source, redirect.destination));

  config.content_families.forEach((family) => {
    family.rows.forEach((row) => {
      family.source_templates.forEach((template) => {
        addRedirect(replaceTemplate(template, row), normalizeRowDestination(family, row, false));
      });
      family.download_source_templates?.forEach((template) => {
        addRedirect(replaceTemplate(template, row), normalizeRowDestination(family, row, true));
      });
    });
  });

  config.content_families.forEach((family) => {
    addRedirect(family.fallback.source, family.fallback.destination);
  });
  addRedirect(config.final_fallback.source, config.final_fallback.destination);

  return redirects;
}

function sourcePatternToRegExp(source: string) {
  const pattern = source
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":") && segment.endsWith("*")) {
        return ".+";
      }
      if (segment.startsWith(":")) {
        return "[^/]+";
      }

      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");

  return new RegExp(`^${pattern}$`);
}

export function resolveJapaneseRedirectSource(sourcePath: string, redirects = japaneseRedirects) {
  return redirects.find((redirect) => sourcePatternToRegExp(redirect.source).test(sourcePath)) ?? null;
}

export const japaneseRedirectConfig = loadJapaneseRedirectConfig();
const expandedJapaneseRedirects = createJapaneseRedirects(japaneseRedirectConfig);
const japaneseFallbackCount = japaneseRedirectConfig.content_families.length + 1;

export const japaneseExactRedirects = expandedJapaneseRedirects.slice(0, -japaneseFallbackCount);
export const japaneseFallbackRedirects = expandedJapaneseRedirects.slice(-japaneseFallbackCount);
export const japaneseRedirects = [...japaneseExactRedirects, ...japaneseFallbackRedirects];
