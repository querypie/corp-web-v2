import type { HomePageProps } from "@/components/pages/home/HomePage";
import Cta from "@/components/sections/Cta";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Clients from "../Clients";
import Hero from "../Hero";
import News from "../News";
import NoticePopover from "../NoticePopover";
import ResourceList from "../ResourceList";
import JapanAxContent from "./JapanAxContent";
import JapanHeroProductIcons from "./JapanHeroProductIcons";

export type JapanHomePageProps = Pick<
  HomePageProps,
  | "clientCaption"
  | "contentListDescription"
  | "contentListItems"
  | "contentListLinks"
  | "contentListTitle"
  | "heroDescription"
  | "heroHeading"
  | "heroImageAlt"
  | "heroPrimaryCtaLabel"
  | "locale"
  | "newsItems"
  | "newsTitle"
  | "noticeItems"
>;

export default function JapanHomePage({
  clientCaption,
  contentListDescription,
  contentListItems,
  contentListLinks,
  contentListTitle,
  heroDescription,
  heroHeading,
  heroImageAlt,
  heroPrimaryCtaLabel,
  locale,
  newsItems,
  newsTitle,
  noticeItems,
}: JapanHomePageProps) {
  return (
    <>
      <NoticePopover items={noticeItems} locale={locale} />

      <div className={`-mt-[100px] flex flex-col ${pageSectionGapClassName} overflow-x-hidden bg-bg ${pageXPaddingClassName} text-fg md:-mt-[140px]`}>
        <div className="relative -mx-5 md:-mx-10">
          <Hero
            ctaLabel={heroPrimaryCtaLabel}
            description={heroDescription}
            heroHeading={heroHeading}
            headingAccessory={<JapanHeroProductIcons />}
            imageAlt={heroImageAlt}
            locale={locale}
          />
        </div>

        <div><Clients caption={clientCaption} /></div>
        <JapanAxContent />
        <div className="-mx-5 md:-mx-10">
          <ResourceList
            description={contentListDescription}
            items={contentListItems}
            links={contentListLinks}
            title={contentListTitle}
          />
        </div>
        <div><News items={newsItems} title={newsTitle} /></div>
        <div><Cta locale={locale} /></div>
      </div>
    </>
  );
}
