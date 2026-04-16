import type { ReactNode } from "react";
import ContentArticlePreview from "../../common/ContentArticlePreview";
import DocumentationContentListSection from "../../sections/DocumentationContentListSection";
import { CONTENT_DOWNLOAD_BUTTON_LABEL } from "@/features/content/data";

export type DocsDetailPageProps = {
  bodyHtml?: string;
  category: string;
  contentOverlay?: ReactNode;
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
  downloadHref?: string;
  downloadLabel?: string;
  docsHref: string;
  hideHeroImage?: boolean;
  heroImageAlt: string;
  heroImageSrc: string;
  parentLabel?: string;
  shareLinks?: Array<{ href: string; iconSrc: string; label: string }>;
  showSidebarNav?: boolean;
  slug: string;
  title: string;
  writer: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function DocsDetailPage({
  bodyHtml = "",
  category,
  contentOverlay,
  contentListItems,
  date,
  downloadHref,
  downloadLabel = CONTENT_DOWNLOAD_BUTTON_LABEL,
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
  showSidebarNav = true,
  title,
  writer,
}: DocsDetailPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <article className="flex w-full max-w-[1200px] flex-col gap-[120px]">
        <div
          className={cx(
            "flex w-full flex-col gap-6",
            showSidebarNav
              ? "md:grid md:grid-cols-[1fr_minmax(0,680px)_1fr] md:gap-x-5 md:gap-y-0"
              : "items-center",
          )}
        >
          {showSidebarNav ? (
            <div className="flex items-start gap-[6px] type-body-md leading-5 md:sticky md:top-[80px] md:justify-self-start md:self-start">
              <p className="m-0 text-fg">{parentLabel}</p>
              <p className="m-0 text-mute-fg">/</p>
              <a className="text-mute-fg transition-colors duration-200 hover:text-fg" href={docsHref}>
                {category}
              </a>
            </div>
          ) : null}

          <div
            className={cx(
              "flex w-full max-w-[680px] flex-col gap-14 md:gap-20",
              showSidebarNav && "md:justify-self-center",
            )}
          >
            <ContentArticlePreview
              bodyHtml={bodyHtml}
              contentOverlay={contentOverlay}
              date={date}
              downloadHref={downloadHref}
              downloadLabel={downloadLabel}
              heroImageAlt={heroImageAlt}
              heroImageSrc={heroImageSrc}
              hideHeroImage={hideHeroImage}
              title={title}
              writer={writer}
            />

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

            <DocumentationContentListSection className="pt-2" items={contentListItems} />
          </div>
        </div>
      </article>
    </div>
  );
}
