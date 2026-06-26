import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/common/Cta";
import HomeClient from "@/components/sections/HomeClient";
import HomeFeaturedContent from "@/components/sections/HomeFeaturedContent";
import FeatureMediaList from "@/components/sections/common/FeatureMediaList";
import HomeMcp from "@/components/sections/HomeMcp";
import HomeNews from "@/components/sections/HomeNews";
import HomeReview from "@/components/sections/HomeReview";
import HomePageHero from "./HomePageHero";
import HomeNoticePopover, { type HomeNoticeItem } from "./HomeNoticePopover";
import type { Locale } from "@/constants/i18n";

type FeatureItem = {
  action?: {
    href: string;
    isExternal?: boolean;
    label: string;
  };
  body: string[];
  iconSrc?: string;
  imageAlt: string;
  imageSrc: string;
  reverse?: boolean;
  title: string[];
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
  imageSrc: string;
  role: string;
};

type NewsItem = {
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  title: string;
};

type HomeFeaturedContentItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

type ContentListLink = {
  href: string;
  label: string;
};

export type HomePageProps = {
  clientCaption: string;
  contentListDescription: string;
  contentListItems: HomeFeaturedContentItem[];
  contentListLinks: ContentListLink[];
  contentListTitle: string;
  ctaActionLabel: string;
  ctaDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
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
  noticeItems: HomeNoticeItem[];
  reviewItems: ReviewItem[];
  reviewTitle: string;
};

export default function HomePage({
  clientCaption,
  contentListDescription,
  contentListItems,
  contentListLinks,
  contentListTitle,
  ctaActionLabel,
  ctaDescription,
  ctaEyebrow,
  ctaTitle,
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
    <div className={`mt-5 flex flex-col ${pageSectionGapClassName} overflow-x-hidden bg-bg ${pageXPaddingClassName} pb-10 text-fg md:mt-0`}>
      <HomeNoticePopover items={noticeItems} locale={locale} />

      <div className="relative -mx-5 md:-mx-10">
        <HomePageHero
          ctaLabel={heroPrimaryCtaLabel}
          description={heroDescription}
          heroHeading={heroHeading}
          imageAlt={heroImageAlt}
          locale={locale}
        />
      </div>

      <div><HomeClient caption={clientCaption} /></div>
      <div><FeatureMediaList items={featureItems} /></div>
      <div>
        <HomeMcp
          action={mcpAction}
          description={mcpDescription}
          items={mcpItems}
          title={mcpTitle}
        />
      </div>
      <div><HomeReview items={reviewItems} title={reviewTitle} /></div>
      <div className="-mx-5 md:-mx-10">
        <HomeFeaturedContent
          description={contentListDescription}
          items={contentListItems}
          links={contentListLinks}
          title={contentListTitle}
        />
      </div>
      <div>
        <HomeNews items={newsItems} title={newsTitle} />
      </div>
      <div>
        <Cta
          actionLabel={ctaActionLabel}
          description={ctaDescription}
          eyebrow={ctaEyebrow}
          title={ctaTitle}
        />
      </div>
    </div>
  );
}
