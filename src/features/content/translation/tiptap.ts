import type { Locale } from "@/constants/i18n";

export type TranslationErrorCode =
  | "EMPTY_CONTENT"
  | "REQUEST_ABORTED"
  | "UNAUTHORIZED"
  | "RATE_LIMITED"
  | "CONTENT_TOO_LONG"
  | "NETWORK_ERROR"
  | "PROVIDER_ERROR"
  | "INVALID_RESPONSE"
  | "CONFIGURATION_ERROR"
  | "UNKNOWN";

export type TiptapJsonNode = {
  attrs?: Record<string, unknown>;
  content?: TiptapJsonNode[];
  marks?: Array<{ type?: string }>;
  text?: string;
  type?: string;
};

export type TranslatableTextRef = {
  text: string;
  update: (value: string) => void;
};

export const localeDisplayNames: Record<Locale, string> = {
  en: "영어",
  ja: "일본어",
  ko: "한국어",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseTiptapJson(value: string): TiptapJsonNode | null {
  if (!value.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? (parsed as TiptapJsonNode) : null;
  } catch {
    return null;
  }
}

function splitOuterWhitespace(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.slice(leading.length, value.length - trailing.length);

  return { core, leading, trailing };
}

function isTextNodeTranslatable(node: TiptapJsonNode, ancestors: string[]) {
  if (typeof node.text !== "string") {
    return false;
  }

  if (!node.text.trim()) {
    return false;
  }

  if (ancestors.includes("codeBlock")) {
    return false;
  }

  return !node.marks?.some((mark) => mark.type === "code");
}

export function collectTranslatableTextRefs(
  node: TiptapJsonNode,
  ancestors: string[] = [],
): TranslatableTextRef[] {
  const refs: TranslatableTextRef[] = [];

  if (
    (node.type === "image" || node.type === "video") &&
    typeof node.attrs?.caption === "string" &&
    node.attrs.caption.trim()
  ) {
    const { core, leading, trailing } = splitOuterWhitespace(node.attrs.caption);
    refs.push({
      text: core,
      update: (value) => {
        node.attrs = {
          ...node.attrs,
          caption: `${leading}${value}${trailing}`,
        };
      },
    });
  }

  if (isTextNodeTranslatable(node, ancestors)) {
    const { core, leading, trailing } = splitOuterWhitespace(node.text ?? "");
    refs.push({
      text: core,
      update: (value) => {
        node.text = `${leading}${value}${trailing}`;
      },
    });
  }

  const nextAncestors = node.type ? [...ancestors, node.type] : ancestors;

  for (const child of node.content ?? []) {
    refs.push(...collectTranslatableTextRefs(child, nextAncestors));
  }

  return refs;
}

export function hasTranslatableBodyText(value: string) {
  const parsed = parseTiptapJson(value);

  if (!parsed) {
    return false;
  }

  return collectTranslatableTextRefs(parsed).length > 0;
}
