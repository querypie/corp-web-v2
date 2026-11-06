import { Check, CircleCheck, FileCheck2, Globe, LockKeyhole, Network, Server, ShieldCheck } from "lucide-react";
import Cta from "@/components/sections/Cta";
import type { Locale } from "@/constants/i18n";
import { getContactHref } from "@/features/contact/prefill";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { penetrationTestingLocalizedCopy, pentestLocalizedMockCopy } from "@/copy/penetrationTestingLocalized";
import PentestExplorationMockup from "./PentestExplorationMockup";
import PentestProcessDiagram from "./PentestProcessDiagram";
import PentestMethods from "./PentestMethods";
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
        <Heading content={copy.exploration} />
        <PentestMethods locale={locale} />
      </div>
    </section>

    <section className={pageContentWidthClassName}>
      <Heading content={copy.remediation} />
      <div className={styles.split}>
        <div className={styles.report}>
          <div className={styles.reportTop}><FileCheck2 aria-hidden="true" />{copy.remediation.report}</div>
          <span className={styles.risk}>{copy.remediation.severity}</span><h3 className="mb-5 mt-4 type-h3">{copy.remediation.finding}</h3>
          <div className={styles.code}><code>{copy.remediation.endpoint}</code><p>{copy.remediation.evidence}</p></div>
          <div className={styles.response}><span>{copy.remediation.before}</span><span>{copy.remediation.beforeResult}</span></div>
          <div className={`${styles.response} ${styles.resolved}`}><span>{copy.remediation.after}</span><span><Check size={15} aria-hidden="true" />{copy.remediation.afterResult}</span></div>
        </div>
        <ol className={styles.detailList}>{copy.remediation.steps.map((step, i) => <li key={step.title}><span className={styles.number}>0{i + 1}</span><div><h3 className="m-0 type-h3">{step.title}</h3><p className="mb-0 mt-3 type-body-md text-mute">{step.body}</p></div></li>)}</ol>
      </div>
      <div className={styles.formats}><p>{copy.remediation.formats}</p><span>PDF · DOCX · PPTX · JSON · CSV</span></div>
    </section>

    <section className={styles.band}>
      <div className={`${pageContentWidthClassName} ${styles.security}`}>
      <Heading content={copy.security} />
      <div className={styles.infrastructure}><div className={styles.boundary}>{copy.security.boundary}</div><div className={styles.infrastructureNodes}>{copy.security.infrastructure.map((label, i) => { const Icon = [Server, LockKeyhole, Network][i]; return <div key={label}><Icon aria-hidden="true" /><span>{label}</span></div>; })}</div><p className={styles.private}><ShieldCheck size={18} aria-hidden="true" />{copy.security.private}</p></div>
      <div className={styles.threeColumns}>{copy.security.items.map(item => <article key={item.title}><h3 className="m-0 type-h3">{item.title}</h3><p className="mb-0 mt-4 type-body-md">{item.body}</p></article>)}</div>
      </div>
    </section>

    <section className={pageContentWidthClassName}>
      <Heading content={copy.cases} />
      <div className={styles.caseStudy}><p className={styles.eyebrow}>{copy.cases.exampleLabel}</p><h3 className="mb-8 mt-3 type-h3">{copy.cases.exampleTitle}</h3><div className={styles.threeColumns}>{copy.cases.steps.map((step, i) => <article key={step.title}><span className={styles.number}>0{i + 1}</span><h4 className="mb-3 mt-4 type-body-lg font-medium">{step.title}</h4><p className="m-0 type-body-md text-mute">{step.body}</p></article>)}</div></div>
      <div className={styles.customers}>{copy.cases.customers.map(customer => <article key={customer.name}><div><p className={styles.eyebrow}>{customer.label}</p><h3 className="mb-0 mt-3 text-3xl font-semibold tracking-tight">{customer.name}</h3></div><p className="m-0 type-body-md text-mute">{customer.body}</p></article>)}</div>
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
