import type { Locale } from "@/constants/i18n";
import { anniversaryEdition, type anniversaryCopy } from "@/copy/anniversary";
import type { getAnniversaryHistory } from "@/copy/anniversaryHistory";
import AnniversaryArchive from "./AnniversaryArchive";
import AnniversaryMotion from "./AnniversaryMotion";
import styles from "./anniversary.module.css";

type Props = {
  copy: (typeof anniversaryCopy)[Locale];
  entries: ReturnType<typeof getAnniversaryHistory>;
};

const pageId = "anniversary-page";
export default function Anniversary({ copy, entries }: Props) {
  return (
    <main className={`${styles.page} text-fg`} id={pageId}>
      <section className={styles.hero} id="intro" data-station aria-labelledby="anniversary-heading">
        <div className={styles.stage} aria-hidden="true">
          <canvas className={styles.sky} />
        </div>
        <div className={`${styles.introCopy} text-white`}>
          <h1 id="anniversary-heading" className={styles.heroLogoGroup}>
            <span className="sr-only">{copy.heroTitle}</span>
            <span className={styles.heroLogo} aria-hidden="true">
              <span className={styles.heroLogoFlare} />
            </span>
            <span lang="en" aria-hidden="true" className={`${styles.heroCaption} type-body-sm`}>
              {Array.from(anniversaryEdition, (letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </span>
          </h1>
          <p className={`${styles.desktopDescription} mt-6 hidden whitespace-pre-line type-body-lg text-fg md:block`}>
            {copy.description}
          </p>
          <p className="mt-5 whitespace-pre-line type-body-md text-fg md:hidden">
            {copy.mobileDescription}
          </p>
        </div>
      </section>
      <nav className={styles.rail} aria-label={copy.years}>
        <a className="type-mono text-mute hover:text-fg" href="#intro" lang="en" aria-current="location">
          intro
        </a>
        {entries.map(({ year }) => (
          <a className="type-mono text-mute hover:text-fg" key={year} href={`#year-${year}`}>
            {year}
          </a>
        ))}
      </nav>
      <AnniversaryArchive entries={entries} label={copy.archive} />
      <AnniversaryMotion id={pageId} />
    </main>
  );
}
