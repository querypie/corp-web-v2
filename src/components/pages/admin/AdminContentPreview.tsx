import ContentArticlePreview from "../../common/ContentArticlePreview";
import { NewsListCard } from "../news/NewsListPage";

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
  if (section === "news") {
    return (
      <div className="mx-auto w-full max-w-[680px] py-5">
        <NewsListCard
          date={date}
          href={url}
          imageSrc={heroImageSrc}
          summary={summary}
          title={title}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[680px] py-5">
      <ContentArticlePreview
        bodyHtml={bodyHtml}
        date={date}
        downloadHref={downloadHref}
        downloadLabel={downloadLabel}
        heroImageAlt={heroImageAlt}
        heroImageSrc={heroImageSrc}
        hideHeroImage={hideHeroImage}
        title={title}
        writer={writer}
      />
    </div>
  );
}
