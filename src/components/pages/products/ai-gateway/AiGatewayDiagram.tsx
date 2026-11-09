import { useId } from "react";
import { Activity, Cloud, Cpu, KeyRound, Network, Plug, Server, ShieldCheck, Users } from "lucide-react";
import type { Locale } from "@/constants/i18n";
import { aiGatewayArchitectureCopy } from "@/copy/aiGatewayLocalized";
import AiGatewayLogo from "./AiGatewayLogo";
import styles from "./AiGatewayDiagram.module.css";

const moduleIcons = [Network, Plug, ShieldCheck, Activity];
const agentLogos = [
  { label: "Claude Code", src: "/assets/icons/llm-claude-color.svg" },
  { label: "Codex", src: "/assets/icons/llm-gpt-color.svg" },
  { label: "Cursor", src: "/assets/icons/agent-cursor.webp" },
  { label: "Pi", src: "/assets/icons/agent-pi.webp" },
  { label: "Hermes", src: "/assets/icons/agent-hermes.webp" },
  { label: "Aru", src: "/assets/icons/icon-aru.svg" },
];

function Connections({ outgoing = false, mobile = false }: { outgoing?: boolean; mobile?: boolean }) {
  const arrowId = useId();
  const paths = mobile
    ? outgoing ? ["M170 0 C170 32 100 24 100 60", "M230 0 C230 32 300 24 300 60"] : ["M100 0 C100 36 170 28 170 60", "M300 0 C300 36 230 28 230 60"]
    : [
      "M276 104 C340 104 340 200 400 200",
      "M276 296 C340 296 340 200 400 200",
      "M800 200 C860 200 860 104 924 104",
      "M800 200 C860 200 860 296 924 296",
    ];
  return <svg className={mobile ? styles.mobileConnections : styles.connections} viewBox={mobile ? "0 0 400 64" : "0 0 1200 400"} preserveAspectRatio="none" fill="none" aria-hidden="true">
    <defs><marker id={arrowId} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path className={styles.arrowhead} d="M0 0 L10 5 L0 10 Z" /></marker></defs>
    {paths.map((d, index) => <path key={d} className={`${styles.lineFlow} ${mobile ? outgoing ? styles.outgoing : "" : index >= 2 ? styles.outgoing : ""}`} d={d} markerEnd={`url(#${arrowId})`} />)}
  </svg>;
}

export default function AiGatewayDiagram({ locale = "ja" }: { locale?: Locale }) {
  const copy = aiGatewayArchitectureCopy[locale];
  return <figure className={styles.diagram} aria-label={copy.diagramLabel}>
    <div className={styles.architecture}>
      <Connections />
      <div className={styles.side}>
        <section className={styles.node}>
          <h3>{copy.agents}</h3>
          <ul className={styles.agentLogos}>{agentLogos.map(({ label, src }) => <li key={label} title={label}><img src={src} alt={label} width={32} height={32} /></li>)}</ul>
        </section>
        <section className={styles.node}>
          <h3>{copy.organization}</h3>
          <ul className={styles.serviceList}>
            <li><KeyRound aria-hidden="true" /><span>{copy.sso}</span></li>
            <li><Users aria-hidden="true" /><span>{copy.sync}</span></li>
            <li><ShieldCheck aria-hidden="true" /><span>{copy.rbac}</span></li>
          </ul>
        </section>
      </div>
      <Connections mobile />
      <section className={styles.gateway}>
        <div className={styles.gatewayHeading}>
          <AiGatewayLogo className={styles.gatewayLogo} />
          <h2 className="type-h2">AI Gateway</h2>
        </div>
        <p className={styles.gatewayKey}><KeyRound aria-hidden="true" />{copy.key}</p>
        <div className={styles.modules}>{copy.modules.map((module, index) => {
          const Icon = moduleIcons[index];
          return <div className={styles.module} key={module.title}>
            <Icon aria-hidden="true" />
            <h3>{module.title}</h3>
          </div>;
        })}</div>
      </section>
      <Connections mobile outgoing />
      <div className={styles.side}>
        <section className={styles.node}>
          <h3>{copy.providerLabel}</h3>
          <ul className={styles.serviceList}>
            <li title="OpenAI"><img src="/assets/icons/llm-gpt-color.svg" alt="OpenAI" width={36} height={36} /></li>
            <li title="Anthropic"><img src="/assets/icons/llm-claude-color.svg" alt="Anthropic" width={36} height={36} /></li>
            <li><Cpu aria-hidden="true" /><span>{copy.localLlm}</span></li>
          </ul>
        </section>
        <section className={styles.node}>
          <h3>{copy.remote}</h3>
          <ul className={styles.serviceList}>
            <li><Cloud aria-hidden="true" /><span>{copy.saas}</span></li>
            <li><Server aria-hidden="true" /><span>{copy.internalTools}</span></li>
          </ul>
        </section>
      </div>
    </div>
  </figure>;
}
