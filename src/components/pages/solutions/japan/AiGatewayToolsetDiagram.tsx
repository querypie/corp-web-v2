import { Check, Circle, CodeXml, Ellipsis, FileText, Files, GitBranch, MessageSquare, Search, Users } from "lucide-react";
import { aiGatewayContentCopy } from "@/copy/aiGateway";
import styles from "./AiGatewayToolsetDiagram.module.css";

const toolIcons = [
  [CodeXml, GitBranch, Ellipsis],
  [MessageSquare, Users, Ellipsis],
  [FileText, Search, Ellipsis],
  [Files, Users, Ellipsis],
];

export default function AiGatewayToolsetDiagram() {
  const text = aiGatewayContentCopy.toolset;
  return (
    <figure className={styles.diagram} aria-label={text.diagramLabel}>
      <div className={styles.canvas}>
        <svg className={styles.connections} viewBox="0 0 1000 380" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M300 90 C346 90 346 152 392 152" />
          <path d="M300 290 C346 290 346 228 392 228" />
          <path d="M700 90 C654 90 654 152 608 152" />
          <path d="M700 290 C654 290 654 228 608 228" />
        </svg>
        <svg className={`${styles.connections} ${styles.mobileConnections}`} viewBox="0 0 400 620" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M96 180 C96 205 170 204 170 229" />
          <path d="M304 180 C304 205 230 204 230 229" />
          <path d="M96 440 C96 415 170 416 170 391" />
          <path d="M304 440 C304 415 230 416 230 391" />
        </svg>
        {text.sources.map((source, sourceIndex) => (
          <div className={`${styles.source} ${styles[source.id]}`} key={source.id}>
            <div className={styles.sourceHeading}>
              <img src={`/assets/pages/platforms/acp/integrations/${source.id}.svg`} width={28} height={28} alt="" />
              <h3 className="m-0 type-body-md text-fg">{source.name}</h3>
            </div>
            <ul className={styles.tools}>
              {source.tools.map((tool, toolIndex) => {
                const Icon = toolIcons[sourceIndex][toolIndex];
                return (
                  <li className={toolIndex === 0 ? styles.selected : styles.option} key={tool}>
                    <Icon aria-hidden="true" />
                    <span className="type-body-sm">{tool}</span>
                    {toolIndex === 0 ? <Check className={styles.check} aria-hidden="true" /> : <Circle className={styles.circle} aria-hidden="true" />}
                    <span className="sr-only">{toolIndex === 0 ? text.selected : text.notSelected}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className={styles.endpoint}>
          <span className={`${styles.connector} ${styles.connectorTopLeft}`} aria-hidden="true" />
          <span className={`${styles.connector} ${styles.connectorBottomLeft}`} aria-hidden="true" />
          <span className={`${styles.connector} ${styles.connectorTopRight}`} aria-hidden="true" />
          <span className={`${styles.connector} ${styles.connectorBottomRight}`} aria-hidden="true" />
          <img className={styles.mcpIcon} src="/assets/pages/platforms/acp/diagram/target-mcp.svg" width={32} height={32} alt="" />
          <strong className="type-h2">MCP</strong>
          <span className="type-body-md">{text.endpoint}</span>
        </div>
      </div>
    </figure>
  );
}
