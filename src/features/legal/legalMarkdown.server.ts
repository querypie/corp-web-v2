import "server-only";

import { promises as fs } from "fs";
import MarkdownIt from "markdown-it";
import xss, { escapeAttrValue, type IWhiteList } from "xss";

const markdown = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false,
});

const defaultLinkOpenRenderer = markdown.renderer.rules.link_open
  ?? ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options));

markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const href = token.attrGet("href");

  if (href && isAllowedHref(href)) {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }
  } else {
    token.attrSet("href", "");
  }

  return defaultLinkOpenRenderer(tokens, index, options, env, self);
};

const allowedTags = [
  "a",
  "br",
  "div",
  "em",
  "h2",
  "h3",
  "h4",
  "li",
  "ol",
  "p",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
] as const;

const allowedAttributes: Partial<Record<(typeof allowedTags)[number], string[]>> = {
  a: ["href", "rel", "target", "title"],
  div: ["class"],
  ol: ["start"],
  td: ["cellBackgroundColor", "cellbackgroundcolor", "colSpan", "colspan", "rowSpan", "rowspan"],
  th: ["class", "colSpan", "colspan", "rowSpan", "rowspan"],
};

export async function renderLegalMarkdownFile(filePath: string) {
  const markdownSource = await fs.readFile(filePath, "utf8");
  return renderLegalMarkdown(markdownSource);
}

export function renderLegalMarkdown(markdownSource: string) {
  const html = markdown.render(markdownSource);

  const sanitizedHtml = xss(html, {
    onTagAttr(_tag, name, value) {
      if (name === "href" && !isAllowedHref(value)) {
        return "";
      }

      if (name === "target" && value !== "_blank") {
        return "";
      }

      if (name === "rel") {
        return `rel="${escapeAttrValue(value)}"`;
      }
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style", "iframe"],
    whiteList: Object.fromEntries(allowedTags.map((tag) => [tag, allowedAttributes[tag] ?? []])) as IWhiteList,
  });

  return normalizeLegalTableEmptyCells(sanitizedHtml);
}

function normalizeLegalTableEmptyCells(html: string) {
  return html.replace(
    /(<tr>\s*<td[^>]*>\s*이전 받는 자의 보관기간\s*<\/td>\s*<td[^>]*\s(?:colspan|colSpan)="2"[^>]*>[\s\S]*?<\/td>\s*)<\/tr>/gi,
    "$1<td></td></tr>",
  );
}

function isAllowedHref(value: string) {
  return (
    value.startsWith("/")
    || value.startsWith("http://")
    || value.startsWith("https://")
    || value.startsWith("mailto:")
  );
}
