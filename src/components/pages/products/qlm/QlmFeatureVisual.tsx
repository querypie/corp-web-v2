import { ArrowRight, BrainCircuit, Check, Cpu, FileText, Layers, LockKeyhole, MessageSquare, ShieldCheck, SlidersHorizontal, Zap } from "lucide-react";
import AiGatewayLogo from "@/components/sections/common/AiGatewayLogo";
import { qlmCopy } from "@/copy/qlmLocalized";
import type { Locale } from "@/constants/i18n";
import shared from "@/components/pages/shared/FeatureVisual.module.css";
import styles from "./QlmFeatureVisual.module.css";

type VisualProps = { text: typeof qlmCopy.en.visuals };

function Selection({ text }: VisualProps) {
  return <div className={styles.selection}>
    <div className={styles.candidates}>{[Layers, BrainCircuit, Cpu].map((Icon, index) => <div className={`${styles.tile} ${index === 1 ? styles.selected : ""}`} key={index}><Icon />{index === 1 ? <Check className={styles.check} /> : null}</div>)}</div>
    <svg className={styles.wires} viewBox="0 0 280 42" fill="none"><path d="M47 0 V10 Q47 21 60 21 H220 Q233 21 233 10 V0 M140 0 V42" /></svg>
    <div className={styles.selectionResult}><span>{text.selection}</span><div className={styles.pill}><BrainCircuit /><strong>QLM</strong><Check /></div></div>
  </div>;
}

function Infrastructure({ text }: VisualProps) {
  return <div className={styles.infrastructure}><div className={styles.rack}>
    <div className={styles.heading}><span>{text.infrastructure}</span><span className={styles.dot} /></div>
    {[0, 1, 2].map(row => <div className={styles.server} key={row}><Cpu /><span>GPU {String(row + 1).padStart(2, "0")}</span><div className={styles.vents}>{[0, 1, 2, 3, 4, 5].map(i => <i key={i} />)}</div><span className={styles.dot} /></div>)}
  </div><div className={styles.rackBase}><span /><span /><span /></div></div>;
}

function Protection({ text }: VisualProps) {
  return <div className={styles.boundary}><div className={styles.heading}><ShieldCheck /><span>{text.boundary}</span><LockKeyhole /></div>
    <div className={styles.secureFlow}><div><FileText /><span>{text.data}</span></div><ArrowRight /><div className={styles.secureModel}><BrainCircuit /><strong>QLM</strong></div></div>
    <div className={styles.policy}><Check /><span>{text.policy}</span></div>
  </div>;
}

function Response({ text }: VisualProps) {
  return <div className={styles.response}><div className={styles.prompt}><MessageSquare /><span>{text.request}</span></div><div className={styles.answer}><div className={styles.heading}><Zap /><strong>QLM</strong><span className={styles.responseStatus}>{text.response}</span></div><div className={styles.textLines}><i /><i /><div><i /><span /></div></div></div><div className={styles.tokens}>{text.tokens.map(token => <span key={token}>{token}</span>)}</div></div>;
}

function Allocation({ text }: VisualProps) {
  return <div className={styles.allocation}><div className={styles.router}><AiGatewayLogo size={24} /><span>AI Gateway</span></div><svg className={styles.allocationWires} viewBox="0 0 30 112" fill="none"><path d="M0 56 H9 Q15 56 15 50 V18 Q15 12 21 12 H30 M15 56 V94 Q15 100 21 100 H30" /></svg><div className={styles.workloads}>{text.workloads.map((item, index) => <div key={item.title} className={styles.workload}><div className={styles.workloadTitle}>{index === 0 ? <Zap /> : <BrainCircuit />}<span>{item.title}</span></div><div className={styles.resource}><span>{item.model}</span><div>{[0, 1, 2, 3].map(i => <i className={i < (index === 0 ? 1 : 3) ? styles.used : ""} key={i} />)}</div></div></div>)}</div></div>;
}

function Tuning({ text }: VisualProps) {
  return <div className={styles.tuning}><div className={styles.tuningPanel}><div className={styles.heading}><SlidersHorizontal /><span>{text.tuning}</span></div>{text.settings.map((label, index) => <div className={styles.setting} key={label}><span>{label}</span><div><i style={{ left: `${[65, 35, 78][index]}%` }} /></div></div>)}</div><div className={styles.tunedModel}><BrainCircuit /><div><strong>QLM</strong><span>{text.customized}</span></div><Check /></div></div>;
}

const visuals = [Selection, Infrastructure, Protection, Response, Allocation, Tuning];

export default function QlmFeatureVisual({ index, locale }: { index: number; locale: Locale }) {
  const Visual = visuals[index];
  return <div className={`${shared.visual} ${styles.visual}`} aria-hidden="true"><Visual text={qlmCopy[locale].visuals} /></div>;
}
