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

function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n{2,}/).filter(Boolean);

  return (
    /* 마크다운 본문을 제목/문단/리스트로 가볍게 렌더링 */
    <div className="flex flex-col gap-5 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");

        if (block.startsWith("# ")) {
          return (
            <h1
              key={`h1-${blockIndex}`}
              className={cx(
                "m-0 type-h1 leading-[42px] text-fg",
                blockIndex > 0 && "pt-10",
              )}
            >
              {block.replace(/^#\s+/, "")}
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
              {block.replace(/^##\s+/, "")}
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
              {block.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={`ol-${blockIndex}`} className="m-0 flex list-decimal flex-col gap-0 pl-6 type-body-lg text-fg">
              {lines.map((line, lineIndex) => (
                <li key={`ol-item-${blockIndex}-${lineIndex}`}>
                  {line.replace(/^\d+\.\s+/, "")}
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
                  {line.replace(/^-\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`p-${blockIndex}`} className="m-0 type-body-lg whitespace-pre-wrap text-fg">
            {block}
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
