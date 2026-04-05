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

function wrapToken(tokenClass: string, value: string) {
  return `<span class="type-content-mono ${tokenClass}">${value}</span>`;
}

function highlightHtml(code: string) {
  const escaped = escapeHtml(code);

  return escaped.replace(
    /(&lt;\/?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?&gt;)/g,
    (_match, open, tagName, attrs, close) => {
      const highlightedAttrs = attrs.replace(
        /([A-Za-z_:][-A-Za-z0-9_:.]*)(=)(&quot;.*?&quot;|&#39;.*?&#39;)/g,
        (_attrMatch: string, attrName: string, eq: string, attrValue: string) =>
          `${wrapToken("code-token-attr", attrName)}${wrapToken("code-token-punctuation", eq)}${wrapToken("code-token-string", attrValue)}`,
      );

      return `${wrapToken("code-token-punctuation", open)}${wrapToken("code-token-tag", tagName)}${highlightedAttrs}${wrapToken("code-token-punctuation", close)}`;
    },
  );
}

function highlightScriptLike(code: string) {
  const escaped = escapeHtml(code);

  return escaped
    .replace(/("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`)/g, (match) =>
      wrapToken("code-token-string", match),
    )
    .replace(/\b(function|return|const|let|var|if|else|for|while|class|new|import|export|from|await|async|true|false|null|undefined)\b/g, (match) =>
      wrapToken("code-token-keyword", match),
    )
    .replace(/\b(\d+(?:\.\d+)?)\b/g, (match) =>
      wrapToken("code-token-number", match),
    )
    .replace(/(\/\/.*$)/gm, (match) =>
      wrapToken("code-token-comment", match),
    );
}

function highlightShell(code: string) {
  const escaped = escapeHtml(code);

  return escaped
    .replace(/(#.*$)/gm, (match) => wrapToken("code-token-comment", match))
    .replace(/(\$\{?[A-Za-z_][A-Za-z0-9_]*\}?)/g, (match) => wrapToken("code-token-variable", match))
    .replace(/("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, (match) => wrapToken("code-token-string", match));
}

export function highlightCodeToHtml(code: string, language?: string) {
  const normalizedLanguage = (language ?? "").toLowerCase();

  if (["html", "xml"].includes(normalizedLanguage) || /^\s*<[\w!/]/.test(code)) {
    return highlightHtml(code);
  }

  if (["js", "jsx", "ts", "tsx", "json"].includes(normalizedLanguage)) {
    return highlightScriptLike(code);
  }

  if (["sh", "bash", "shell", "zsh"].includes(normalizedLanguage)) {
    return highlightShell(code);
  }

  return escapeHtml(code);
}

export function highlightCodeBlocksInHtml(html: string) {
  return html.replace(
    /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_match, language: string | undefined, codeContent: string) => {
      const rawCode = unescapeHtml(codeContent);
      return renderLineNumberedCodeBlock(rawCode, language);
    },
  );
}

export function renderLineNumberedCodeBlock(code: string, language?: string) {
  const highlighted = highlightCodeToHtml(code, language);
  const lines = highlighted.split("\n");
  const lineNumbers = lines
    .map((_, index) => `<span class="code-line-number type-content-mono">${index + 1}</span>`)
    .join("");
  const lineContents = lines
    .map((line) => `<span class="code-line type-content-mono">${line || " "}</span>`)
    .join("");

  return `<div class="code-block-shell type-content-mono"><div class="code-block-gutter type-content-mono">${lineNumbers}</div><pre class="type-content-mono"><code class="type-content-mono">${lineContents}</code></pre></div>`;
}
