import { AppWindow, BrainCircuit, UserRound, Zap } from "lucide-react";
import Cta from "@/components/sections/Cta";
import SolutionSectionHeading from "@/components/pages/shared/SolutionSectionHeading";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import type { Locale } from "@/constants/i18n";
import { getContactHref } from "@/features/contact/prefill";
import { qlmCopy } from "@/copy/qlmLocalized";
import cards from "@/components/pages/shared/FeatureCards.module.css";
import styles from "./QlmPage.module.css";
import QlmFeatureVisual from "./QlmFeatureVisual";
import AiGatewayLogo from "../ai-gateway/AiGatewayLogo";
import qev from "../qev/QevPage.module.css";

const agentLogos = [
  { label: "Aru", src: "/assets/icons/icon-aru.svg" },
  { label: "Claude Code", src: "/assets/icons/llm-claude-color.svg" },
  { label: "Codex", src: "/assets/icons/llm-gpt-color.svg" },
  { label: "OpenClaw", src: "/assets/icons/agent-openclaw.svg" },
  { label: "Hermes", src: "/assets/icons/agent-hermes.webp" },
];

export default function QlmPage({ locale }: { locale: Locale }) {
  const copy = qlmCopy[locale];
  return <div className={`${styles.page} flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
    <section className={pageContentWidthClassName}>
      <header className="grid items-start gap-6 md:grid-cols-2 md:gap-12">
        <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}</h1>
        <p className="m-0 text-pretty type-body-lg leading-relaxed text-fg">{copy.hero.description}</p>
      </header>
      <figure className={styles.routing} aria-label={copy.routing.title.replace("\n", " ")}>
        <div className={styles.flow}>
          <div className={qev.input}><h3 className="type-h3">{copy.routing.input}</h3><ul className={qev.agentLogos}>{agentLogos.map(({ label, src }) => <li key={label} title={label}><img src={src} alt={label} width={28} height={28} /></li>)}<li title={copy.routing.application}><AppWindow role="img" aria-label={copy.routing.application} /></li><li title={copy.routing.user}><UserRound role="img" aria-label={copy.routing.user} /></li></ul></div>
          <span className={qev.connector} aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></svg></span>
          <div className={styles.gateway}><AiGatewayLogo /><strong>{copy.routing.gateway}</strong><span>{copy.routing.decision}</span></div>
          <div className={styles.branches} aria-hidden="true">
            <svg className={styles.branchDesktop} viewBox="0 0 48 116" preserveAspectRatio="none" fill="none"><path className={styles.flowLine} d="M0 58 H14 Q24 58 24 48 V10 Q24 0 34 0 H42 M24 58 V106 Q24 116 34 116 H42" /><path className={styles.arrowhead} d="M38 -4 L48 0 L38 4 Z M38 112 L48 116 L38 120 Z" /></svg>
            <svg className={styles.branchMobile} viewBox="0 0 10 36" fill="none"><path className={styles.flowLine} d="M5 0 V30" /><path className={styles.arrowhead} d="M1 26 L5 36 L9 26 Z" /></svg>
          </div>
          <div className={styles.destinations}>{[{ label: copy.routing.light, tasks: copy.routing.lightTasks, Icon: Zap }, { label: copy.routing.qlm, tasks: copy.routing.qlmTasks, Icon: BrainCircuit }].map(({ label, tasks, Icon }, index) => <div className={index === 1 ? styles.qlm : undefined} key={label}>
            <Icon aria-hidden="true" /><strong>{label}</strong>
            <div className={styles.hardware} aria-hidden="true"><div className={styles.vents}>{[0, 1, 2, 3, 4, 5].map(slot => <i className={slot < (index === 0 ? 2 : 4) ? styles.powerSlot : undefined} key={slot} />)}</div><i className={styles.status} /></div>
            <span>{tasks}</span>
          </div>)}</div>
        </div>
        <figcaption>{copy.routing.note}</figcaption>
      </figure>
    </section>
    <section className={cards.band}>
      <div className={`${pageContentWidthClassName} ${cards.section}`}>
        <SolutionSectionHeading title={copy.features.title} description={copy.features.description} layout="split" />
        <div className={cards.featureGrid}>{copy.features.cards.map((card, index) => {
          return <article className={cards.feature} key={card.title}>
            <QlmFeatureVisual index={index} locale={locale} />
            <h3 className="m-0 text-pretty type-h3 text-fg">{card.title}</h3>
            <p className="mb-0 mt-4 type-body-md text-mute">{card.body}</p>
          </article>;
        })}</div>
      </div>
    </section>
    <section className={pageContentWidthClassName}>
      <SolutionSectionHeading title={copy.performance.title} description={copy.performance.description} layout="split" />
      <div className={styles.tableWrap}><table className={styles.table}>
        <caption className="sr-only">{copy.performance.tableLabel}</caption>
        <thead><tr>{copy.performance.headers.map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{copy.performance.metrics.map(item => <tr key={item.benchmark}>
          <th scope="row">{item.benchmark}</th><td>{item.title}</td><td>{item.metric}</td><td>{item.value}{item.metric === "Score" ? "" : "%"}</td>
        </tr>)}</tbody>
      </table></div>
      <p className={styles.notes}>{copy.performance.note}</p>
    </section>
    <Cta locale={locale} title={copy.cta.title} description={copy.cta.description} actionLabel={copy.cta.action} actionHref={getContactHref(locale)} compactHeading hideEyebrow secondaryActionLabel="" />
  </div>;
}
