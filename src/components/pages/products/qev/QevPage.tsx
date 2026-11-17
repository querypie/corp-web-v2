import { BrainCircuit, UserRound, AppWindow, GitBranch, ShieldCheck, Cpu, SlidersHorizontal, Check, LockKeyhole, Zap, MessageSquare, Layers } from "lucide-react";
import Cta from "@/components/sections/Cta";
import Button from "@/components/ui/Button";
import SolutionSectionHeading from "@/components/pages/shared/SolutionSectionHeading";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import type { Locale } from "@/constants/i18n";
import { getContactHref } from "@/features/contact/prefill";
import { qevCopy } from "@/copy/qevLocalized";
import styles from "./QevPage.module.css";
import AiGatewayLogo from "../ai-gateway/AiGatewayLogo";

const agentLogos = [
  { label: "Aru", src: "/assets/icons/icon-aru.svg" },
  { label: "Claude Code", src: "/assets/icons/llm-claude-color.svg" },
  { label: "Codex", src: "/assets/icons/llm-gpt-color.svg" },
  { label: "OpenClaw", src: "/assets/icons/agent-openclaw.svg" },
  { label: "Hermes", src: "/assets/icons/agent-hermes.webp" },
];

function ComparisonTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className={styles.tableWrap}><table className={styles.table}><thead><tr>{headers.map(text => <th scope="col" key={text}>{text}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]}>{row.map((text, index) => index === 0 ? <th scope="row" key={text}>{text}</th> : <td key={text}>{text}</td>)}</tr>)}</tbody></table></div>;
}

function UseCaseDiagram({ kind, locale }: { kind: "dlp" | "router"; locale: Locale }) {
  const copy = qevCopy[locale];
  const text = copy.useCases[kind];
  const example = copy.useCases.example;
  return <figure className={`${styles.useVisual} ${kind === "dlp" ? styles.dlpVisual : ""}`} aria-label={text.label}>
    {kind === "dlp" ? <div className={styles.dlpIllustration}>
      <div className={styles.documentPanel}>
        <p className={`${styles.documentText} ${styles.annotatedText}`}>{example.before}<span className={styles.annotatedPhrase}><mark>{example.personal}</mark><span className={styles.annotation}><UserRound aria-hidden="true" />{text.outputs[0]}</span></span>{example.middle}<span className={styles.annotatedPhrase}><mark>{example.confidential}</mark><span className={styles.annotation}><LockKeyhole aria-hidden="true" />{text.outputs[1]}</span></span>{example.after}</p>
      </div>
      <div className={styles.detectionBadge}><BrainCircuit aria-hidden="true" /><strong>QEV</strong><span>{text.decision}</span><Check className={styles.detectionCheck} aria-hidden="true" /></div>
    </div> : <div className={styles.routingScene}>
      <div className={styles.promptStrip}><MessageSquare aria-hidden="true" /><span>{copy.useCases.routingVisual.request}</span></div>
      <div className={styles.inputWire} aria-hidden="true" />
      <div className={styles.decisionStrip}><GitBranch aria-hidden="true" /><strong>{copy.useCases.routingVisual.judgment}</strong><span>{copy.useCases.routingVisual.task}</span><span className={styles.taskTag}>{copy.useCases.routingVisual.criteria}</span></div>
      <svg className={styles.selectionWires} viewBox="0 0 420 55" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M210 0 V14 Q210 25 195 25 H78 Q65 25 65 40 V55 M210 0 V55" /><path className={styles.selectedWire} d="M210 0 V14 Q210 25 225 25 H342 Q355 25 355 40 V55" /></svg>
      <div className={styles.modelBank}>{[Zap, Layers, BrainCircuit].map((Icon, index) => <div className={`${styles.modelTile} ${index === 2 ? styles.activeTile : ""}`} key={copy.useCases.routingVisual.models[index]}><Icon aria-hidden="true" /><span>{copy.useCases.routingVisual.models[index]}</span>{index === 2 ? <span className={styles.selectionBadge}><Check aria-hidden="true" />{copy.useCases.routingVisual.chosen}</span> : null}</div>)}</div>
    </div>}
  </figure>;
}

