import MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";
import type { ChatSource } from "./types";

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true });
markdown.linkify.set({ fuzzyLink: false, fuzzyEmail: false });

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

markdown.validateLink = (url) => normalizeUrl(url) !== null;
markdown.renderer.rules.link_open = (tokens, index, options, _env, renderer) => {
  const token = tokens[index];
  const url = normalizeUrl(token.attrGet("href") ?? "")!;
  token.attrSet("href", url);
  token.attrSet("target", "_blank");
  token.attrSet("rel", "noopener noreferrer");
  const fallback = tokens[index + 1]?.type === "link_close" ? markdown.utils.escapeHtml(url) : "";
  return renderer.renderToken(tokens, index, options) + fallback;
};
// Chat replies may describe images, but do not load model-supplied remote resources.
markdown.renderer.rules.image = (tokens, index) => markdown.utils.escapeHtml(tokens[index].content);
markdown.renderer.rules.table_open = (_tokens, _index, _options, env: { tableLabel: string }) =>
  `<div data-hermes-table tabindex="0" role="region" aria-label="${markdown.utils.escapeHtml(env.tableLabel)}"><table>`;
markdown.renderer.rules.table_close = () => "</table></div>\n";

export function renderHermesMarkdown(content: string, tableLabel: string) {
  return markdown.render(content, { tableLabel });
}

/** Use the same parsed links as the renderer, including references and balanced URL parentheses. */
export function findHermesLinks(content: string): ChatSource[] {
  const links: ChatSource[] = [];
  function collect(tokens: Token[]) {
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      if (token.type === "link_open") {
        const url = normalizeUrl(token.attrGet("href") ?? "");
        if (!url) continue;
        let title = "";
        for (let next = index + 1; next < tokens.length && tokens[next].type !== "link_close"; next++) {
          title += tokens[next].content;
        }
        title = title.trim();
        links.push({ title: !title || normalizeUrl(title) === url ? url : title, url });
      } else if (token.type === "inline" && token.children) {
        collect(token.children);
      }
    }
  }
  collect(markdown.parse(content, {}));
  return links;
}
