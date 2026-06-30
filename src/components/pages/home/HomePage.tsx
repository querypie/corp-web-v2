import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import Clients from "./Clients";
import FeaturedContent from "./FeaturedContent";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import Mcps from "./Mcps";
import News from "./News";
import Review from "./Review";
import Hero from "./Hero";
import NoticePopover, { type NoticeItem } from "./NoticePopover";
import type { Locale } from "@/constants/i18n";

type FeatureItem = {
  action?: {
    href: string;
    isExternal?: boolean;
    label: string;
  };
  body: string[];
  desktopTitle?: string[];
  iconSrc?: string;
  imageAlt: string;
  imageSrc?: string;
  reverse?: boolean;
  title: string[];
  videoSrc?: string;
};

type McpItem = {
  icon: React.ReactNode;
  label: string;
};

type McpAction = {
  href: string;
  label: string;
};

type ReviewItem = {
  body: string;
  company: string;
  href: string;
  imageSrc: string;
  role: string;
};

type NewsItem = {
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  title: string;
};

type FeaturedContentItem = {
  category: string;
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  title: string;
};

type ContentListLink = {
  href: string;
  label: string;
};

export type HomePageProps = {
  clientCaption: string;
  contentListDescription: string;
  contentListItems: FeaturedContentItem[];
  contentListLinks: ContentListLink[];
  contentListTitle: string;
  featureItems: FeatureItem[];
  heroDescription: string;
  heroHeading: string;
  heroImageAlt: string;
  heroPrimaryCtaLabel: string;
  locale: Locale;
  mcpAction: McpAction;
  mcpDescription: string[];
  mcpItems: McpItem[];
  mcpTitle: string;
  newsItems: NewsItem[];
  newsTitle: string;
  noticeItems: NoticeItem[];
  reviewItems: ReviewItem[];
  reviewTitle: string;
};

export default function HomePage({
  clientCaption,
  contentListDescription,
  contentListItems,
  contentListLinks,
  contentListTitle,
  featureItems,
  heroDescription,
  heroHeading,
  heroImageAlt,
  heroPrimaryCtaLabel,
  locale,
  mcpAction,
  mcpDescription,
  mcpItems,
  mcpTitle,
  newsItems,
  newsTitle,
  noticeItems,
  reviewItems,
  reviewTitle,
}: HomePageProps) {
  return (
    <div className={`flex flex-col ${pageSectionGapClassName} overflow-x-hidden bg-bg ${pageXPaddingClassName} pb-10 text-fg`}>
      <NoticePopover items={noticeItems} locale={locale} />

      <div className="relative -mx-5 md:-mx-10">
        <Hero
          ctaLabel={heroPrimaryCtaLabel}
          description={heroDescription}
          heroHeading={heroHeading}
          imageAlt={heroImageAlt}
          locale={locale}
        />
      </div>

      <div><Clients caption={clientCaption} /></div>
      <div><FeatureMediaList items={featureItems} /></div>
      <div>
        <Mcps
          action={mcpAction}
          description={mcpDescription}
          items={mcpItems}
          title={mcpTitle}
        />
      </div>
      <div><Review items={reviewItems} title={reviewTitle} /></div>
      <div className="-mx-5 md:-mx-10">
        <FeaturedContent
          description={contentListDescription}
          items={contentListItems}
          links={contentListLinks}
          title={contentListTitle}
        />
      </div>
      <div>
        <News items={newsItems} title={newsTitle} />
      </div>
      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
