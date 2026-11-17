import { pageXPaddingClassName } from "@/constants/layout";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/constants/i18n";
import ContentArticlePreview from "@/components/content/ContentArticlePreview";
import DetailContentList from "@/components/sections/DetailContentList";
import ContentShareActions from "./ContentShareActions";
import { getAcpLabNotesCopy } from "@/copy/acpLabNotes";
import type { LabNote } from "@/features/content/acpLabNotes";
import { getLockedPdfButtonLabel, getPdfWhitePaperButtonLabel } from "@/features/content/data";

export type DocsDetailPageProps = {
  labNote?: LabNote;
  authorProfileImageSrc?: string;
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
  introduction?: string;
  locale: Locale;
  parentLabel?: string;
  shareUrl?: string;
  showSidebarNav?: boolean;
  slug: string;
  title: string;
  unlockCookieName?: string;
  writer: string;
  writerRole?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function DocsDetailPage({
  labNote,
  authorProfileImageSrc,
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
  introduction,
  locale,
  parentLabel = "Resources",
  shareUrl,
  showSidebarNav = true,
  title,
  unlockCookieName,
  writer,
  writerRole,
}: DocsDetailPageProps) {
  const labCopy = getAcpLabNotesCopy(locale);
  return (
    <div className={`flex w-full justify-center ${pageXPaddingClassName} pb-10`}>
      <article className="flex w-full max-w-[1200px] flex-col gap-[120px]">
        <div
          className={cx(
            "flex w-full flex-col items-center gap-6",
            showSidebarNav
              ? "xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,680px)_minmax(0,1fr)] xl:items-start xl:gap-x-5 xl:gap-y-0"
              : "",
          )}
        >
          {showSidebarNav ? (
            <div className="flex w-full max-w-[680px] items-start gap-[6px] type-body-md leading-5 xl:sticky xl:top-[80px] xl:max-w-none xl:justify-self-start xl:self-start">
              {parentLabel ? (
                <>
                  <Link className="shrink-0 text-mute transition-colors duration-200 hover:text-fg focus-visible:text-fg" href={docsHref}>
                    {parentLabel}
                  </Link>
                  <p className="m-0 shrink-0 text-mute">/</p>
                </>
              ) : null}
              <p className="m-0 text-fg">{category}</p>
            </div>
          ) : null}

          <div
            className={cx(
              "flex min-w-0 w-full max-w-[680px] flex-col gap-14 md:gap-20",
              showSidebarNav && "xl:justify-self-center",
            )}
          >
            <ContentArticlePreview
              authorProfileImageSrc={authorProfileImageSrc}
              bodyHtml={bodyHtml}
              bodyFooter={labNote ? (
                <p className="mb-0 mt-10 type-content-body text-fg">
                  {labCopy.resourcesLabel}{" "}
                  <a className="text-brand" href={labCopy.tryHref} rel="noopener noreferrer" target="_blank">
                    {labCopy.tryLabel}
                  </a>
                  {" · "}
                  <a className="text-brand" href={labCopy.docsHref} rel="noopener noreferrer" target="_blank">
                    {labCopy.docsLabel}
                  </a>
                </p>
              ) : undefined}
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
              introduction={introduction}
              locale={locale}
              title={title}
              unlockCookieName={unlockCookieName}
              writer={writer}
              writerRole={writerRole}
            />

            <ContentShareActions locale={locale} shareUrl={shareUrl} title={title} />

            <DetailContentList className="pt-2" items={contentListItems} />
          </div>
        </div>
      </article>
    </div>
  );
}
