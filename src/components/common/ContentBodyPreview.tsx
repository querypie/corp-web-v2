import {
  CONTENT_PREVIEW_BLOCKQUOTE_CLASS,
  CONTENT_PREVIEW_BODY_CLASS,
  CONTENT_PREVIEW_CODEBLOCK_CLASS,
  CONTENT_PREVIEW_H1_CLASS,
  CONTENT_PREVIEW_H2_CLASS,
  CONTENT_PREVIEW_H3_CLASS,
  CONTENT_PREVIEW_H1_TOP_PADDING,
  CONTENT_PREVIEW_H2_TOP_PADDING,
  CONTENT_PREVIEW_H3_TOP_PADDING,
  CONTENT_PREVIEW_OL_CLASS,
  CONTENT_PREVIEW_RICH_CLASS,
  CONTENT_PREVIEW_TABLE_CELL_CLASS,
  CONTENT_PREVIEW_TABLE_CLASS,
  CONTENT_PREVIEW_TABLE_HEADER_CELL_CLASS,
  CONTENT_PREVIEW_TABLE_ROW_CLASS,
  CONTENT_PREVIEW_TABLE_WRAPPER_CLASS,
  CONTENT_PREVIEW_UL_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml, renderLineNumberedCodeBlock } from "@/features/content/codeHighlight";
