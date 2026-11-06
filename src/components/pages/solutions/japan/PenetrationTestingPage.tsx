import { CircleCheck, Globe, Network, ShieldCheck } from "lucide-react";
import Cta from "@/components/sections/Cta";
import type { Locale } from "@/constants/i18n";
import { getContactHref } from "@/features/contact/prefill";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { penetrationTestingLocalizedCopy, pentestLocalizedMockCopy } from "@/copy/penetrationTestingLocalized";
import PentestExplorationMockup from "./PentestExplorationMockup";
import PentestProcessDiagram from "./PentestProcessDiagram";
import PentestDeliverables from "./PentestDeliverables";
import PentestPlaceholder from "./PentestPlaceholder";
import SolutionSectionHeading from "./SolutionSectionHeading";
import styles from "./PenetrationTestingPage.module.css";

function Heading({ content }: { content: { title: string; description: string } }) {
  return <div className={styles.heading}><SolutionSectionHeading {...content} layout="split" /></div>;
}

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
        <PentestPlaceholder locale={locale} />
      </div>
    </section>

    <section className={pageContentWidthClassName}>
      <PentestDeliverables locale={locale} />
    </section>

    <section className={styles.band}>
      <div className={pageContentWidthClassName}>
      <Heading content={copy.process} />
      <ol className={styles.process}>{copy.process.steps.map((step, i) => { const Icon = [Globe, ShieldCheck, Network, CircleCheck][i]; return <li key={step.title}><div className={styles.processTop}><span>0{i + 1}</span><span>{step.owner}</span></div><Icon aria-hidden="true" /><h3 className="mb-3 mt-5 type-h3">{step.title}</h3><p className="m-0 type-body-md text-mute">{step.body}</p></li>; })}</ol>
      </div>
    </section>

    <Cta actionHref={getContactHref(locale, "penetrationtest")} actionLabel={copy.cta.action} compactHeading description={copy.cta.description} hideEyebrow locale={locale} secondaryActionLabel="" title={copy.cta.title} />
  </div>;
}
