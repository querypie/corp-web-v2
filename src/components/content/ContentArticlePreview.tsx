import type { ReactNode } from "react";
import type { Locale } from "@/constants/i18n";
import ContentBodyPreview from "./ContentBodyPreview";
import ContentPdfActionButton from "./ContentPdfActionButton";
import ContentPreviewImage from "./ContentPreviewImage";

type ContentArticlePreviewProps = {
  bodyHtml?: string;
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
  locale: Locale;
  title: string;
  unlockCookieName?: string;
  writer: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ContentArticlePreview({
  bodyHtml = "",
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
  locale,
  title,
  unlockCookieName,
  writer,
}: ContentArticlePreviewProps) {
  const resolvedHeroImageSrc = heroImageSrc.trim();
  const shouldRenderHero = Boolean(resolvedHeroImageSrc) && !hideHeroImage;

  return (
    <div className="flex flex-col gap-[80px]">
      <div className="flex flex-col gap-[10px]">
        <h1 className="m-0 type-h1 leading-[42px] text-fg">{title}</h1>
        {writer ? <div className="type-body-md text-fg">{writer}</div> : null}
        {date ? <p className="m-0 type-body-md text-mute">{date}</p> : null}
      </div>

      {shouldRenderHero ? (
        <div className={cx("flex flex-col gap-[40px]", downloadHref && "mb-[-40px]")}>
          <ContentPreviewImage
            alt={heroImageAlt}
            className="block h-auto w-full"
            containerClassName="w-full overflow-hidden rounded-box bg-bg-content"
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
        <ContentBodyPreview bodyHtml={bodyHtml} />
        {contentOverlay}
      </div>
    </div>
  );
}
