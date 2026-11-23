import type { Locale } from "@/constants/i18n";
import { anniversaryEdition, type anniversaryCopy } from "@/copy/anniversary";
import type { getAnniversaryHistory } from "@/copy/anniversaryHistory";
import AnniversaryArchive from "./AnniversaryArchive";
import AnniversaryAutoplay from "./AnniversaryAutoplay";
import AnniversaryMotion from "./AnniversaryMotion";
import styles from "./anniversary.module.css";

type Props = {
  copy: (typeof anniversaryCopy)[Locale];
  entries: ReturnType<typeof getAnniversaryHistory>;
};

const pageId = "anniversary-page";
// Run before the archive is parsed, so a reload cannot restore its scroll position or fragment.
const resetScrollOnReload = `(() => {
  if (performance.getEntriesByType("navigation")[0]?.type !== "reload") return;
  const restoration = history.scrollRestoration;
  history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
  const scrollToIntro = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  scrollToIntro();
  const input = new AbortController();
  const markInteraction = () => input.abort();
  for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
    window.addEventListener(event, markInteraction, { passive: true, signal: input.signal });
  }
  window.addEventListener("pageshow", () => requestAnimationFrame(() => {
    if (!input.signal.aborted && window.scrollY !== 0) scrollToIntro();
    history.scrollRestoration = restoration;
    input.abort();
  }), { once: true });
})();`;

export default function Anniversary({ copy, entries }: Props) {
  const introLines = copy.description.split("\n");
  return (
    <main className={`${styles.page} text-fg`} id={pageId}>
      <script dangerouslySetInnerHTML={{ __html: resetScrollOnReload }} />
      <section className={styles.hero} id="intro" data-station aria-labelledby="anniversary-heading">
        <div className={styles.stage} aria-hidden="true">
          <canvas className={styles.sky} />
        </div>
        <div className={`${styles.introCopy} text-white`}>
          <h1 id="anniversary-heading" className={styles.heroLogoGroup}>
            <span className="sr-only">{copy.heroTitle}</span>
            <span className={styles.heroLogo} aria-hidden="true" />
            <span lang="en" aria-hidden="true" className={`${styles.heroCaption} type-body-sm`}>
              {Array.from(anniversaryEdition, (letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </span>
          </h1>
          <p className={`${styles.introLines} mt-5 type-body-md text-fg md:mt-6 md:type-body-lg`}>
            {introLines.map((line, index) => (
              <span key={line}>{line}{index < introLines.length - 1 ? "\n" : null}</span>
            ))}
          </p>
        </div>
      </section>
      <nav className={styles.rail} aria-label={copy.years}>
        <button type="button" className="type-mono hover:text-fg focus-visible:text-fg" data-station-target="intro" lang="en" aria-current="location">
          intro
        </button>
        {entries.map(({ year }) => (
          <button type="button" className="type-mono hover:text-fg focus-visible:text-fg" key={year} data-station-target={`year-${year}`}>
            {year}
          </button>
        ))}
      </nav>
      <AnniversaryAutoplay labels={copy.autoplay} />
      <AnniversaryArchive entries={entries} label={copy.archive} />
      <AnniversaryMotion id={pageId} />
    </main>
  );
}
