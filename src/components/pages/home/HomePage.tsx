import Cta from "../../sections/Cta";
import ClientSection from "../../sections/ClientSection";
import ContentListSection from "../../sections/ContentListSection";
import FeatureSection from "../../sections/FeatureSection";
import HomeNewsListClientSection from "../../sections/HomeNewsListClientSection";
import McpSection from "../../sections/McpSection";
import ReviewSection from "../../sections/ReviewSection";
import HomePageHero from "./HomePageHero";
import type { Locale } from "../../../constants/i18n";

type FeatureItem = {
  body: string[];
  imageAlt: string;
  imageSrc: string;
  reverse?: boolean;
  title: string[];
};

type McpItem = {
  icon: React.ReactNode;
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

type ContentListItem = {
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
  contentListItems: ContentListItem[];
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
  mcpDescription: string[];
  mcpItems: McpItem[];
  mcpTitle: string;
  newsItems: NewsItem[];
  newsTitle: string;
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
  mcpDescription,
  mcpItems,
  mcpTitle,
  newsItems,
  newsTitle,
  reviewItems,
  reviewTitle,
}: HomePageProps) {
  return (
    <div className="mt-5 flex flex-col gap-20 overflow-x-hidden bg-bg px-5 pb-10 text-fg md:mt-0 md:gap-[160px] md:px-10">
      <div className="relative -mx-5 md:-mx-10">
        <HomePageHero
          ctaLabel={heroPrimaryCtaLabel}
          description={heroDescription}
          heroHeading={heroHeading}
          imageAlt={heroImageAlt}
          locale={locale}
        />
      </div>

      <div><ClientSection caption={clientCaption} /></div>
      <div><FeatureSection items={featureItems} /></div>
      <div>
        <McpSection
          description={mcpDescription}
          items={mcpItems}
          title={mcpTitle}
        />
      </div>
      <div><ReviewSection items={reviewItems} title={reviewTitle} /></div>
      <div className="-mx-5 md:-mx-10">
        <ContentListSection
          description={contentListDescription}
          items={contentListItems}
          links={contentListLinks}
          title={contentListTitle}
        />
      </div>
      <div>
        <HomeNewsListClientSection fallbackItems={newsItems} locale={locale} title={newsTitle} />
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
