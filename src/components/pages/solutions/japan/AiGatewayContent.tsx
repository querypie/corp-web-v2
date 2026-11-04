import Image from "next/image";
import { Check, FileSearch, KeyRound, Layers, Minus, Network, Plug, Wallet } from "lucide-react";
import { pageContentWidthClassName } from "@/constants/layout";
import { aiGatewayContentCopy as copy } from "@/copy/aiGateway";
import SolutionSectionHeading from "./SolutionSectionHeading";
import AiGatewayToolsetDiagram from "./AiGatewayToolsetDiagram";
import styles from "./AiGatewayContent.module.css";

function Heading({ title, description }: { title: string; description: string }) {
  return <SolutionSectionHeading title={title.replaceAll("\n", " ")} description={description} />;
}

function Challenges() {
  const text = copy.challenges;
  return (
    <section className={pageContentWidthClassName}>
      <h2 className="m-0 text-center text-pretty type-h2 text-fg">{text.title.replaceAll("\n", " ")}</h2>
      <div className={styles.challengeGrid}>
        {text.items.map(item => (
          <article key={item.title} className={styles.challenge}>
            <h3 className="m-0 text-pretty type-h3 text-fg">{item.title}</h3>
            <p className="mb-0 mt-4 type-body-md text-mute">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const text = copy.features;
  const icons = { connection: Plug, routing: Network, credentials: KeyRound, tools: Layers, budget: Wallet, audit: FileSearch };

  return (
    <section className={styles.band}>
      <div className={`${pageContentWidthClassName} ${styles.section}`}>
        <Heading {...text} />
        <div className={styles.featureGrid}>
          {text.cards.map(card => {
            const Icon = icons[card.id as keyof typeof icons];
            return (
              <article className={styles.feature} key={card.id}>
                <Icon aria-hidden="true" />
                <h3 className="m-0 text-pretty type-h3 text-fg">{card.title}</h3>
                <p className="mb-0 mt-4 type-body-md text-mute">{card.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AccessPolicy() {
  const text = copy.policy;
  return (
    <section className={`${pageContentWidthClassName} ${styles.section}`}>
      <Heading {...text} />
      <div className={styles.accessLayout}>
        <div className={styles.roleGrid}>
          {text.roles.map(role => (
            <article className={styles.roleCard} key={role.code}>
              <h3 className="m-0 text-pretty type-h3 text-fg">{role.name}</h3>
              <p className="mb-0 mt-3 type-body-md text-mute">{role.body}</p>
              <Image className={styles.roleIllustration} src={`/assets/pages/solutions/ai-gateway/${role.code}.webp`} alt="" width={660} height={440} sizes="120px" />
            </article>
          ))}
        </div>
        <div className={styles.scopePanel}>
          <h3 className="m-0 type-h3 text-fg">{text.scopeTitle}</h3>
          <table className={styles.scopeTable}>
            <caption className="sr-only">{text.scopeTitle}</caption>
            <thead><tr>{text.columns.map(column => <th className="type-body-sm text-mute" scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{text.roles.map(role => (
              <tr key={role.code}>
                <th scope="row" className="type-body-sm text-fg">{role.code}</th>
                {[role.organization, role.project].map((available, index) => (
                  <td key={index}>
                    <span className={available ? styles.scopeAllowed : styles.scopeEmpty}>
                      {available ? <Check aria-hidden="true" /> : <Minus aria-hidden="true" />}
                      <span className="sr-only">{available ? text.assigned : text.unassigned}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function McpToolset() {
  const text = copy.toolset;
  return (
    <section className={styles.band}>
      <div className={`${pageContentWidthClassName} ${styles.section}`}>
        <Heading {...text} />
        <AiGatewayToolsetDiagram />
      </div>
    </section>
  );
}

export default function AiGatewayContent() {
  return <><Challenges /><Features /><AccessPolicy /><McpToolset /></>;
}
