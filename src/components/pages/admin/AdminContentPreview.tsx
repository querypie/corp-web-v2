import ContentBodyPreview from "../../common/ContentBodyPreview";
import Button from "../../common/Button";
import { NewsListCard } from "../news/NewsListPage";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type AdminContentPreviewProps = {
  bodyHtml?: string;
  date: string;
  downloadHref?: string;
  downloadLabel?: string;
  hideHeroImage?: boolean;
  heroImageAlt: string;
  heroImageSrc: string;
  section: "demo" | "documentation" | "news";
  summary?: string;
  title: string;
  url?: string;
  writer?: string;
};

export default function AdminContentPreview({
  bodyHtml = "",
  date,
  downloadHref,
  downloadLabel = "Download Now",
  hideHeroImage = false,
  heroImageAlt,
  heroImageSrc,
  section,
  summary = "",
  title,
  url = "#",
  writer = "",
}: AdminContentPreviewProps) {
  const resolvedHeroImageSrc = heroImageSrc.trim();

  if (section === "news") {
    return (
      <div className="mx-auto w-full max-w-[680px] py-5">
        <NewsListCard
          date={date}
          href={url}
          imageSrc={resolvedHeroImageSrc}
          summary={summary}
          title={title}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-[80px] py-5">
      <div className="flex flex-col gap-[10px]">
        <h1 className="m-0 type-h1 leading-[42px] text-fg">{title}</h1>
        {writer ? <div className="type-body-md text-fg">{writer}</div> : null}
        {date ? <p className="m-0 type-body-md text-mute-fg">{date}</p> : null}
      </div>
      {resolvedHeroImageSrc && !hideHeroImage ? (
        <div className={cx("flex flex-col gap-[40px]", downloadHref && "mb-[-40px]")}>
          <div className="w-full overflow-hidden rounded-box bg-bg-content">
            <img alt={heroImageAlt} className="block h-auto w-full" src={resolvedHeroImageSrc} />
          </div>
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
      <ContentBodyPreview bodyHtml={bodyHtml} />
    </div>
  );
}
