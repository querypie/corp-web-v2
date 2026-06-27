import ContentArticlePreview from "@/components/content/ContentArticlePreview";
import { DemoListCard } from "@/components/pages/demo/DemoListPage";
import { DocsListCard } from "@/components/pages/documentation/DocumentationListPage";
import { NewsListCard } from "@/components/pages/news/NewsListPage";
import type { ContentGatingLevel } from "@/features/content/data";
import { buildContentPreviewHtml, isContentGatingEnabled } from "@/features/content/gating";

type AdminContentPreviewProps = {
  bodyHtml?: string;
  category: string;
  contentType: "content" | "outlink";
  date: string;
  downloadHref?: string;
  downloadLabel?: string;
  gatingLevel?: ContentGatingLevel;
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
  category,
  contentType,
  date,
  downloadHref,
  downloadLabel = "Download Now",
  gatingLevel = "none",
  hideHeroImage = false,
  heroImageAlt,
  heroImageSrc,
  section,
  summary = "",
  title,
  url = "#",
  writer = "",
}: AdminContentPreviewProps) {
  const isGateActive = isContentGatingEnabled({ contentType, gatingLevel, section });
  const visibleBodyHtml = isGateActive
    ? buildContentPreviewHtml(bodyHtml, gatingLevel)
    : bodyHtml;

  if (contentType === "outlink" && section === "demo") {
    return (
      <div className="mx-auto w-full max-w-[380px] py-5">
        <DemoListCard
          category={category}
          date={date}
          description={summary}
          href={url}
          imageSrc={heroImageSrc}
          isExternal
          showCategory
          title={title}
        />
      </div>
    );
  }

  if (contentType === "outlink" && section === "documentation") {
    return (
      <div className="mx-auto w-full max-w-[380px] py-5">
        <DocsListCard
          category={category}
          date={date}
          description={summary}
          href={url}
          imageSrc={heroImageSrc}
          isExternal
          showCategory
          title={title}
        />
      </div>
    );
  }

  if (contentType === "outlink" || (section === "news" && !bodyHtml.trim())) {
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
        bodyHtml={visibleBodyHtml}
        contentOverlay={isGateActive ? <AdminGatePreviewOverlay /> : undefined}
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

function AdminGatePreviewOverlay() {
  return (
    <div className="relative z-10 mt-[-160px]">
      <div className="h-[180px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,var(--color-bg)_78%)]" />
      <div className="w-full bg-bg pb-8 pt-6">
        <div className="mx-auto flex h-[220px] w-full max-w-[400px] items-center justify-center rounded-box border border-border bg-bg-content px-5 text-center type-body-md text-mute">
          Gating form
        </div>
      </div>
    </div>
  );
}
