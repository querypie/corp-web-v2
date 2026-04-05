"use client";

import { useState } from "react";
import Cta from "../../sections/Cta";
import ClientSection from "../../sections/ClientSection";
import ContentListSection from "../../sections/ContentListSection";
import FeatureSection from "../../sections/FeatureSection";
import HomeNewsListClientSection from "../../sections/HomeNewsListClientSection";
import McpSection from "../../sections/McpSection";
import ReviewSection from "../../sections/ReviewSection";
import HomePageHero from "./HomePageHero";
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

const heroVideos = [
  { id: 1, src: "/videos/bg-01.mp4" },
  { id: 2, src: "/videos/bg-02.mp4" },
  { id: 3, src: "/videos/bg-03.mp4" },
  { id: 4, src: "/videos/bg-04.mp4" },
] as const;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

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
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = heroVideos[activeVideoIndex];

  return (
    <div className="-mt-[120px] flex flex-col gap-20 overflow-x-hidden bg-bg px-5 pb-10 text-fg md:-mt-[160px] md:gap-[120px] md:px-10">
      <div className="relative -mx-5 md:-mx-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <video
            key={activeVideo.src}
            aria-hidden="true"
            autoPlay
            className={cx("homeb-hero-video", (activeVideo.id === 2 || activeVideo.id === 3) && "-scale-x-100")}
            loop
            muted
            playsInline
          >
            <source src={activeVideo.src} type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="absolute -left-[320px] -top-[220px] h-[560px] w-[980px] rounded-full opacity-100 blur-[80px]"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.56) 34%, rgba(255,255,255,0.18) 54%, rgba(255,255,255,0) 76%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 -top-[160px] bg-gradient-to-b from-transparent via-[rgba(197,211,231,0.28)] to-bg md:-top-[180px] xl:-top-[120px]" />
        </div>

        <HomePageHero
          activeVideoIndex={activeVideoIndex}
          heroHeadingMuted={heroHeadingMuted}
          heroHeadingPrimary={heroHeadingPrimary}
          locale={locale}
          onSelectVideo={setActiveVideoIndex}
        />
      </div>

      <div data-reveal><ClientSection caption={clientCaption} /></div>
      <div data-reveal><FeatureSection items={featureItems} /></div>
      <div data-reveal>
        <McpSection
          description={mcpDescription}
          items={mcpItems}
          title={mcpTitle}
        />
      </div>
      <div data-reveal><ReviewSection items={reviewItems} title={reviewTitle} /></div>
      <div data-reveal className="-mx-5 md:-mx-10">
        <ContentListSection
          description={contentListDescription}
          items={contentListItems}
          links={contentListLinks}
          title={contentListTitle}
        />
      </div>
      <div data-reveal>
        <HomeNewsListClientSection fallbackItems={newsItems} locale={locale} title={newsTitle} />
      </div>
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
