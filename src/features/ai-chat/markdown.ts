import MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";
import type { ChatSource } from "./types";

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true });
markdown.linkify.set({ fuzzyLink: false, fuzzyEmail: false });

const cjkCharacter = /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u;

// Allow a strong closing delimiter between punctuation and CJK text, such as
// "**ACP(Access Control Platform)**가". Keep the source intact: code, escaped
// markers and URL destinations continue to use the parser's existing rules.
markdown.inline.ruler.before("emphasis", "cjk_strong_close", (state, silent) => {
  if (silent) return false;
  const marker = state.src[state.pos];
  if (marker !== "*" && marker !== "_") return false;
  const scanned = state.scanDelims(state.pos, marker === "*");
  if (scanned.length !== 2 || scanned.can_close || state.pos + scanned.length >= state.posMax) return false;
  const markerCode = marker.charCodeAt(0);
  if (!state.delimiters.some((delimiter) => delimiter.marker === markerCode && delimiter.open && delimiter.length >= 2)) return false;
  const preceding = state.src[state.pos - 1] ?? "";
  const following = state.src.codePointAt(state.pos + scanned.length);
  if (!markdown.utils.isPunctChar(preceding) || following === undefined || !cjkCharacter.test(String.fromCodePoint(following))) return false;

  for (let index = 0; index < scanned.length; index++) {
    const token = state.push("text", "", 0);
    token.content = marker;
    state.delimiters.push({
      marker: markerCode, length: scanned.length,
      token: state.tokens.length - 1, end: -1, open: false, close: true,
    });
  }
  state.pos += scanned.length;
  return true;
});

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
