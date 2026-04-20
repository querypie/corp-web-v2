import type { MdxHeading } from "./types";

export function slugifyHeadingText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function cleanHeadingText(text: string): string {
  return text
    .replace(/^(#+)\s+|(\*\*|__|\*|_|`|~{1,2})(.*?)\1/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

export function extractHeadingsFromMdx(mdxSource: string): MdxHeading[] {
  const result: MdxHeading[] = [];
  const stack: { level: number; heading: MdxHeading }[] = [];
  const headingRegex = /^(#{1,6})\s+(.*)$/;
  const codeBlockRegex = /^```/;
  let inCodeBlock = false;

  for (const line of mdxSource.split("\n")) {
    if (codeBlockRegex.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = headingRegex.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const raw = match[2].trim();
    const text = cleanHeadingText(raw);
    const heading: MdxHeading = { targetId: slugifyHeadingText(text), text };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(heading);
    } else {
      const parent = stack[stack.length - 1].heading;
      parent.list = parent.list ?? [];
      parent.list.push(heading);
    }
    stack.push({ level, heading });
  }

  return result;
}
