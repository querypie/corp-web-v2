function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeHtml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function stripPersistedHighlightSpans(value: string) {
  let normalized = value;
  let previous = "";

  while (previous !== normalized) {
    previous = normalized;
    normalized = normalized.replace(
      /<span\b[^>]*class=(["'])[^"']*\b(?:type-content-mono|code-token-[^"'\s]+)\b[^"']*\1[^>]*>([\s\S]*?)<\/span>/g,
      "$2",
    );
  }

  return normalized;
}

function normalizeStoredCodeBlock(codeContent: string) {
  return stripPersistedHighlightSpans(unescapeHtml(codeContent));
}

export function highlightCodeToHtml(code: string) {
  return escapeHtml(code);
}

export function highlightCodeBlocksInHtml(html: string) {
  return html.replace(
    /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_match, _language: string | undefined, codeContent: string) => {
      const rawCode = normalizeStoredCodeBlock(codeContent);
      return renderLineNumberedCodeBlock(rawCode);
    },
  );
}

export function renderLineNumberedCodeBlock(code: string) {
  const escapedCode = highlightCodeToHtml(code);
  const lines = escapedCode.split("\n");
  const lineNumbers = lines
    .map((_, index) => `<span class="code-line-number type-content-mono">${index + 1}</span>`)
    .join("");
  const lineContents = lines
    .map((line) => `<span class="code-line type-content-mono">${line || " "}</span>`)
    .join("");

  return `<div class="code-block-shell type-content-mono"><div class="code-block-gutter type-content-mono">${lineNumbers}</div><pre class="type-content-mono"><code class="type-content-mono">${lineContents}</code></pre></div>`;
}
