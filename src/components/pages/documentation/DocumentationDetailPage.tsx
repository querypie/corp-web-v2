import { pageXPaddingClassName } from "@/constants/layout";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/constants/i18n";
import ContentArticlePreview from "@/components/content/ContentArticlePreview";
import DetailContentList from "@/components/sections/DetailContentList";
import { getPdfWhitePaperButtonLabel } from "@/features/content/data";

export type DocsDetailPageProps = {
  bodyHtml?: string;
  category: string;
  contentOverlay?: ReactNode;
  contentListDescription: string;
  contentListItems: Array<{
    category: string;
    href: string;
    imageSrc: string;
    isExternal?: boolean;
    title: string;
  }>;
  contentListLinks: string[];
  contentListTitle: string;
  date: string;
  downloadFormTargetId?: string;
  downloadHref?: string;
  downloadLabel?: string;
  downloadRequiresUnlock?: boolean;
  docsHref: string;
  hideHeroImage?: boolean;
  heroImageAlt: string;
  heroImageSrc: string;
  locale: Locale;
  parentLabel?: string;
  shareLinks?: Array<{ href: string; iconSrc: string; label: string }>;
  showSidebarNav?: boolean;
  slug: string;
  title: string;
  unlockCookieName?: string;
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
  downloadFormTargetId,
  downloadHref,
  downloadLabel,
  downloadRequiresUnlock = false,
  docsHref,
  hideHeroImage = false,
  heroImageAlt,
  heroImageSrc,
  locale,
  parentLabel = "Documentation",
  shareLinks = [
    { href: "/", iconSrc: "/assets/brand/icons/linkedin.svg", label: "LinkedIn" },
    { href: "/", iconSrc: "/assets/brand/icons/x.svg", label: "X" },
    { href: "/", iconSrc: "/assets/ui/icons/URL.svg", label: "Copy URL" },
  ],
  showSidebarNav = true,
  title,
  unlockCookieName,
  writer,
}: DocsDetailPageProps) {
  return (
    <div className={`flex w-full justify-center ${pageXPaddingClassName} pb-10`}>
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
              {parentLabel ? (
                <>
                  <p className="m-0 text-mute">{parentLabel}</p>
                  <p className="m-0 text-mute">/</p>
                </>
              ) : null}
              <Link className="text-fg transition-colors duration-200 hover:text-mute" href={docsHref}>
                {category}
              </Link>
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
              downloadFormTargetId={downloadFormTargetId}
              downloadHref={downloadHref}
              downloadLabel={downloadLabel ?? getPdfWhitePaperButtonLabel(locale)}
              downloadRequiresUnlock={downloadRequiresUnlock}
              heroImageAlt={heroImageAlt}
              heroImageSrc={heroImageSrc}
              hideHeroImage={hideHeroImage}
              locale={locale}
              title={title}
              unlockCookieName={unlockCookieName}
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

            <DetailContentList className="pt-2" items={contentListItems} />
          </div>
        </div>
      </article>
    </div>
  );
}
