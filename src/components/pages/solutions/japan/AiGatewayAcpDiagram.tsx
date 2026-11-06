import { useId } from "react";
import { Cpu, Database, Globe, Layers, Server, UserRound } from "lucide-react";
import type { Locale } from "@/constants/i18n";
import { aiGatewaySecurityCopy } from "@/copy/aiGatewaySecurity";
import { aiGatewayArchitectureCopy } from "@/copy/aiGatewayLocalized";
import styles from "./AiGatewayAcpDiagram.module.css";

const resourceIcons = [Database, Server, Layers, Globe];
const providers = [
  { name: "OpenAI", src: "/assets/icons/llm-gpt-color.svg" },
  { name: "Anthropic", src: "/assets/icons/llm-claude-color.svg" },
  { name: "Gemini", src: "/assets/icons/llm-gemini-color.svg" },
];

export default function AiGatewayAcpDiagram({ locale }: { locale: Locale }) {
  const arrowId = useId();
  const text = aiGatewaySecurityCopy[locale].acp;
  return <figure className={styles.diagram} aria-label={text.label}>
    <div className={styles.flow}>
      <div className={styles.user}><UserRound aria-hidden="true" /><span>{text.user}</span></div>
      <div className={styles.userLine} aria-hidden="true"><svg className={styles.arrowhead} viewBox="0 0 10 10"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></svg></div>
      <div className={styles.models}>
        <h3>{text.models}</h3>
        <ul>{providers.map(provider => <li key={provider.name}><img src={provider.src} alt={provider.name} width={28} height={28} title={provider.name} /></li>)}
          <li title={aiGatewayArchitectureCopy[locale].localLlm}><Cpu aria-hidden="true" /><span className="sr-only">{aiGatewayArchitectureCopy[locale].localLlm}</span></li>
        </ul>
      </div>
      <div className={styles.modelLine} aria-hidden="true" />
      <div className={`${styles.node} ${styles.gateway}`}>
        <img className={styles.gatewayLogo} src="/assets/icons/logo-AIG.svg" alt="" width={28} height={28} />
        <h3 className="type-h3">AI Gateway</h3>
      </div>
      <div className={styles.mcp}>
        <div className={styles.mcpLabel}><img src="/assets/pages/platforms/acp/diagram/target-mcp.svg" alt="" width={24} height={24} /><span>{text.tools}</span></div>
        <div className={styles.mcpLine} aria-hidden="true"><svg className={styles.arrowhead} viewBox="0 0 10 10"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></svg></div>
      </div>
      <div className={`${styles.node} ${styles.acp}`}>
        <img src="/assets/pages/platforms/acp/diagram/acp-role.svg" alt="" width={40} height={46} />
        <h3 className="type-h3">QueryPie ACP</h3>
      </div>
      <svg className={styles.branches} viewBox="0 0 100 200" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <defs><marker id={`${arrowId}-desktop`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><polygon className={styles.marker} points="0,0 10,5 0,10" /></marker></defs>
        {[22, 74, 126, 178].map(y => <path key={y} d={`M0 100 C50 100 50 ${y} 100 ${y}`} markerEnd={`url(#${arrowId}-desktop)`} />)}
      </svg>
      <svg className={styles.mobileBranches} fill="none" aria-hidden="true">
        <defs><marker id={`${arrowId}-mobile`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><polygon className={styles.marker} points="0,0 10,5 0,10" /></marker></defs>
        <svg x="50%" width="96" height="16" overflow="visible"><path d="M48 0 V16 H0" /></svg>
        <svg y="16" width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" overflow="visible">
          {[50, 150, 250, 350].map(x => <path key={x} d={`M200 0 C200 16 ${x} 16 ${x} 32`} markerEnd={`url(#${arrowId}-mobile)`} />)}
        </svg>
      </svg>
      <div className={styles.resources}>{text.resources.map((resource, index) => {
        const Icon = resourceIcons[index];
        return <div key={resource}><Icon aria-hidden="true" /><span>{resource}</span></div>;
      })}</div>
    </div>
    <figcaption className="type-body-md text-mute">{text.caption}</figcaption>
  </figure>;
}
