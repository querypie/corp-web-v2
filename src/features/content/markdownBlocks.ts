export function splitMarkdownBlocks(markdown: string) {
  const normalized = markdown.trim();

  if (!normalized) {
    return [];
  }

  const lines = normalized.split("\n");
  const blocks: string[] = [];
  let buffer: string[] = [];
  let inCodeBlock = false;

  function flush() {
    const nextBlock = buffer.join("\n").trim();

    if (nextBlock) {
      blocks.push(nextBlock);
    }

    buffer = [];
  }

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
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

    buffer.push(line);
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
