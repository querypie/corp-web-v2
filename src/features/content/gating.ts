import type { ContentGatingLevel, ManagedContentEntry } from "./data";

export const CONTENT_UNLOCK_COOKIE_PREFIX = "querypie_content_unlocked";
export const CONTENT_UNLOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function getContentUnlockCookieName(id: string) {
  return `${CONTENT_UNLOCK_COOKIE_PREFIX}_${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function isContentGatingEnabled(
  item: Pick<ManagedContentEntry, "contentType" | "gatingLevel" | "section">,
) {
  return (
    item.section !== "news" &&
    item.contentType === "content" &&
    item.gatingLevel !== "none"
  );
}

export function getContentGatingRatio(level: ContentGatingLevel) {
  switch (level) {
    case "10":
      return 0.1;
    case "30":
      return 0.3;
    case "50":
      return 0.5;
    default:
      return 1;
  }
}

function tokenizeHtml(html: string) {
  return html.match(/<\/?[^>]+>|[^<]+/g) ?? [];
}

function isCommentToken(token: string) {
  return /^<!--/.test(token);
}

function isClosingTag(token: string) {
  return /^<\//.test(token);
}

function isSelfClosingTag(token: string) {
  const tagName = getTagName(token);
  return token.endsWith("/>") || (tagName ? VOID_TAGS.has(tagName) : false);
}

function getTagName(token: string) {
  const match = token.match(/^<\/?\s*([a-z0-9-]+)/i);
  return match?.[1]?.toLowerCase() ?? "";
}

function countTextContent(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

function collectRootBlocks(html: string) {
  const tokens = tokenizeHtml(html);
  const blocks: string[] = [];
  const stack: string[] = [];
  let current = "";

  for (const token of tokens) {
    current += token;

    if (!token.startsWith("<")) {
      if (stack.length === 0 && current.trim()) {
        blocks.push(current);
        current = "";
      }

      continue;
    }

    if (isCommentToken(token) || isSelfClosingTag(token)) {
      if (stack.length === 0 && current.trim()) {
        blocks.push(current);
        current = "";
      }

      continue;
    }

    if (isClosingTag(token)) {
      stack.pop();
    } else {
      const tagName = getTagName(token);

      if (tagName) {
        stack.push(tagName);
      }
    }

    if (stack.length === 0 && current.trim()) {
      blocks.push(current);
      current = "";
    }
  }

  if (current.trim()) {
    blocks.push(current);
  }

  return blocks;
}

export function buildContentPreviewHtml(html: string, level: ContentGatingLevel) {
  const ratio = getContentGatingRatio(level);

  if (ratio >= 1 || !html.trim()) {
    return html;
  }

  const blocks = collectRootBlocks(html);

  if (!blocks.length) {
    return html;
  }

  const totalTextLength = blocks.reduce((sum, block) => sum + countTextContent(block), 0);

  if (totalTextLength <= 0) {
    return blocks.slice(0, Math.max(1, Math.ceil(blocks.length * ratio))).join("");
  }

  const targetLength = Math.max(1, Math.ceil(totalTextLength * ratio));
  const selectedBlocks: string[] = [];
  let currentLength = 0;

  for (const block of blocks) {
    selectedBlocks.push(block);
    currentLength += countTextContent(block);

    if (currentLength >= targetLength) {
      break;
    }
  }

  return selectedBlocks.join("");
}

export function hasUnlockedContentAccess(value: string | undefined) {
  return value === "true";
}
