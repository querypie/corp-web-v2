import type { ReactNode } from "react";
import Button from "./Button";
import ContentBodyPreview from "./ContentBodyPreview";
import ContentPreviewImage from "./ContentPreviewImage";

type ContentArticlePreviewProps = {
  bodyHtml?: string;
  contentOverlay?: ReactNode;
  date: string;
  downloadHref?: string;
  downloadLabel: string;
  heroImageAlt: string;
  heroImageSrc: string;
  hideHeroImage?: boolean;
  title: string;
  writer: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ContentArticlePreview({
  bodyHtml = "",
  contentOverlay,
  date,
  downloadHref,
  downloadLabel,
  heroImageAlt,
  heroImageSrc,
  hideHeroImage = false,
  title,
  writer,
}: ContentArticlePreviewProps) {
  const resolvedHeroImageSrc = heroImageSrc.trim();
  const shouldRenderHero = Boolean(resolvedHeroImageSrc) && !hideHeroImage;

  return (
    <div className="flex flex-col gap-[80px]">
      <div className="flex flex-col gap-[10px]">
        <h1 className="m-0 type-h1 leading-[42px] text-fg">{title}</h1>
        {writer ? <div className="type-body-md text-fg">{writer}</div> : null}
        {date ? <p className="m-0 type-body-md text-mute-fg">{date}</p> : null}
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
              <a className="w-full" href={downloadHref}>
                <Button arrow={false} className="w-full justify-center" size="large" style="full" variant="secondary">
                  {downloadLabel}
                </Button>
              </a>
            </div>
          ) : null}
        </div>
      ) : downloadHref ? (
        <div className="mb-[-40px] flex">
          <a className="w-full" href={downloadHref}>
            <Button arrow={false} className="w-full justify-center" size="large" style="full" variant="secondary">
              {downloadLabel}
            </Button>
          </a>
        </div>
      ) : null}

      <div className={cx("relative", Boolean(contentOverlay) && "pb-[520px] sm:pb-[560px]")}>
        <ContentBodyPreview bodyHtml={bodyHtml} />
        {contentOverlay}
      </div>
    </div>
  );
}
