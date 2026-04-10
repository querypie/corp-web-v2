type MarkdownTable = {
  bodyRows: string[][];
  headerRow: string[];
};

function normalizeTableRow(line: string) {
  const trimmed = line.trim();
  const withoutLeading = trimmed.startsWith("|") ? trimmed.slice(1) : trimmed;
  const withoutEdges = withoutLeading.endsWith("|")
    ? withoutLeading.slice(0, -1)
    : withoutLeading;

  return withoutEdges.split("|").map((cell) => cell.trim());
}

function isSeparatorCell(cell: string) {
  return /^:?-{3,}:?$/.test(cell.trim());
}

export function parseMarkdownTable(lines: string[]): MarkdownTable | null {
  if (lines.length < 2) {
    return null;
  }

  const normalizedLines = lines.map((line) => line.trim()).filter(Boolean);

  if (normalizedLines.length < 2) {
    return null;
  }

  if (!normalizedLines.every((line) => line.includes("|"))) {
    return null;
  }

  const headerRow = normalizeTableRow(normalizedLines[0]);
  const separatorRow = normalizeTableRow(normalizedLines[1]);

  if (
    headerRow.length < 2 ||
    headerRow.length !== separatorRow.length ||
    !separatorRow.every(isSeparatorCell)
  ) {
    return null;
  }

  const bodyRows = normalizedLines.slice(2).map(normalizeTableRow);

  if (bodyRows.some((row) => row.length !== headerRow.length)) {
    return null;
  }

  return {
    bodyRows,
    headerRow,
  };
}
