export type DocsDetailPageProps = {
  bodyHtml?: string;
  bodyMarkdown: string;
  category: string;
  contentFormat?: "markdown" | "tiptap";
  contentListDescription: string;
  contentListItems: Array<{
    category: string;
    href: string;
    imageSrc: string;
    title: string;
  }>;
  contentListLinks: string[];
  contentListTitle: string;
  date: string;
  docsHref: string;
  hideHeroImage?: boolean;
  heroImageSrc: string;
  heroImageAlt: string;
  parentLabel?: string;
  shareLinks?: Array<{ href: string; iconSrc: string; label: string }>;
  slug: string;
  title: string;
  writer: string;
};

import DocsContentListSection from "../../sections/DocsContentListSection";
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
  CONTENT_PREVIEW_UL_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml, renderLineNumberedCodeBlock } from "@/features/content/codeHighlight";
import { normalizeFencedCodeLines, splitMarkdownBlocks } from "@/features/content/markdownBlocks";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function renderInlineMarkdown(text: string) {
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
    /* 마크다운 본문을 제목/문단/리스트로 가볍게 렌더링 */
    <div className="flex flex-col gap-5 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";
        const trimmedBlock = block.trim();

        const imageMatch = parseMarkdownImage(trimmedBlock);

        if (imageMatch) {
          return (
            <figure key={`image-${blockIndex}`} className="m-0 overflow-hidden rounded-box bg-bg-content">
              <img
                alt={imageMatch.alt}
                className="block h-full w-full object-cover"
                src={imageMatch.src}
              />
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

          return <div key={`pre-${blockIndex}`} className={CONTENT_PREVIEW_CODEBLOCK_CLASS} dangerouslySetInnerHTML={{ __html: renderLineNumberedCodeBlock(codeLines.join("\n"), language) }} />;
        }

        if (/^---+$/.test(block) || /^\*\*\*+$/.test(block)) {
          return <hr key={`hr-${blockIndex}`} className="border-0 border-t border-border" />;
        }

        if (block.startsWith("# ")) {
          return (
            <h1
              key={`h1-${blockIndex}`}
              className={cx(CONTENT_PREVIEW_H1_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H1_TOP_PADDING)}
            >
              {renderInlineMarkdown(block.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2
              key={`h2-${blockIndex}`}
              className={cx(CONTENT_PREVIEW_H2_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H2_TOP_PADDING)}
            >
              {renderInlineMarkdown(block.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h3 key={`h3-${blockIndex}`} className={cx(CONTENT_PREVIEW_H3_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H3_TOP_PADDING)}>
              {renderInlineMarkdown(block.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        if (lines.every((line) => /^>\s?/.test(line))) {
          return (
            <blockquote key={`blockquote-${blockIndex}`} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}>
              {lines.map((line, lineIndex) => (
                <p key={`blockquote-line-${blockIndex}-${lineIndex}`} className="m-0">
                  {renderInlineMarkdown(line.replace(/^>\s?/, ""))}
                </p>
              ))}
            </blockquote>
          );
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={`ol-${blockIndex}`} className={CONTENT_PREVIEW_OL_CLASS}>
              {lines.map((line, lineIndex) => (
                <li key={`ol-item-${blockIndex}-${lineIndex}`}>
                  {renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => /^-\s+/.test(line))) {
          return (
            <ul key={`ul-${blockIndex}`} className={CONTENT_PREVIEW_UL_CLASS}>
              {lines.map((line, lineIndex) => (
                <li key={`ul-item-${blockIndex}-${lineIndex}`}>
                  {renderInlineMarkdown(line.replace(/^-\s+/, ""))}
                </li>
              ))}
            </ul>
          );
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

          return (
            <div key={`table-${blockIndex}`} className="overflow-x-auto rounded-[20px] border border-border bg-bg-content">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    {headerRow.map((cell, cellIndex) => (
                      <th
                        key={`table-header-${blockIndex}-${cellIndex}`}
                        className="px-4 py-3 type-content-body text-fg"
                      >
                        {renderInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIndex) => (
                    <tr
                      key={`table-row-${blockIndex}-${rowIndex}`}
                      className="border-b border-border last:border-b-0"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`table-cell-${blockIndex}-${rowIndex}-${cellIndex}`}
                          className="px-4 py-3 align-top type-content-body text-mute-fg"
                        >
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

        return (
          <p key={`p-${blockIndex}`} className={CONTENT_PREVIEW_BODY_CLASS}>
            {lines.map((line, lineIndex) => (
              <span key={`paragraph-line-${blockIndex}-${lineIndex}`}>
                {renderInlineMarkdown(line)}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
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

export default function DocsDetailPage({
  bodyHtml = "",
  bodyMarkdown,
  category,
  contentFormat = "markdown",
  contentListDescription,
  contentListItems,
  contentListLinks,
  contentListTitle,
  date,
  docsHref,
  hideHeroImage = false,
  heroImageAlt,
  heroImageSrc,
  parentLabel = "Documentation",
  shareLinks = [
    { href: "/", iconSrc: "/icons/linkedin.svg", label: "LinkedIn" },
    { href: "/", iconSrc: "/icons/x.svg", label: "X" },
    { href: "/", iconSrc: "/icons/Facebook.svg", label: "Facebook" },
    { href: "/", iconSrc: "/icons/URL.svg", label: "Copy URL" },
  ],
  title,
  writer,
}: DocsDetailPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <article className="flex w-full max-w-[1200px] flex-col gap-footer-gap">
        {/* 좌측 브레드크럼 + 가운데 본문 컬럼 */}
        <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-[1fr_minmax(0,680px)_1fr] md:gap-x-5 md:gap-y-0">
          <div className="flex items-start gap-[6px] type-body-md leading-5 md:sticky md:top-[80px] md:justify-self-start md:self-start">
            <a
              className="text-mute-fg transition-colors duration-200 hover:text-fg"
              href={docsHref}
            >
              {parentLabel}
            </a>
            <p className="m-0 text-mute-fg">/</p>
            <p className="m-0 text-fg">{category}</p>
          </div>

          {/* 상세 본문 컬럼 */}
          <div className="flex w-full max-w-[680px] flex-col gap-14 md:justify-self-center md:gap-20">
            <div className="flex flex-col gap-[80px]">
              <div className="flex flex-col gap-[10px]">
                <h1 className="m-0 type-h1 leading-[42px] text-fg">{title}</h1>
                {writer ? <div className="type-body-md text-fg">{writer}</div> : null}
                {date ? <p className="m-0 type-body-md text-mute-fg">{date}</p> : null}
              </div>

              {heroImageSrc && !hideHeroImage ? (
                <div className="content-thumbnail-frame w-full overflow-hidden rounded-box bg-bg-content">
                  <img
                    alt={heroImageAlt}
                    className="block h-full w-full object-cover"
                    src={heroImageSrc}
                  />
                </div>
              ) : null}

              {contentFormat === "tiptap" && bodyHtml.trim() ? (
                <RichHtmlContent html={bodyHtml} />
              ) : (
                <MarkdownContent markdown={bodyMarkdown} />
              )}
            </div>

            {/* 공유 아이콘 영역 */}
            <div className="flex w-full justify-end gap-[10px]">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  aria-label={link.label}
                  className="inline-flex h-7 w-7 items-center justify-center opacity-100 transition-opacity hover:opacity-60"
                  href={link.href}
                >
                  <img alt="" aria-hidden="true" className="h-7 w-7 object-contain" src={link.iconSrc} />
                </a>
              ))}
            </div>

            {/* 상세 하단에 고정으로 붙는 콘텐츠 리스트 */}
            <DocsContentListSection className="pt-2" items={contentListItems} />
          </div>
        </div>
      </article>
    </div>
  );
}
