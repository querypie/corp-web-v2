import { pageXPaddingClassName } from "@/constants/layout";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/constants/i18n";
import ContentArticlePreview from "@/components/content/ContentArticlePreview";
import DetailContentList from "@/components/sections/DetailContentList";
import ContentShareActions from "./ContentShareActions";
import { getLockedPdfButtonLabel, getPdfWhitePaperButtonLabel } from "@/features/content/data";

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
  downloadLockedLabel?: string;
  downloadRequiresLeadCapture?: boolean;
  downloadRequiresUnlock?: boolean;
  downloadUnlockForm?: (props: { onDirtyChange: (isDirty: boolean) => void; onSuccess: () => void }) => ReactNode;
  docsHref: string;
  hideHeroImage?: boolean;
  heroImageAlt: string;
  heroImageSrc: string;
  locale: Locale;
  parentLabel?: string;
  shareUrl?: string;
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
  downloadLockedLabel,
  downloadRequiresLeadCapture = false,
  downloadRequiresUnlock = false,
  downloadUnlockForm,
  docsHref,
  hideHeroImage = false,
  heroImageAlt,
  heroImageSrc,
  locale,
  parentLabel = "Documentation",
  shareUrl,
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
              downloadLockedLabel={downloadLockedLabel ?? getLockedPdfButtonLabel(locale)}
              downloadRequiresLeadCapture={downloadRequiresLeadCapture}
              downloadRequiresUnlock={downloadRequiresUnlock}
              downloadUnlockForm={downloadUnlockForm}
              heroImageAlt={heroImageAlt}
              heroImageSrc={heroImageSrc}
              hideHeroImage={hideHeroImage}
              locale={locale}
              title={title}
              unlockCookieName={unlockCookieName}
              writer={writer}
            />

            <ContentShareActions locale={locale} shareUrl={shareUrl} title={title} />

            <DetailContentList className="pt-2" items={contentListItems} />
          </div>
        </div>
      </article>
    </div>
  );
}
