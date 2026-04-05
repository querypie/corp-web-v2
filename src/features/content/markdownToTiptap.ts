import { splitMarkdownBlocks } from "./markdownBlocks";
import { highlightCodeToHtml } from "./codeHighlight";

type TiptapNode = {
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ attrs?: Record<string, unknown>; type: string }>;
  text?: string;
  type: string;
};

type ConvertedBlock = {
  html: string;
  node: TiptapNode;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getYoutubeEmbedSrc(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace(/^\/+/, "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }

      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
  } catch {
    return url;
  }

  return url;
}

function normalizeContentAssetSrc(src: string) {
  return src.startsWith("public/") ? `/${src.slice("public/".length)}` : src;
}

function parseMarkdownImage(block: string) {
  const legacyBracketMatch = block.match(/^!\[\[(.+)\]\(([^)]+)\)$/);

  if (legacyBracketMatch) {
    return {
      alt: legacyBracketMatch[1],
      src: normalizeContentAssetSrc(legacyBracketMatch[2]),
    };
  }

  const doubleBracketMatch = block.match(/^!\[\[(.+)\]\]\(([^)]+)\)$/);

  if (doubleBracketMatch) {
    return {
      alt: doubleBracketMatch[1],
      src: normalizeContentAssetSrc(doubleBracketMatch[2]),
    };
  }

  const standardMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

  if (standardMatch) {
    return {
      alt: standardMatch[1],
      src: normalizeContentAssetSrc(standardMatch[2]),
    };
  }

  return null;
}

function appendMarkHtml(text: string, marks: Array<{ attrs?: Record<string, unknown>; type: string }>) {
  return marks.reduce((current, mark) => {
    if (mark.type === "bold") return `<strong>${current}</strong>`;
    if (mark.type === "italic") return `<em>${current}</em>`;
    if (mark.type === "code") return `<code>${current}</code>`;
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
      return `<a href="${escapeHtml(href)}">${current}</a>`;
    }
    return current;
  }, text);
}

function renderInlineNodesHtml(nodes: TiptapNode[]) {
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") {
        return "<br />";
      }

      if (node.type !== "text") {
        return "";
      }

      return appendMarkHtml(escapeHtml(node.text ?? ""), node.marks ?? []);
    })
    .join("");
}

function createTextNode(
  text: string,
  marks: Array<{ attrs?: Record<string, unknown>; type: string }> = [],
): TiptapNode {
  return {
    marks: marks.length ? marks : undefined,
    text,
    type: "text",
  };
}

