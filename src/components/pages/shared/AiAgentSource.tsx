import { AppWindow, UserRound } from "lucide-react";
import styles from "./AiAgentSource.module.css";

const agents = [
  { label: "Aru", src: "/assets/icons/icon-aru.svg" },
  { label: "Claude Code", src: "/assets/icons/llm-claude-color.svg" },
  { label: "Codex", src: "/assets/icons/llm-gpt-color.svg" },
  { label: "OpenClaw", src: "/assets/icons/agent-openclaw.svg" },
  { label: "Hermes", src: "/assets/icons/agent-hermes.webp" },
];

type Props = { label: string; applicationLabel: string; userLabel: string };

export default function AiAgentSource({ label, applicationLabel, userLabel }: Props) {
  return <div className={styles.source}>
    <h3 className="type-h3">{label}</h3>
    <ul className={styles.logos}>
      {agents.map(agent => <li key={agent.label} title={agent.label}><img src={agent.src} alt={agent.label} width={28} height={28} /></li>)}
      <li title={applicationLabel}><AppWindow role="img" aria-label={applicationLabel} /></li>
      <li title={userLabel}><UserRound role="img" aria-label={userLabel} /></li>
    </ul>
  </div>;
}
