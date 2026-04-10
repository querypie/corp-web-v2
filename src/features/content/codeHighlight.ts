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

<<<<<<< HEAD
function highlightSql(code: string) {
  const escaped = escapeHtml(code);

  return escaped
    .replace(/(--.*$)/gm, (match) => wrapToken("code-token-comment", match))
    .replace(/("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, (match) => wrapToken("code-token-string", match))
    .replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => wrapToken("code-token-number", match))
    .replace(/\b(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|VIEW|INDEX|AND|OR|NOT|NULL|IS|IN|AS|ON|JOIN|LEFT|RIGHT|INNER|OUTER|LIMIT|OFFSET|DISTINCT|COUNT|SUM|AVG|MIN|MAX|BY|ASC|DESC)\b/gi, (match) =>
      wrapToken("code-token-keyword", match),
    );
}

function highlightYaml(code: string) {
  const escaped = escapeHtml(code);

  return escaped
    .replace(/(#.*$)/gm, (match) => wrapToken("code-token-comment", match))
    .replace(/(\s|^)([A-Za-z0-9_.-]+)(:\s)/g, (_match, prefix, key, suffix) =>
      `${prefix}${wrapToken("code-token-attr", key)}${wrapToken("code-token-punctuation", suffix)}`,
    )
    .replace(/("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, (match) => wrapToken("code-token-string", match))
    .replace(/\b(true|false|null)\b/gi, (match) => wrapToken("code-token-keyword", match))
    .replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => wrapToken("code-token-number", match));
}

function highlightPython(code: string) {
  const escaped = escapeHtml(code);

  return escaped
    .replace(/(#.*$)/gm, (match) => wrapToken("code-token-comment", match))
    .replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, (match) =>
      wrapToken("code-token-string", match),
    )
    .replace(/\b(def|return|if|elif|else|for|while|class|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue|True|False|None|and|or|not|in|is)\b/g, (match) =>
      wrapToken("code-token-keyword", match),
    )
    .replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => wrapToken("code-token-number", match));
}

function highlightRego(code: string) {
  const escaped = escapeHtml(code);

  return escaped
    .replace(/(#.*$)/gm, (match) => wrapToken("code-token-comment", match))
    .replace(/("(?:\\.|[^"])*")/g, (match) => wrapToken("code-token-string", match))
    .replace(/\b(package|import|default|not|some|with|if|in|contains|every|else|true|false|null)\b/g, (match) =>
      wrapToken("code-token-keyword", match),
    )
    .replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => wrapToken("code-token-number", match));
}

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
  if (["sql"].includes(normalizedLanguage)) {
    return highlightSql(code);
  }

  if (["yml", "yaml"].includes(normalizedLanguage)) {
    return highlightYaml(code);
  }

  if (["py", "python"].includes(normalizedLanguage)) {
    return highlightPython(code);
  }

  if (["rego"].includes(normalizedLanguage)) {
    return highlightRego(code);
  }

=======
>>>>>>> origin/main
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
