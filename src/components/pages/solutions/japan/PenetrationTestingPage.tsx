import { ArrowDown, ArrowRight, CalendarClock, Cloud, FileCheck2, FileSearch, Globe, KeyRound, ListChecks, MessagesSquare, Network, ScanLine, ShieldCheck } from "lucide-react";
import Cta from "@/components/sections/Cta";
import { getLocalePath } from "@/constants/i18n";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { penetrationTestingCopy as copy } from "@/copy/penetrationTesting";
import SolutionSectionHeading from "./SolutionSectionHeading";
import layout from "./AiGatewayContent.module.css";
import styles from "./PenetrationTestingPage.module.css";

const featureIcons = [Globe, KeyRound, ShieldCheck, Network, Cloud, FileSearch];
const scopeIcons = [Globe, ListChecks, CalendarClock, MessagesSquare];
const processIcons = [MessagesSquare, ListChecks, ScanLine, FileCheck2];

function HeroDiagram() {
  return <figure className={styles.diagram} aria-label={copy.hero.diagramLabel}>
    <div className={styles.targetGrid}>{copy.hero.targets.map((target, index) => {
      const Icon = [Globe, KeyRound, Network, Cloud][index];
      return <div className={styles.target} key={target}><Icon aria-hidden="true" /><span>{target}</span></div>;
    })}</div>
    <ArrowRight className={styles.desktopArrow} aria-hidden="true" /><ArrowDown className={styles.mobileArrow} aria-hidden="true" />
    <div className={styles.hub}><ScanLine aria-hidden="true" /><h2 className="m-0 type-h2">{copy.hero.center}</h2><span>{copy.hero.centerLabel}</span></div>
    <ArrowRight className={styles.desktopArrow} aria-hidden="true" /><ArrowDown className={styles.mobileArrow} aria-hidden="true" />
    <div className={styles.outputs}>{copy.hero.outputs.map((output, index) => {
      const Icon = index === 0 ? FileSearch : ListChecks;
      return <div className={styles.target} key={output}><Icon aria-hidden="true" /><span>{output}</span></div>;
    })}</div>
  </figure>;
}

export default function PenetrationTestingPage() {
  return <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
    <section className={pageContentWidthClassName}>
      <header className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
        <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}</h1>
        <p className="m-0 type-body-lg leading-relaxed text-fg">{copy.hero.description}</p>
      </header>
      <div className="mt-12 md:mt-16"><HeroDiagram /></div>
    </section>

    <section className={pageContentWidthClassName}>
      <h2 className="m-0 text-center text-pretty type-h2 text-fg">{copy.challenges.title}</h2>
      <div className={layout.challengeGrid}>{copy.challenges.items.map(item => <article className={layout.challenge} key={item.title}>
        <h3 className="m-0 type-h3 text-fg">{item.title}</h3><p className="mb-0 mt-4 type-body-md text-mute">{item.body}</p>
      </article>)}</div>
    </section>

    <section className={layout.band}>
      <div className={`${pageContentWidthClassName} ${layout.section}`}>
        <SolutionSectionHeading title={copy.features.title} description={copy.features.description} />
        <div className={layout.featureGrid}>{copy.features.cards.map((card, index) => {
          const Icon = featureIcons[index];
          return <article className={layout.feature} key={card.title}>
            <div className={styles.featureVisual} aria-hidden="true"><span><Icon /></span></div>
            <h3 className="m-0 text-pretty type-h3 text-fg">{card.title}</h3><p className="mb-0 mt-4 type-body-md text-mute">{card.body}</p>
          </article>;
        })}</div>
      </div>
    </section>

    <section className={`${pageContentWidthClassName} ${layout.section}`}>
      <SolutionSectionHeading title={copy.scope.title} description={copy.scope.description} />
      <div className={layout.accessLayout}>
        <div className={layout.roleGrid}>{copy.scope.cards.map((card, index) => {
          const Icon = scopeIcons[index];
          return <article className={layout.roleCard} key={card.title}>
            <div className={layout.roleVisual}><Icon className={layout.roleIcon} aria-hidden="true" /></div>
            <h3 className="m-0 type-h3 text-fg">{card.title}</h3><p className="mb-0 mt-3 type-body-md text-mute">{card.body}</p>
          </article>;
        })}</div>
        <div className={layout.scopePanel}>
          <h3 className="m-0 type-h3 text-fg">{copy.scope.tableTitle}</h3>
          <table className={layout.scopeTable}>
            <caption className="sr-only">{copy.scope.tableTitle}</caption>
            <thead><tr>{copy.scope.columns.map(column => <th className="type-body-md text-fg" scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{copy.scope.rows.map(([label, value]) => <tr key={label}><th scope="row" className="type-body-md text-fg">{label}</th><td className="type-body-md text-mute">{value}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section className={layout.band}>
      <div className={`${pageContentWidthClassName} ${layout.section}`}>
        <SolutionSectionHeading title={copy.process.title} description={copy.process.description} />
        <ol className={styles.process}>{copy.process.steps.map((step, index) => {
          const Icon = processIcons[index];
          return <li key={step.title}><span className={styles.step}>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><h3 className="m-0 type-h3">{step.title}</h3><p className="m-0 type-body-sm text-mute">{step.body}</p></li>;
        })}</ol>
      </div>
    </section>

    <Cta actionHref={getLocalePath("ja", "/contact-us")} actionLabel={copy.cta.action} compactHeading description={copy.cta.description} hideEyebrow locale="ja" secondaryActionLabel="" title={copy.cta.title} />
  </div>;
}
