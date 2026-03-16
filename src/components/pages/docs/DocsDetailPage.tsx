export type DocsDetailPageProps = {
  bodyMarkdown: string;
  category: string;
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
  heroImageSrc: string;
  heroImageAlt: string;
  parentLabel?: string;
  shareLinks?: Array<{ href: string; iconSrc: string; label: string }>;
  slug: string;
  title: string;
  writer: string;
};

import DocsContentListSection from "../../sections/DocsContentListSection";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function renderInlineMarkdown(text: string) {
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (!match) return token;

      return (
        <a
          key={`inline-link-${index}`}
          className="text-fg underline decoration-border underline-offset-4 transition-colors hover:text-mute-fg"
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
          className="rounded-[8px] bg-bg-content px-2 py-1 type-body-lg text-fg"
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

function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = markdown
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    /* 마크다운 본문을 제목/문단/리스트로 가볍게 렌더링 */
    <div className="flex flex-col gap-5 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";

        if (/^```/.test(firstLine) && /^```$/.test(lines[lines.length - 1] ?? "")) {
          const codeLines = lines.slice(1, -1);

          return (
            <pre
              key={`pre-${blockIndex}`}
              className="m-0 overflow-x-auto rounded-[20px] bg-bg-content px-4 py-4 type-body-lg text-fg"
            >
              <code>{codeLines.join("\n")}</code>
            </pre>
          );
        }

        if (/^---+$/.test(block) || /^\*\*\*+$/.test(block)) {
          return <hr key={`hr-${blockIndex}`} className="border-0 border-t border-border" />;
        }

        if (block.startsWith("# ")) {
          return (
            <h1
              key={`h1-${blockIndex}`}
              className={cx(
                "m-0 type-h1 leading-[42px] text-fg",
                blockIndex > 0 && "pt-10",
              )}
            >
              {renderInlineMarkdown(block.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2
              key={`h2-${blockIndex}`}
              className={cx(
                "m-0 type-h2 leading-[30px] text-fg",
                blockIndex > 0 && "pt-10",
              )}
            >
              {renderInlineMarkdown(block.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h3
              key={`h3-${blockIndex}`}
              className={cx(
                "m-0 type-h3 text-fg",
                blockIndex > 0 && "pt-5",
              )}
            >
              {renderInlineMarkdown(block.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        if (lines.every((line) => /^>\s?/.test(line))) {
          return (
            <blockquote
              key={`blockquote-${blockIndex}`}
              className="m-0 border-l-2 border-border pl-4 type-body-lg italic text-fg"
            >
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
            <ol key={`ol-${blockIndex}`} className="m-0 flex list-decimal flex-col gap-0 pl-6 type-body-lg text-fg">
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
            <ul key={`ul-${blockIndex}`} className="m-0 flex list-disc flex-col gap-0 pl-6 type-body-lg text-fg">
              {lines.map((line, lineIndex) => (
                <li key={`ul-item-${blockIndex}-${lineIndex}`}>
                  {renderInlineMarkdown(line.replace(/^-\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`p-${blockIndex}`} className="m-0 type-body-lg whitespace-pre-wrap text-fg">
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

export default function DocsDetailPage({
  bodyMarkdown,
  category,
  contentListDescription,
  contentListItems,
  contentListLinks,
  contentListTitle,
  date,
  docsHref,
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
                <div className="type-body-md text-fg">{writer}</div>
                <p className="m-0 type-body-md text-mute-fg">{date}</p>
              </div>

              <div className="h-[220px] w-full overflow-hidden rounded-box bg-bg-content md:h-[380px]">
                <img
                  alt={heroImageAlt}
                  className="block h-full w-full object-cover"
                  src={heroImageSrc}
                />
              </div>

              <MarkdownContent markdown={bodyMarkdown} />
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
