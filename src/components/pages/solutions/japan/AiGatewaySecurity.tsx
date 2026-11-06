import type { Locale } from "@/constants/i18n";
import { pageContentWidthClassName } from "@/constants/layout";
import { aiGatewaySecurityCopy } from "@/copy/aiGatewaySecurity";
import SolutionSectionHeading from "./SolutionSectionHeading";
import AiGatewayAcpDiagram from "./AiGatewayAcpDiagram";
import contentStyles from "./AiGatewayContent.module.css";
import styles from "./AiGatewaySecurity.module.css";

export default function AiGatewaySecurity({ locale }: { locale: Locale }) {
  const { dlp, acp } = aiGatewaySecurityCopy[locale];
  return <>
    <section className={`${pageContentWidthClassName} ${contentStyles.section}`}>
      <SolutionSectionHeading title={dlp.title} description={dlp.description} layout="split" />
      <div className={styles.dlpLayout}>
        <ol className={styles.points}>{dlp.points.map((point, index) => {
          return <li className={styles.point} key={point.title}>
            <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div><h3 className="m-0 type-h3 text-fg">{point.title}</h3><p className="mb-0 mt-3 type-body-md text-mute">{point.body}</p></div>
          </li>;
        })}</ol>
        <figure className={styles.scanCanvas} aria-label={dlp.label}>
          <div className={styles.scanCard}>
            <table className={styles.results}>
              <caption className="sr-only">{dlp.scan}</caption>
              <thead><tr>{dlp.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
              <tbody>{dlp.rows.map(row => <tr key={row.user}>
                <th scope="row">{row.user}</th>
                <td><span className={`${styles.score} ${Number(row.score) >= 0.9 ? styles.highScore : ""}`}>{row.category} <b>{row.score}</b></span><p>{row.preview}</p></td>
                <td className={styles.pattern}>{row.pattern || "—"}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <figcaption className="sr-only">{dlp.example}. {dlp.scoreNote}</figcaption>
        </figure>
      </div>
    </section>
    <section className={contentStyles.band}>
      <div className={`${pageContentWidthClassName} ${contentStyles.section}`}>
        <SolutionSectionHeading title={acp.title} description={acp.description} layout="split" />
        <AiGatewayAcpDiagram locale={locale} />
      </div>
    </section>
  </>;
}
