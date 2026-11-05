import { pageContentWidthClassName } from "@/constants/layout";
import type { Locale } from "@/constants/i18n";
import { aiGatewayCopy } from "@/copy/aiGatewayLocalized";
import SolutionSectionHeading from "./SolutionSectionHeading";
import AiGatewaySecurity from "./AiGatewaySecurity";
import AiGatewayFeatureVisual, { type AiGatewayFeatureId } from "./AiGatewayFeatureVisual";
import styles from "./AiGatewayContent.module.css";

function Heading({ title, description }: { title: string; description: string }) {
  return <SolutionSectionHeading title={title} description={description} layout="split" />;
}

function Challenges({ locale }: { locale: Locale }) {
  const text = aiGatewayCopy[locale].challenges;
  return (
    <section className={pageContentWidthClassName}>
      <Heading {...text} />
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

function Features({ locale }: { locale: Locale }) {
  const text = aiGatewayCopy[locale].features;

  return (
    <section className={styles.band}>
      <div className={`${pageContentWidthClassName} ${styles.section}`}>
        <Heading {...text} />
        <div className={styles.featureGrid}>
          {text.cards.map(card => {
            return (
              <article className={styles.feature} key={card.id}>
                <AiGatewayFeatureVisual id={card.id as AiGatewayFeatureId} locale={locale} />
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

export default function AiGatewayContent({ locale = "ja" }: { locale?: Locale }) {
  return <><Challenges locale={locale} /><Features locale={locale} /><AiGatewaySecurity locale={locale} /></>;
}