function convertInlineMarkdown(text: string) {
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);
  const nodes: TiptapNode[] = [];

  for (const token of tokens.filter(Boolean)) {
    if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        nodes.push(createTextNode(match[1], [{ attrs: { href: match[2] }, type: "link" }]));
        continue;
      }
    }

    if (/^`[^`]+`$/.test(token)) {
      nodes.push(createTextNode(token.slice(1, -1), [{ type: "code" }]));
      continue;
    }

    if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(token)) {
      nodes.push(createTextNode(token.slice(2, -2), [{ type: "bold" }]));
      continue;
    }

    if (/^(\*|_)[\s\S]+(\*|_)$/.test(token)) {
      nodes.push(createTextNode(token.slice(1, -1), [{ type: "italic" }]));
      continue;
    }

    nodes.push(createTextNode(token));
  }

  return nodes;
}

function convertParagraphLines(lines: string[]) {
  const content: TiptapNode[] = [];

  lines.forEach((line, index) => {
    content.push(...convertInlineMarkdown(line));
    if (index < lines.length - 1) {
      content.push({ type: "hardBreak" });
    }
  });

  return {
    html: `<p>${renderInlineNodesHtml(content)}</p>`,
    node: { content, type: "paragraph" },
  };
}

function convertMarkdownBlock(block: string): ConvertedBlock {
  const trimmedBlock = block.trim();
  const lines = trimmedBlock.split("\n");
  const firstLine = lines[0] ?? "";

  if (/^\s*```/.test(firstLine) && /^\s*```\s*$/.test(lines[lines.length - 1] ?? "")) {
    const language = firstLine.replace(/^```/, "").trim();
    const code = lines.slice(1, -1).join("\n");
    return {
      html: `<pre><code>${highlightCodeToHtml(code, language)}</code></pre>`,
      node: {
        attrs: language ? { language } : undefined,
        content: [createTextNode(code)],
        type: "codeBlock",
      },
    };
  }

  if (/^---+$/.test(trimmedBlock) || /^\*\*\*+$/.test(trimmedBlock)) {
    return {
      html: "<hr />",
      node: { type: "horizontalRule" },
    };
  }

  const imageMatch = parseMarkdownImage(trimmedBlock);
  if (imageMatch) {
    return {
      html: `<img src="${escapeHtml(imageMatch.src)}" alt="${escapeHtml(imageMatch.alt)}" />`,
      node: {
        attrs: {
          alt: imageMatch.alt,
          src: imageMatch.src,
        },
        type: "image",
      },
    };
  }

  const youtubeLinkMatch = trimmedBlock.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
  if (youtubeLinkMatch && /youtu\.?be|youtube\.com/.test(youtubeLinkMatch[2])) {
    return {
      html: `<iframe src="${escapeHtml(getYoutubeEmbedSrc(youtubeLinkMatch[2]))}" title="${escapeHtml(youtubeLinkMatch[1])}"></iframe>`,
      node: {
        attrs: {
          src: youtubeLinkMatch[2],
        },
        type: "youtube",
      },
    };
  }

  if (trimmedBlock.startsWith("# ")) {
    const content = convertInlineMarkdown(trimmedBlock.replace(/^#\s+/, ""));
    return {
      html: `<h1>${renderInlineNodesHtml(content)}</h1>`,
      node: { attrs: { level: 1 }, content, type: "heading" },
    };
  }

  if (trimmedBlock.startsWith("## ")) {
    const content = convertInlineMarkdown(trimmedBlock.replace(/^##\s+/, ""));
    return {
      html: `<h2>${renderInlineNodesHtml(content)}</h2>`,
      node: { attrs: { level: 2 }, content, type: "heading" },
    };
  }

  if (trimmedBlock.startsWith("### ")) {
    const content = convertInlineMarkdown(trimmedBlock.replace(/^###\s+/, ""));
    return {
      html: `<h3>${renderInlineNodesHtml(content)}</h3>`,
      node: { attrs: { level: 3 }, content, type: "heading" },
    };
  }

  if (lines.every((line) => /^>\s?/.test(line))) {
    const paragraphs = lines.map((line) => {
      const content = convertInlineMarkdown(line.replace(/^>\s?/, ""));
      return {
        html: `<p>${renderInlineNodesHtml(content)}</p>`,
        node: { content, type: "paragraph" } satisfies TiptapNode,
      };
    });

    return {
      html: `<blockquote>${paragraphs.map((item) => item.html).join("")}</blockquote>`,
      node: {
        content: paragraphs.map((item) => item.node),
        type: "blockquote",
      },
    };
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line))) {
    const items = lines.map((line) => {
      const content = convertInlineMarkdown(line.replace(/^\d+\.\s+/, ""));
      return {
        html: `<li><p>${renderInlineNodesHtml(content)}</p></li>`,
        node: {
          content: [{ content, type: "paragraph" }],
          type: "listItem",
        } satisfies TiptapNode,
      };
    });

    return {
      html: `<ol>${items.map((item) => item.html).join("")}</ol>`,
      node: { content: items.map((item) => item.node), type: "orderedList" },
    };
  }

  if (lines.every((line) => /^-\s+/.test(line))) {
    const items = lines.map((line) => {
      const content = convertInlineMarkdown(line.replace(/^-\s+/, ""));
      return {
        html: `<li><p>${renderInlineNodesHtml(content)}</p></li>`,
        node: {
          content: [{ content, type: "paragraph" }],
          type: "listItem",
        } satisfies TiptapNode,
      };
    });

    return {
      html: `<ul>${items.map((item) => item.html).join("")}</ul>`,
      node: { content: items.map((item) => item.node), type: "bulletList" },
    };
  }

  if (
    lines.length >= 2 &&
    lines.every((line) => /^\|.*\|$/.test(line.trim())) &&
    /^\|(\s*:?-{3,}:?\s*\|)+$/.test(lines[1].trim())
  ) {
    const rows = lines.map((line) =>
      line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim()),
    );
    const [headerRow, , ...bodyRows] = rows;

    const headerCells = headerRow.map((cell) => {
      const content = convertInlineMarkdown(cell);
      return {
        html: `<th><p>${renderInlineNodesHtml(content)}</p></th>`,
        node: {
          content: [{ content, type: "paragraph" }],
          type: "tableHeader",
        } satisfies TiptapNode,
      };
    });

    const body = bodyRows.map((row) => {
      const cells = row.map((cell) => {
        const content = convertInlineMarkdown(cell);
        return {
          html: `<td><p>${renderInlineNodesHtml(content)}</p></td>`,
          node: {
            content: [{ content, type: "paragraph" }],
            type: "tableCell",
          } satisfies TiptapNode,
        };
      });

      return {
        html: `<tr>${cells.map((cell) => cell.html).join("")}</tr>`,
        node: { content: cells.map((cell) => cell.node), type: "tableRow" } satisfies TiptapNode,
      };
    });

    return {
      html: `<table><tbody><tr>${headerCells.map((cell) => cell.html).join("")}</tr>${body.map((row) => row.html).join("")}</tbody></table>`,
      node: {
        content: [
          { content: headerCells.map((cell) => cell.node), type: "tableRow" },
          ...body.map((row) => row.node),
        ],
        type: "table",
      },
    };
  }

  return convertParagraphLines(lines);
}

export function convertMarkdownToTiptap(markdown: string) {
  const blocks = splitMarkdownBlocks(markdown);

  if (blocks.length === 0) {
    return {
      html: "<p></p>",
      json: JSON.stringify({ content: [{ type: "paragraph" }], type: "doc" }),
    };
  }

  const converted = blocks.map(convertMarkdownBlock);

  return {
    html: converted.map((block) => block.html).join(""),
    json: JSON.stringify({
      content: converted.map((block) => block.node),
      type: "doc",
    }),
  };
}
