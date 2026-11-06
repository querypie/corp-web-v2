import Cta from "@/components/sections/Cta";
import type { Locale } from "@/constants/i18n";
import { getContactHref } from "@/features/contact/prefill";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { penetrationTestingLocalizedCopy, pentestLocalizedMockCopy } from "@/copy/penetrationTestingLocalized";
import PentestExplorationMockup from "./PentestExplorationMockup";
import PentestProcessDiagram from "./PentestProcessDiagram";
import PentestDeliverables from "./PentestDeliverables";
import PentestFeatures from "./PentestFeatures";
import PentestCaseStudy from "./PentestCaseStudy";
import styles from "./PenetrationTestingPage.module.css";

export default function PenetrationTestingPage({ locale = "ja" }: { locale?: Locale }) {
  const copy = penetrationTestingLocalizedCopy[locale];
  return <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
    <section className={pageContentWidthClassName}>
      <header className="grid items-start gap-6 md:grid-cols-2 md:gap-12">
        <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}</h1>
        <p className="m-0 type-body-lg leading-relaxed text-mute">{copy.hero.description}</p>
      </header>
      <div className="mt-14 md:mt-20"><PentestProcessDiagram locale={locale} /></div>
      <div className="mt-14 md:mt-20"><PentestExplorationMockup copy={pentestLocalizedMockCopy[locale]} /></div>
    </section>

    <section className={styles.band}>
      <div className={pageContentWidthClassName}>
        <PentestFeatures locale={locale} />
      </div>
    </section>

    <section className={pageContentWidthClassName}>
      <PentestDeliverables locale={locale} />
    </section>

    <section className={styles.band}>
      <div className={pageContentWidthClassName}>
        <PentestCaseStudy locale={locale} />
      </div>
    </section>

    <Cta actionHref={getContactHref(locale, "penetrationtest")} actionLabel={copy.cta.action} compactHeading description={copy.cta.description} hideEyebrow locale={locale} secondaryActionLabel="" title={copy.cta.title} />
  </div>;
}
