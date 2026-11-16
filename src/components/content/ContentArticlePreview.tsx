import type { ReactNode } from "react";
import type { Locale } from "@/constants/i18n";
import ContentBodyPreview from "./ContentBodyPreview";
import ContentPdfActionButton from "./ContentPdfActionButton";
import ContentPreviewImage from "./ContentPreviewImage";

type ContentArticlePreviewProps = {
  bodyHtml?: string;
  bodyFooter?: ReactNode;
  authorProfileImageSrc?: string;
  contentOverlay?: ReactNode;
  date: string;
  downloadFormTargetId?: string;
  downloadHref?: string;
  downloadLabel: string;
  downloadLockedLabel?: string;
  downloadRequiresLeadCapture?: boolean;
  downloadRequiresUnlock?: boolean;
  downloadUnlockForm?: (props: { onDirtyChange: (isDirty: boolean) => void; onSuccess: () => void }) => ReactNode;
  heroImageAlt: string;
  heroImageSrc: string;
  hideHeroImage?: boolean;
  introduction?: string;
  locale: Locale;
  title: string;
  unlockCookieName?: string;
  writer: string;
  writerRole?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ContentArticlePreview({
  bodyHtml = "",
  bodyFooter,
  authorProfileImageSrc,
  contentOverlay,
  date,
  downloadFormTargetId,
  downloadHref,
  downloadLabel,
  downloadLockedLabel,
  downloadRequiresLeadCapture = false,
  downloadRequiresUnlock = false,
  downloadUnlockForm,
  heroImageAlt,
  heroImageSrc,
  hideHeroImage = false,
  introduction,
  locale,
  title,
  unlockCookieName,
  writer,
  writerRole,
}: ContentArticlePreviewProps) {
  const resolvedHeroImageSrc = heroImageSrc.trim();
  const shouldRenderHero = Boolean(resolvedHeroImageSrc) && !hideHeroImage;

  return (
    <div className="flex flex-col gap-[40px] md:gap-[60px]">
      <div className="flex flex-col gap-[10px]">
        <h1 className={cx("m-0 type-h1 leading-[42px] text-fg", (writer || introduction || date) && "mb-2")}>{title}</h1>
        {writer || introduction ? (
          <div className="flex items-start gap-4">
            {authorProfileImageSrc ? (
              <img alt={writer} className="mt-1.5 h-11 w-11 shrink-0 rounded-full object-cover" decoding="async" height="44" loading="lazy" src={authorProfileImageSrc} width="44" />
            ) : null}
            <div className="flex min-w-0 flex-col gap-1">
              {writer ? <div className="type-body-md text-fg">{writer}{writerRole ? ` / ${writerRole}` : ""}</div> : null}
              {introduction ? <p className="m-0 type-body-sm text-mute">{introduction}</p> : null}
            </div>
          </div>
        ) : null}
        {date ? <p className="m-0 type-body-md text-mute">{date}</p> : null}
      </div>

      {shouldRenderHero ? (
        <div className={cx("flex flex-col gap-[40px]", downloadHref && "mb-[-40px]")}>
          <ContentPreviewImage
            alt={heroImageAlt}
            className="block h-full w-full object-cover"
            containerClassName="content-thumbnail-frame w-full overflow-hidden rounded-box bg-bg-content"
            src={resolvedHeroImageSrc}
          />
          {downloadHref ? (
            <div className="flex">
              <ContentPdfActionButton
                className="w-full justify-center"
                formTargetId={downloadFormTargetId}
                href={downloadHref}
                label={downloadLabel}
                lockedLabel={downloadLockedLabel}
                locale={locale}
                renderUnlockForm={downloadUnlockForm}
                requiresLeadCapture={downloadRequiresLeadCapture}
                requiresUnlock={downloadRequiresUnlock}
                unlockCookieName={unlockCookieName}
              />
            </div>
          ) : null}
        </div>
      ) : downloadHref ? (
        <div className="mb-[-40px] flex">
          <ContentPdfActionButton
            className="w-full justify-center"
            formTargetId={downloadFormTargetId}
            href={downloadHref}
            label={downloadLabel}
            lockedLabel={downloadLockedLabel}
            locale={locale}
            renderUnlockForm={downloadUnlockForm}
            requiresLeadCapture={downloadRequiresLeadCapture}
            requiresUnlock={downloadRequiresUnlock}
            unlockCookieName={unlockCookieName}
          />
        </div>
      ) : null}

      <div>
        <ContentBodyPreview bodyHtml={bodyHtml} locale={locale} />
        {bodyFooter}
        {contentOverlay}
      </div>
    </div>
  );
}
