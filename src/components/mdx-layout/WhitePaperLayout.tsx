import type { ReactNode } from "react";
import type { Locale } from "@/constants/i18n";
import type { MdxFrontmatter, MdxHeading } from "@/features/mdx/types";
import { CONTENT_PREVIEW_RICH_CLASS } from "@/features/content/previewStyles";
import { formatResolvedAuthorNames, getDisplayableArticleAuthors, resolveArticleAuthors } from "@/features/mdx/authors";
import AuthorBox from "./AuthorBox";
import ArticleToc from "./ArticleToc";

type Props = {
  children: ReactNode;
  frontmatter: MdxFrontmatter;
  headings: MdxHeading[];
  locale: Locale;
};

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export default function WhitePaperLayout({ children, frontmatter, headings, locale }: Props) {
  const heroImageSrc = frontmatter.ogImage
    ? frontmatter.ogImage.replace(/^public\//, "/")
    : "";
  const showHero = Boolean(heroImageSrc) && !frontmatter.hideHeroImage;
  const showToc = !frontmatter.hideTableOfContents && headings.length > 0;
  const authors = resolveArticleAuthors(frontmatter.author, locale);
  const author = formatResolvedAuthorNames(authors);
  const displayableAuthors = getDisplayableArticleAuthors(authors);
  const showAuthorBox = displayableAuthors.length > 0;

  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <article className="flex w-full max-w-[1200px] flex-col gap-[120px]">
        <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-[1fr_minmax(0,680px)_1fr] md:gap-x-5 md:gap-y-0">
          {/* 왼쪽 여백 */}
          <div />

          {/* 본문 영역 */}
          <div className="flex w-full max-w-[680px] flex-col gap-14 md:justify-self-center md:gap-20">
            {/* 헤더: 제목·저자·날짜 */}
            <div className="flex flex-col gap-[10px]">
              <h1 className="m-0 type-h1 leading-[42px] text-fg">{frontmatter.title}</h1>
              {showAuthorBox ? (
                <AuthorBox authors={displayableAuthors} locale={locale} />
              ) : author ? (
                <div className="type-body-md text-fg">{author}</div>
              ) : null}
              {frontmatter.date && (
                <p className="m-0 type-body-md text-mute-fg">
                  {formatDate(frontmatter.date, locale)}
                </p>
              )}
            </div>

            {/* 히어로 이미지 */}
            {showHero && (
              <div className="w-full overflow-hidden rounded-box bg-bg-content">
                <img
                  src={heroImageSrc}
                  alt={frontmatter.title}
                  className="block h-auto w-full"
                />
              </div>
            )}

            {/* MDX 본문 */}
            <div className={CONTENT_PREVIEW_RICH_CLASS}>{children}</div>
          </div>

          {/* 오른쪽 사이드바: TOC */}
          {showToc && (
            <div className="hidden md:block">
              <div className="sticky top-[160px]">
                <ArticleToc headings={headings} locale={locale} />
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
