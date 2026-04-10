"use client";

import { useEffect, useState } from "react";
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
  ctaDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
  featureItems: FeatureItem[];
  heroDescription: string;
  heroHeading: string;
  heroPrimaryCtaLabel: string;
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
  heroDescription,
  heroHeading,
  heroPrimaryCtaLabel,
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
  const [isHeroVideoVisible, setIsHeroVideoVisible] = useState(false);
  const [isHeroOverlayVisible, setIsHeroOverlayVisible] = useState(false);
  const activeVideo = heroVideos[activeVideoIndex];

  useEffect(() => {
    setIsHeroVideoVisible(false);
    setIsHeroOverlayVisible(false);
  }, [activeVideo.src]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsHeroVideoVisible(true);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeVideo.src]);

  useEffect(() => {
    if (!isHeroVideoVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsHeroOverlayVisible(true);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isHeroVideoVisible]);

  return (
    <div className="-mt-[120px] flex flex-col gap-20 overflow-x-hidden bg-bg px-5 pb-10 text-fg md:-mt-[160px] md:gap-[160px] md:px-10">
      <div className="relative -mx-5 md:-mx-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#D9E1EC]" />
          <video
            key={activeVideo.src}
            aria-hidden="true"
            autoPlay
            className={cx(
              "homeb-hero-video transition-opacity duration-[500ms] ease-out",
              isHeroVideoVisible ? "opacity-100" : "opacity-0",
              (activeVideo.id === 2 || activeVideo.id === 3) && "-scale-x-100",
            )}
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={activeVideo.src} type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className={cx(
              "absolute -left-[320px] -top-[220px] h-[560px] w-[980px] rounded-full blur-[80px] transition-opacity duration-[900ms] ease-out delay-75",
              isHeroOverlayVisible ? "opacity-100" : "opacity-0",
            )}
            style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.56) 34%, rgba(255,255,255,0.18) 54%, rgba(255,255,255,0) 76%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 -top-[160px] bg-gradient-to-b from-transparent via-transparent via-55% to-bg md:-top-[180px] xl:-top-[120px]" />
          <div
            className={cx(
              "absolute inset-x-0 bottom-0 -top-[160px] bg-gradient-to-b from-transparent via-[rgba(197,211,231,0.28)] to-transparent transition-opacity duration-[900ms] ease-out delay-100 md:-top-[180px] xl:-top-[120px]",
              isHeroOverlayVisible ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        <HomePageHero
          activeVideoIndex={activeVideoIndex}
          ctaLabel={heroPrimaryCtaLabel}
          description={heroDescription}
          heroHeading={heroHeading}
          locale={locale}
          onSelectVideo={setActiveVideoIndex}
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
          actionLabel="Get Start!"
          description={ctaDescription}
          eyebrow={ctaEyebrow}
          title={ctaTitle}
        />
      </div>
    </div>
  );
}
