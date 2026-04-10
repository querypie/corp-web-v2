export function splitMarkdownBlocks(markdown: string) {
  const normalized = markdown.trim();

  if (!normalized) {
    return [];
  }

  const lines = normalized.split("\n");
  const blocks: string[] = [];
  let buffer: string[] = [];
  let inCodeBlock = false;

  function getListType(line: string) {
    if (/^\s*[-*]\s+/.test(line)) {
      return "bullet";
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      return "ordered";
    }

    return null;
  }

  function isTableLine(line: string) {
    return /^\s*\|.*\|\s*$/.test(line);
  }

  function isBlockquoteLine(line: string) {
    return /^\s*>\s?/.test(line);
  }

  function isHeadingLine(line: string) {
    return /^\s{0,3}#{1,6}\s+/.test(line);
  }

  function flush() {
    const nextBlock = buffer.join("\n").trim();

    if (nextBlock) {
      blocks.push(nextBlock);
    }

    buffer = [];
  }

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      if (!inCodeBlock && buffer.length > 0) {
        flush();
      }

      buffer.push(line);
      inCodeBlock = !inCodeBlock;

      if (!inCodeBlock) {
        flush();
      }
      continue;
    }

    if (inCodeBlock) {
      buffer.push(line);
      continue;
    }

    if (line.trim() === "") {
      flush();
      continue;
    }

    const currentListType = getListType(line);
    const previousListType = getListType(buffer[buffer.length - 1] ?? "");
    const currentIsTable = isTableLine(line);
    const previousIsTable = isTableLine(buffer[buffer.length - 1] ?? "");
    const currentIsBlockquote = isBlockquoteLine(line);
    const previousIsBlockquote = isBlockquoteLine(buffer[buffer.length - 1] ?? "");
    const currentIsHeading = isHeadingLine(line);
    const previousIsHeading = isHeadingLine(buffer[buffer.length - 1] ?? "");

    if (buffer.length > 0) {
      if (currentIsHeading || previousIsHeading) {
        flush();
      }

      if (currentIsBlockquote !== previousIsBlockquote) {
        flush();
      }

      if (currentIsTable !== previousIsTable) {
        flush();
      }

      if (currentListType && currentListType !== previousListType) {
        flush();
      }

      if (!currentListType && previousListType) {
        flush();
      }
    }

    buffer.push(line);

    if (currentIsHeading) {
      flush();
    }
  }

  flush();

  return blocks;
}

export function normalizeFencedCodeLines(firstLine: string, codeLines: string[]) {
  const leadingIndent = firstLine.match(/^(\s*)```/)?.[1] ?? "";
  const unindentedLines = leadingIndent
    ? codeLines.map((line) =>
        line.startsWith(leadingIndent) ? line.slice(leadingIndent.length) : line,
      )
    : codeLines;

  const nonEmptyLines = unindentedLines.filter((line) => line.trim().length > 0);
  const commonIndent = nonEmptyLines.reduce<number>((minIndent, line) => {
    const currentIndent = line.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(minIndent, currentIndent);
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(commonIndent) || commonIndent <= 0) {
    return trimEdgeEmptyLines(unindentedLines);
  }

  return trimEdgeEmptyLines(unindentedLines.map((line) =>
    line.trim().length > 0 ? line.slice(commonIndent) : line,
  ));
}

function trimEdgeEmptyLines(lines: string[]) {
  let start = 0;
  let end = lines.length;

  while (start < end && lines[start]?.trim() === "") {
    start += 1;
  }

  while (end > start && lines[end - 1]?.trim() === "") {
    end -= 1;
  }

  return lines.slice(start, end);
}
