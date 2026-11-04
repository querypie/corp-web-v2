import { Activity, Bot, Boxes, Cpu, KeyRound, Network, Plug, Server, ShieldCheck, Users } from "lucide-react";
import { aiGatewayVisualCopy } from "@/copy/japanAiSolutions";
import styles from "./AiGatewayDiagram.module.css";

export const gatewayProviders = [
  { label: "OpenAI", src: "/assets/icons/llm-gpt-color.svg" },
  { label: "Anthropic", src: "/assets/icons/llm-claude-color.svg" },
];

const copy = aiGatewayVisualCopy.architecture;
const moduleIcons = [Network, Plug, ShieldCheck, Activity];
const roleIcons = [Bot, KeyRound, Users];
const agentLogos = [
  { label: "Claude Code", src: "/assets/icons/llm-claude-color.svg" },
  { label: "Codex", src: "/assets/icons/llm-gpt-color.svg" },
  { label: "Cursor", src: "/assets/icons/agent-cursor.webp" },
  { label: "Pi", src: "/assets/icons/agent-pi.webp" },
  { label: "Hermes", src: "/assets/icons/agent-hermes.webp" },
  { label: "Aru — macOS Desktop Companion", src: "/assets/icons/icon-aru.svg" },
];

function Connections() {
  return <svg className={styles.connections} viewBox="0 0 1200 520" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <defs><linearGradient id="aig-line" x1="0" x2="1"><stop stopColor="var(--color-brand)" stopOpacity=".25" /><stop offset=".5" stopColor="var(--color-brand)" /><stop offset="1" stopColor="var(--color-brand)" stopOpacity=".25" /></linearGradient></defs>
    {["M264 142 H288 Q310 142 310 164 V220 Q310 242 332 242 H352", "M264 382 H288 Q310 382 310 360 V300 Q310 278 332 278 H352", "M848 242 H868 Q890 242 890 220 V164 Q890 142 912 142 H936", "M848 278 H868 Q890 278 890 300 V360 Q890 382 912 382 H936"].map((d, index) => <g key={d}><path className={styles.lineBase} d={d} /><path className={styles.lineFlow} style={{ animationDelay: `${index * -.8}s` }} d={d} /></g>)}
  </svg>;
}

export default function AiGatewayDiagram() {
  return <figure className={styles.diagram} aria-label="AIエージェントと組織管理を、LLM・MCPへつなぐAI Gatewayの構成図">
    <div className={styles.canvas}>
      <div className={styles.architecture}>
        <Connections />
        <div className={styles.side}>
          <section className={styles.node}>
            <div className={styles.nodeHeading}><span className={styles.nodeIcon}><Bot aria-hidden="true" /></span><h3>{copy.agents}</h3></div>
            <p>{copy.agentDescription}</p>
            <ul className={styles.agentLogos} aria-label={copy.agents}>{agentLogos.map(({ label, src }) => <li key={label} title={label}><img src={src} alt={label} width={32} height={32} /></li>)}</ul>
          </section>
          <section className={styles.node}>
            <div className={styles.nodeHeading}><span className={styles.nodeIcon}><Users aria-hidden="true" /></span><h3>{copy.organization}</h3></div>
            <p>{copy.organizationDescription}</p>
            <div className={styles.identityServices}>
              <img className={styles.oktaLogo} src="/assets/pages/platforms/acp/integrations/okta.svg" alt="Okta" title="Okta" width={48} height={48} />
              <span><KeyRound aria-hidden="true" />SSO</span>
              <span><ShieldCheck aria-hidden="true" />RBAC</span>
            </div>
          </section>
        </div>
        <section className={`${styles.gateway} theme-dark`}>
          <div className={styles.gatewayHeader}><img className={styles.gatewayLogo} src="/assets/icons/logo-AIG.svg" alt="" aria-hidden="true" width={30} height={32} /><h2 className="type-h2">AI Gateway</h2></div>
          <p className={styles.solution}>{copy.solution}</p>
          <div className={styles.modules}>{copy.modules.map((module, index) => {
            const Icon = moduleIcons[index];
            return <div className={styles.module} key={module.title}><div className={styles.moduleTop}><span className={styles.moduleIcon}><Icon aria-hidden="true" /></span><h4>{module.title}</h4></div><p>{module.body}</p></div>;
          })}</div>
          <div className={styles.roleSection}>
            <dl className={styles.roles}>{copy.roles.map((role, index) => {
              const Icon = roleIcons[index];
              return <div key={role.title}><dt><Icon aria-hidden="true" /><span>{role.title}</span></dt><dd>{role.body}</dd></div>;
            })}</dl>
          </div>
        </section>
        <div className={styles.side}>
          <section className={`${styles.node} ${styles.providerNode}`}>
            <div className={styles.nodeHeading}><span className={styles.nodeIcon}><Boxes aria-hidden="true" /></span><h3>{copy.providerLabel}</h3></div>
            <div className={styles.providerGroups}>
              <div className={styles.providerGroup}><div className={styles.providers}>{gatewayProviders.map(({ label, src }) => <div key={label} title={label}><img src={src} alt={label} width={28} height={28} /></div>)}</div><span>{copy.externalLlm}</span></div>
              <div className={styles.providerGroup}><div className={styles.localModel}><Cpu aria-hidden="true" /></div><span>{copy.localLlm}</span></div>
            </div>
          </section>
          <section className={styles.node}>
            <div className={styles.nodeHeading}><span className={styles.nodeIcon}><Server aria-hidden="true" /></span><h3>{copy.remote}</h3></div>
            <p>{copy.remoteDescription}</p>
            <div className={styles.serverRack} aria-hidden="true">{[0, 1, 2].map(i => <div key={i}><span /><i /><i /><i /></div>)}</div>
          </section>
        </div>
      </div>
    </div>
  </figure>;
}
