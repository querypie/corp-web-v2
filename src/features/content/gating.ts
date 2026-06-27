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

export function getContentUnlockCookieName(
  id: string,
  section?: ManagedContentEntry["section"],
) {
  const scopedId = section ? `${section}_${id}` : id;
  return `${CONTENT_UNLOCK_COOKIE_PREFIX}_${scopedId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
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

function findSentenceBoundary(text: string, preferredLength: number) {
  const normalizedPreferredLength = Math.max(1, Math.min(preferredLength, text.length));
  const sentenceEndMatches = Array.from(text.matchAll(/[.!?。！？](?:\s+|$)/g));
  const sentenceEndIndexes = sentenceEndMatches.map((match) => match.index + match[0].length);
  const nextSentenceEnd = sentenceEndIndexes.find(
    (index) => index >= normalizedPreferredLength && index <= normalizedPreferredLength + 240,
  );

  if (nextSentenceEnd) {
    return nextSentenceEnd;
  }

  const previousSentenceEnd = sentenceEndIndexes
    .filter((index) => index <= normalizedPreferredLength && index >= normalizedPreferredLength * 0.6)
    .at(-1);

  if (previousSentenceEnd) {
    return previousSentenceEnd;
  }

  const nextWordBoundary = text
    .slice(normalizedPreferredLength, normalizedPreferredLength + 80)
    .search(/\s/);

  if (nextWordBoundary > 0) {
    return normalizedPreferredLength + nextWordBoundary;
  }

  const previousWordBoundary = text.slice(0, normalizedPreferredLength).search(/\s\S*$/);

  if (previousWordBoundary > 0) {
    return previousWordBoundary;
  }

  return normalizedPreferredLength;
}

function truncateTextAtSentenceBoundary(text: string, targetLength: number) {
  if (text.length <= targetLength) {
    return text;
  }

  const cutIndex = findSentenceBoundary(text, targetLength);
  return text.slice(0, cutIndex).trimEnd();
}

function truncateHtmlByTextLength(html: string, targetLength: number) {
  const tokens = tokenizeHtml(html);
  const openTags: string[] = [];
  let result = "";
  let currentLength = 0;
  let didTruncate = false;

  for (const token of tokens) {
    if (didTruncate) {
      break;
    }

    if (token.startsWith("<")) {
      result += token;

      if (isCommentToken(token) || isSelfClosingTag(token)) {
        continue;
      }

      if (isClosingTag(token)) {
        openTags.pop();
      } else {
        const tagName = getTagName(token);

        if (tagName) {
          openTags.push(tagName);
        }
      }

      continue;
    }

    const remainingLength = targetLength - currentLength;

    if (remainingLength <= 0) {
      didTruncate = true;
      break;
    }

    if (token.length <= remainingLength) {
      result += token;
      currentLength += token.length;
      continue;
    }

    const truncatedText = truncateTextAtSentenceBoundary(token, remainingLength);
    result += truncatedText;
    currentLength += truncatedText.length;
    didTruncate = true;
  }

  for (let index = openTags.length - 1; index >= 0; index -= 1) {
    result += `</${openTags[index]}>`;
  }

  return result;
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
    const blockTextLength = countTextContent(block);

    if (currentLength + blockTextLength > targetLength) {
      const remainingLength = Math.max(1, targetLength - currentLength);
      selectedBlocks.push(truncateHtmlByTextLength(block, remainingLength));
      break;
    }

    selectedBlocks.push(block);
    currentLength += blockTextLength;

    if (currentLength >= targetLength) {
      break;
    }
  }

  return selectedBlocks.join("");
}

export function hasUnlockedContentAccess(value: string | undefined) {
  return value === "true";
}
