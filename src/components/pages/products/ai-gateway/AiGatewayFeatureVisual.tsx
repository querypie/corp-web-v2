import { ArrowRight, Check, CodeXml, FileText, KeyRound, Layers, LockKeyhole, MessageSquare, ShieldCheck, X } from "lucide-react";
import type { Locale } from "@/constants/i18n";
import { aiGatewayCopy } from "@/copy/aiGatewayLocalized";
import IntegrationBrandIcon from "@/components/sections/common/IntegrationBrandIcon";
import styles from "@/components/pages/shared/FeatureVisual.module.css";

type VisualProps = { copy: typeof aiGatewayCopy.en.features.visuals };
const providers = [
  { name: "OpenAI", src: "/assets/icons/llm-gpt-color.svg" },
  { name: "Anthropic", src: "/assets/icons/llm-claude-color.svg" },
  { name: "Gemini", src: "/assets/icons/llm-gemini-color.svg" },
];
const tools = [
  { id: "github", name: "GitHub", Icon: CodeXml },
  { id: "slack", name: "Slack", Icon: MessageSquare },
  { id: "notion", name: "Notion", Icon: FileText },
];

function Connection({ copy }: VisualProps) {
  return <div className={styles.network}>
    <svg className={styles.wires} viewBox="0 0 300 180" fill="none"><path d="M50 54 C50 99 150 78 150 120 M150 54 V120 M250 54 C250 99 150 78 150 120" /></svg>
    <div className={styles.providers}>{providers.map(provider => <div className={styles.logoTile} key={provider.name}><img src={provider.src} alt="" width={28} height={28} /></div>)}</div>
    <div className={`${styles.pill} ${styles.api}`}><CodeXml /><span>{copy.api}</span><span className={styles.statusDot} /></div>
  </div>;
}

function Routing({ copy }: VisualProps) {
  return <div className={styles.routing}>
    <div className={styles.alias}><CodeXml /><small>{copy.alias}</small><span>{copy.aliasValue}</span></div>
    <ArrowRight className={styles.arrow} />
    <div className={styles.destinations}>
      {providers.slice(0, 2).map((provider, index) => <div className={`${styles.destination} ${index === 0 ? styles.active : ""}`} key={provider.name}>
        <img src={provider.src} alt="" width={22} height={22} /><div><span>{provider.name}</span><small>{index === 0 ? copy.active : copy.standby}</small></div>{index === 0 ? <Check /> : null}
      </div>)}
    </div>
  </div>;
}

function Credentials({ copy }: VisualProps) {
  return <div className={styles.credentials}>
    <div className={styles.vault}>
      <div className={styles.panelHeading}><LockKeyhole /><span>{copy.vault}</span></div>
      {providers.slice(0, 2).map(provider => <div className={styles.secret} key={provider.name}><img src={provider.src} width={19} height={19} alt="" /><span>•••• •••• ••••</span><ShieldCheck /></div>)}
    </div>
    <div className={`${styles.pill} ${styles.key}`}><KeyRound /><span>{copy.key}</span><Check /></div>
    <span className={styles.protected}>{copy.protected}</span>
  </div>;
}

function Tools({ copy }: VisualProps) {
  return <div className={styles.network}>
    <svg className={styles.wires} viewBox="0 0 300 180" fill="none"><path d="M50 67 C50 105 150 90 150 132 M150 67 V132 M250 67 C250 105 150 90 150 132" /></svg>
    <div className={styles.toolSources}>{tools.map(({ id, name, Icon }, index) => <div className={styles.toolTile} key={id}>
      <IntegrationBrandIcon name={name} className="h-6 w-6" />
      <span><Icon />{copy.tools[index]}</span><Check className={styles.toolCheck} />
    </div>)}</div>
    <div className={`${styles.pill} ${styles.toolset}`}><Layers /><span>{copy.toolset}</span><span className={styles.count}>3</span></div>
  </div>;
}

function Budget({ copy }: VisualProps) {
  return <div className={styles.dashboard}>
    <div className={styles.panelHeading}><span>{copy.budget}</span><small>{copy.example}</small></div>
    <div className={styles.amount}><strong>{copy.budgetValue}</strong><span>{copy.budgetLimit}</span><small>{copy.budgetUsage}</small></div>
    <div className={styles.meter}><span /></div>
    <div className={styles.chart}>{[22, 34, 28, 45, 38, 55, 43, 61, 48, 68, 58, 76].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}<div className={styles.limit} /></div>
  </div>;
}

function Audit({ copy }: VisualProps) {
  return <div className={styles.log}>
    <div className={styles.panelHeading}><span className={styles.statusDot} /><span>{copy.logs}</span><small>{copy.example}</small></div>
    <div className={styles.logHeader}>{copy.logColumns.map(label => <span key={label}>{label}</span>)}</div>
    {copy.logRows.map(row => <div className={styles.logRow} key={row.target}>
      <span>{row.target}</span><span className={row.allowed ? styles.allowed : styles.denied}>{row.allowed ? <Check /> : <X />}{row.allowed ? copy.allowed : copy.denied}</span><span>{row.duration}</span>
    </div>)}
  </div>;
}

const visuals = { connection: Connection, routing: Routing, credentials: Credentials, tools: Tools, budget: Budget, audit: Audit };

export type AiGatewayFeatureId = keyof typeof visuals;

export default function AiGatewayFeatureVisual({ id, locale = "ja" }: { id: AiGatewayFeatureId; locale?: Locale }) {
  const Visual = visuals[id];
  return <div className={styles.visual} aria-hidden="true"><Visual copy={aiGatewayCopy[locale].features.visuals} /></div>;
}
