import { Check, Circle, CodeXml, Ellipsis, FileText, Files, GitBranch, Layers, MessageSquare, Search, Users } from "lucide-react";
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
        <svg className={styles.connections} viewBox="0 0 960 380" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M269 70 C312 70 306 150 346 150" />
          <path d="M269 270 C312 270 306 230 346 230" />
          <path d="M691 70 C648 70 654 150 614 150" />
          <path d="M691 270 C648 270 654 230 614 230" />
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
          <span className={`${styles.port} ${styles.portTopLeft}`} aria-hidden="true" />
          <span className={`${styles.port} ${styles.portBottomLeft}`} aria-hidden="true" />
          <Layers className={styles.layers} aria-hidden="true" />
          <strong className="type-h2">MCP</strong>
          <span className="type-body-md">{text.endpoint}</span>
          <span className={`${styles.port} ${styles.portTopRight}`} aria-hidden="true" />
          <span className={`${styles.port} ${styles.portBottomRight}`} aria-hidden="true" />
        </div>
      </div>
    </figure>
  );
}