export default function QevPage({ locale }: { locale: Locale }) {
  const copy = qevCopy[locale];
  const icons = [ShieldCheck, Cpu, SlidersHorizontal];
  return <div className={`${styles.page} flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
    <section className={pageContentWidthClassName}>
      <header className="grid items-start gap-6 md:grid-cols-2 md:gap-12"><h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}</h1><p className="m-0 type-body-lg leading-relaxed text-fg">{copy.hero.description}</p></header>
      <figure className={styles.heroDiagram} aria-label={copy.flow.label}>
        <div className={styles.flow}>
          <div className={styles.input}><h3 className="type-h3">{copy.flow.input}</h3><ul className={styles.agentLogos}>{agentLogos.map(({ label, src }) => <li key={label} title={label}><img src={src} alt={label} width={28} height={28} /></li>)}<li title={copy.flow.application}><AppWindow role="img" aria-label={copy.flow.application} /></li><li title={copy.flow.user}><UserRound role="img" aria-label={copy.flow.user} /></li></ul></div>
          <span className={styles.connector} aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></svg></span>
          <div className={styles.core}><BrainCircuit aria-hidden="true" /><h2 className={`${styles.wordmark} type-h1`}><strong>QEV</strong></h2><span>{copy.flow.core}</span><div className={styles.decisions}>{copy.flow.decisions.map((text, i) => <div key={text}>{i === 0 ? <ShieldCheck aria-hidden="true" /> : <GitBranch aria-hidden="true" />}<span>{text}</span></div>)}</div></div>
          <span className={styles.connector} aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></svg></span>
          <div className={styles.gateway}><AiGatewayLogo /><strong>AI Gateway</strong><span>{copy.flow.gateway}</span><div className={styles.outputs}><span>DLP</span><span>Auto Router</span></div></div>
        </div><figcaption>{copy.flow.caption}</figcaption>
      </figure>
    </section>

    <section className={styles.band}><div className={pageContentWidthClassName}>
      <h2 className="m-0 type-h1 text-fg">{copy.uses.title}</h2>
      <div className={styles.useGrid}>
        <article className={styles.useCard}><h2 className={`${styles.useHeading} type-h2`}><ShieldCheck aria-hidden="true" />{copy.useCases.dlp.title}</h2><p>{copy.useCases.dlp.description}</p><UseCaseDiagram kind="dlp" locale={locale} /></article>
        <article className={styles.useCard}><h2 className={`${styles.useHeading} type-h2`}><GitBranch aria-hidden="true" />{copy.useCases.router.title}</h2><p>{copy.useCases.router.description}</p><UseCaseDiagram kind="router" locale={locale} /></article>
      </div>
    </div></section>

    <section className={pageContentWidthClassName}><SolutionSectionHeading title={copy.performance.title} description={copy.performance.description} layout="split" /><div className={styles.metrics}>{copy.performance.metrics.map(metric => <div key={metric.label}><p className={styles.metric}>{metric.value}<span>{metric.unit}</span></p><h3>{metric.label}</h3><p>{metric.detail}</p></div>)}</div><ComparisonTable headers={copy.performance.headers} rows={copy.performance.rows} /><p className={styles.note}>{copy.performance.note}</p></section>

    <section className={styles.band}><div className={pageContentWidthClassName}><SolutionSectionHeading title={copy.technology.title} description={copy.technology.description} layout="split" /><div className={styles.techGrid}>{copy.technology.items.map((item, i) => { const Icon = icons[i]; return <article key={item.title}><Icon aria-hidden="true" /><h3 className="type-h3">{item.title}</h3><p>{item.body}</p><div className={styles.tags}>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>; })}</div><p className={styles.note}>{copy.technology.note}</p></div></section>
    <section className={pageContentWidthClassName}>
      <header className="grid w-full items-start gap-4 text-left sm:gap-5 md:grid-cols-2 md:gap-7.5">
        <h2 className="m-0 min-w-0 text-pretty type-h1 text-fg">{copy.explore.title}</h2>
        <div className="min-w-0">
          <p className="m-0 text-pretty type-body-lg leading-relaxed text-mute">{copy.explore.description}</p>
          <div className="mt-6">
            <Button arrow href={copy.explore.demoHref} target="_blank" rel="noreferrer noopener" size="default" style="full" variant="primary">{copy.explore.demoLabel}</Button>
          </div>
        </div>
      </header>
      <div className="mt-16 flex flex-col gap-5 rounded-box border border-border p-6 md:mt-20 md:flex-row md:items-center md:p-8">
        <img alt="" aria-hidden="true" className="h-10 w-10 shrink-0 object-contain" height={40} width={40} src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" />
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="m-0 text-pretty type-h2 text-fg">{copy.explore.modelTitle}</h2>
          <p className="m-0 type-body-md text-mute">{copy.explore.modelDescription}</p>
        </div>
        <Button arrow={false} className="self-start shrink-0 md:self-center" href={copy.explore.modelHref} target="_blank" rel="noreferrer noopener" size="default" style="full" variant="secondary">{copy.explore.modelLabel}</Button>
      </div>
    </section>
    <Cta locale={locale} title={copy.cta.title} description={copy.cta.description} actionLabel={copy.cta.action} actionHref={getContactHref(locale)} compactHeading hideEyebrow secondaryActionLabel="" />
  </div>;
}
