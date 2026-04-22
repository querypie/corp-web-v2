const ALLOWED_INTERNAL_PAGES = new Set([
  "",
  "sample-article",
  "mdx-guide",
  "mdx-guide/basic-syntax",
  "mdx-guide/images",
  "mdx-guide/inline-components",
  "mdx-guide/layout-components",
  "mdx-guide/mermaid-diagrams",
  "mdx-guide/notes-and-alerts",
  "mdx-guide/tables",
]);

export function getInternalMdxSegments(slug?: string[]): string[] | null {
  const normalized = slug ?? [];
  const joined = normalized.join("/");

  if (!ALLOWED_INTERNAL_PAGES.has(joined)) {
    return null;
  }

  return normalized;
}
