export function splitLegacyQuotedListLine(line: string) {
  const normalized = line.trim();

  if (/^\d+\.\s+/.test(normalized)) {
    return normalized
      .split(/\s+(?=\d+\.\s+)/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (/^[-*]\s+/.test(normalized)) {
    return normalized
      .split(/\s+(?=[-*]\s+)/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [line];
}