import { splitLegacyQuotedListLine } from "@/features/content/legacyQuoteList";
import { shouldRenderMermaid } from "@/features/content/mermaid";
import { normalizeFencedCodeLines, splitMarkdownBlocks } from "@/features/content/markdownBlocks";
import { parseMarkdownTable } from "@/features/content/markdownTable";
import MermaidDiagram from "./MermaidDiagram";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function renderInlineMarkdown(text: string) {
  if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(text)) {
    return <strong className="font-semibold text-fg">{renderInlineMarkdown(text.slice(2, -2))}</strong>;
  }

  if (/^(\*|_)[\s\S]+(\*|_)$/.test(text)) {
    return <em className="italic text-fg">{renderInlineMarkdown(text.slice(1, -1))}</em>;
  }

  const tokens = text.split(/(<a\s+href="[^"]+"[^>]*>.*?<\/a>|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (/^<a\s+href="[^"]+"[^>]*>.*<\/a>$/.test(token)) {
      const match = token.match(/^<a\s+href="([^"]+)"[^>]*>([\s\S]*)<\/a>$/);
      if (!match) return token;

      return (
        <a
          key={`inline-html-link-${index}`}
          className="text-brand underline decoration-border underline-offset-4 transition-colors hover:text-fg"
          href={match[1]}
          rel="noreferrer"
          target="_blank"
        >
          {match[2].replace(/<[^>]+>/g, "")}
        </a>
      );
    }

    if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!match) return token;

      return (
        <a
          key={`inline-link-${index}`}
          className="text-brand underline decoration-border underline-offset-4 transition-colors hover:text-fg"
          href={match[2]}
          rel="noreferrer"
          target="_blank"
        >
          {match[1]}
        </a>
      );
    }

    if (/^`[^`]+`$/.test(token)) {
      return (
        <code
          key={`inline-code-${index}`}
          className="rounded-[8px] bg-bg-content px-2 py-1 type-content-mono text-fg"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(token)) {
      return (
        <strong key={`inline-strong-${index}`} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (/^(\*|_)[\s\S]+(\*|_)$/.test(token)) {
      return (
        <em key={`inline-em-${index}`} className="italic text-fg">
          {token.slice(1, -1)}
        </em>
      );
    }

    return token;
  });
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

function normalizeContentHtml(html: string) {
  const normalized = html.replace(
    /(src=|href=)(["'])public\//g,
    (_, attribute, quote) => `${attribute}${quote}/`,
  );

  return highlightCodeBlocksInHtml(normalized);
}

function parseMarkdownImage(block: string) {
  const legacyFigureLabelMatch = block.match(/^!\[\[([^\]]+)\]\s*([^\]]+)\]\(([^)]+)\)$/);

  if (legacyFigureLabelMatch) {
    const caption = `[${legacyFigureLabelMatch[1]}] ${legacyFigureLabelMatch[2]}`.trim();
    return {
      alt: caption,
      caption,
      src: normalizeContentAssetSrc(legacyFigureLabelMatch[3]),
    };
  }

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

function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = splitMarkdownBlocks(markdown);

  return (
    <div className="flex flex-col gap-5 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";
        const trimmedBlock = block.trim();

        const imageMatch = parseMarkdownImage(trimmedBlock);

        if (imageMatch) {
          const caption = imageMatch.caption ?? imageMatch.alt;
          return (
            <figure key={`image-${blockIndex}`} className="m-0 flex flex-col gap-3">
              <div className="overflow-hidden rounded-box bg-bg-content">
                <img
                  alt={imageMatch.alt}
                  className="block h-full w-full object-cover"
                  src={imageMatch.src}
                />
              </div>
              {caption ? <figcaption className="m-0 text-center type-content-caption text-mute-fg">{caption}</figcaption> : null}
            </figure>
          );
        }

        const youtubeLinkMatch = trimmedBlock.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
        if (youtubeLinkMatch && /youtu\.?be|youtube\.com/.test(youtubeLinkMatch[2])) {
          return (
            <div key={`youtube-${blockIndex}`} className="overflow-hidden rounded-box bg-bg-content">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full border-0"
                referrerPolicy="strict-origin-when-cross-origin"
                src={getYoutubeEmbedSrc(youtubeLinkMatch[2])}
                title={youtubeLinkMatch[1]}
              />
            </div>
          );
        }

        if (/^\s*```/.test(firstLine) && /^\s*```\s*$/.test(lines[lines.length - 1] ?? "")) {
          const codeLines = normalizeFencedCodeLines(firstLine, lines.slice(1, -1));
          const language = firstLine.replace(/^```/, "").trim();
          const code = codeLines.join("\n");

          if (shouldRenderMermaid(code, language)) {
            return <MermaidDiagram key={`mermaid-${blockIndex}`} code={code} />;
          }

          return <div key={`pre-${blockIndex}`} className={CONTENT_PREVIEW_CODEBLOCK_CLASS} dangerouslySetInnerHTML={{ __html: renderLineNumberedCodeBlock(code, language) }} />;
        }

        if (/^(?:---+|\*\*\*+)$/.test(trimmedBlock)) {
          return <hr key={`hr-${blockIndex}`} className="border-0 border-t border-border" />;
        }

        if (block.startsWith("# ")) {
          return <h1 key={`h1-${blockIndex}`} className={cx(CONTENT_PREVIEW_H1_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H1_TOP_PADDING)}>{renderInlineMarkdown(block.replace(/^#\s+/, ""))}</h1>;
        }

        if (block.startsWith("## ")) {
          return <h2 key={`h2-${blockIndex}`} className={cx(CONTENT_PREVIEW_H2_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H2_TOP_PADDING)}>{renderInlineMarkdown(block.replace(/^##\s+/, ""))}</h2>;
        }

        if (block.startsWith("### ")) {
          return <h3 key={`h3-${blockIndex}`} className={cx(CONTENT_PREVIEW_H3_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H3_TOP_PADDING)}>{renderInlineMarkdown(block.replace(/^###\s+/, ""))}</h3>;
        }

        if (lines.every((line) => /^>\s?/.test(line))) {
          const quoteLines = lines.flatMap((line) => splitLegacyQuotedListLine(line.replace(/^>\s?/, "")));

          if (
            quoteLines.every((line) => /^\d+\.\s+/.test(line))
          ) {
            return <blockquote key={`blockquote-ol-${blockIndex}`} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}><ol className={CONTENT_PREVIEW_OL_CLASS}>{quoteLines.map((line, lineIndex) => <li key={`blockquote-ol-item-${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol></blockquote>;
          }

          if (
            quoteLines.every((line) => /^\s*[-*]\s+/.test(line))
          ) {
            return <blockquote key={`blockquote-ul-${blockIndex}`} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}><ul className={CONTENT_PREVIEW_UL_CLASS}>{quoteLines.map((line, lineIndex) => <li key={`blockquote-ul-item-${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul></blockquote>;
          }

          return <blockquote key={`blockquote-${blockIndex}`} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}>{quoteLines.map((line, lineIndex) => <p key={`blockquote-line-${blockIndex}-${lineIndex}`} className="m-0">{renderInlineMarkdown(line)}</p>)}</blockquote>;
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return <ol key={`ol-${blockIndex}`} className={CONTENT_PREVIEW_OL_CLASS}>{lines.map((line, lineIndex) => <li key={`ol-item-${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
        }

        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return <ul key={`ul-${blockIndex}`} className={CONTENT_PREVIEW_UL_CLASS}>{lines.map((line, lineIndex) => <li key={`ul-item-${blockIndex}-${lineIndex}`} className="type-content-body text-fg">{renderInlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
        }

        const table = parseMarkdownTable(lines);
        if (table) {
          const { bodyRows, headerRow } = table;

          return (
            <div key={`table-${blockIndex}`} className={CONTENT_PREVIEW_TABLE_WRAPPER_CLASS}>
              <table className={CONTENT_PREVIEW_TABLE_CLASS}>
                <thead>
                  <tr className={CONTENT_PREVIEW_TABLE_ROW_CLASS}>
                    {headerRow.map((cell, cellIndex) => (
                      <th key={`table-header-${blockIndex}-${cellIndex}`} className={CONTENT_PREVIEW_TABLE_HEADER_CELL_CLASS}>
                        {renderInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIndex) => (
                    <tr key={`table-row-${blockIndex}-${rowIndex}`} className={CONTENT_PREVIEW_TABLE_ROW_CLASS}>
                      {row.map((cell, cellIndex) => (
                        <td key={`table-cell-${blockIndex}-${rowIndex}-${cellIndex}`} className={CONTENT_PREVIEW_TABLE_CELL_CLASS}>
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return <p key={`p-${blockIndex}`} className={CONTENT_PREVIEW_BODY_CLASS}>{lines.map((line, lineIndex) => <span key={`paragraph-line-${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(line)}{lineIndex < lines.length - 1 ? <br /> : null}</span>)}</p>;
      })}
    </div>
  );
}

function RichHtmlContent({ html }: { html: string }) {
  return (
    <div
      className={CONTENT_PREVIEW_RICH_CLASS}
      dangerouslySetInnerHTML={{ __html: normalizeContentHtml(html) }}
    />
  );
}

type ContentBodyPreviewProps = {
  bodyHtml?: string;
  bodyMarkdown: string;
  contentFormat?: "markdown" | "tiptap";
};

export default function ContentBodyPreview({
  bodyHtml = "",
  bodyMarkdown,
  contentFormat = "markdown",
}: ContentBodyPreviewProps) {
  return contentFormat === "tiptap" && bodyHtml.trim()
    ? <RichHtmlContent html={bodyHtml} />
    : <MarkdownContent markdown={bodyMarkdown} />;
}
