import Cta from "../../sections/Cta";
import ClientSection from "../../sections/ClientSection";
import ContentListSection from "../../sections/ContentListSection";
import FeatureSection from "../../sections/FeatureSection";
import Hero from "../../sections/Hero";
import McpSection from "../../sections/McpSection";
import NewsListSection from "../../sections/NewsListSection";
import ReviewSection from "../../sections/ReviewSection";
import type { Locale } from "../../../constants/i18n";

type FooterSection = {
  items: string[];
  title: string;
};

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
  imageSrc: string;
  title: string;
};

type ContentListItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

export type HomePageProps = {
  clientCaption: string;
  contentListDescription: string;
  contentListItems: ContentListItem[];
  contentListLinks: string[];
  contentListTitle: string;
  ctaDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
  featureItems: FeatureItem[];
  heroHeadingMuted: string;
  heroHeadingPrimary: string;
  locale: Locale;
  heroPromptRotatingTexts: string[];
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
  ctaDescription,
  ctaEyebrow,
  ctaTitle,
  featureItems,
  heroHeadingMuted,
  heroHeadingPrimary,
  locale,
  heroPromptRotatingTexts,
  mcpDescription,
  mcpItems,
  mcpTitle,
  newsItems,
  newsTitle,
  reviewItems,
  reviewTitle,
}: HomePageProps) {
  return (
    <div className="flex flex-col gap-20 overflow-x-hidden px-5 pb-10 text-fg md:gap-[120px] md:px-10">
        <div className="-mx-5 md:-mx-10">
          <Hero
            headingMuted={heroHeadingMuted}
            headingPrimary={heroHeadingPrimary}
            locale={locale}
            promptRotatingTexts={heroPromptRotatingTexts}
          />
        </div>
        {/* 고객사 로고 영역 */}
        <div data-reveal><ClientSection caption={clientCaption} /></div>
        {/* 기능 소개 섹션 */}
        <div data-reveal><FeatureSection items={featureItems} /></div>
        {/* MCP 호환/지원 섹션 */}
        <div data-reveal>
          <McpSection
            description={mcpDescription}
            items={mcpItems}
            title={mcpTitle}
          />
        </div>
        {/* 사용자 후기 카드 */}
        <div data-reveal><ReviewSection items={reviewItems} title={reviewTitle} /></div>
        {/* 가이드/콘텐츠 리스트 섹션 */}
        <div data-reveal className="-mx-5 md:-mx-10">
          <ContentListSection
            description={contentListDescription}
            items={contentListItems}
            links={contentListLinks}
            title={contentListTitle}
          />
        </div>
        {/* 뉴스 리스트 */}
        <div data-reveal><NewsListSection items={newsItems} title={newsTitle} /></div>
        {/* 하단 CTA */}
        <div data-reveal>
          <Cta
            actionLabel="Get Start!"
            description={ctaDescription}
            eyebrow={ctaEyebrow}
            title={ctaTitle}
          />
        </div>
    </div>
  );
}
