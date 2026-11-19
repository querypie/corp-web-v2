"use client";

import { Fragment } from "react";
import Image from "next/image";
import { anniversaryHighlightedNames } from "@/copy/anniversary";
import type { getAnniversaryHistory } from "@/copy/anniversaryHistory";
import styles from "./anniversary.module.css";

const highlightedNamePattern = new RegExp(
  `((?<![A-Za-z0-9])(?:${anniversaryHighlightedNames
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?![A-Za-z0-9]))`,
  "g",
);

function HighlightedTitle({ text, plainNames }: { text: string; plainNames?: readonly string[] }) {
  return text.split(highlightedNamePattern).map((part, index) =>
    index % 2 === 0 || plainNames?.includes(part) ? part : (
      <span key={index} className={styles.productName}>{part}</span>
    ),
  );
}

export default function AnniversaryArchive({ entries, label }: {
  entries: ReturnType<typeof getAnniversaryHistory>;
  label: string;
}) {
  return (
    <section id="archive" className={styles.archive} aria-label={label}>
      {entries.map(({ year, milestones }) => (
        <Fragment key={year}>
          <div className={styles.yearDivider}>
            <h2 id={`year-${year}`} className="scroll-mt-20 font-mono type-body-md tabular-nums text-fg" data-station>
              <time dateTime={String(year)}>{year}</time>
            </h2>
          </div>
          {milestones.map((milestone) => (
            <article className={styles.entry} data-align={milestone.align} key={milestone.id}>
              <header className={styles.entryHeader}>
                <h3 className="type-h1 text-fg">
                  <HighlightedTitle text={milestone.title} plainNames={milestone.plainTitleNames} />
                </h3>
              </header>
              <div className={styles.entryBody}>
                {milestone.photo && (
                  <figure className={styles.entryPhoto}>
                    <Image
                      className={styles.entryImage}
                      src={milestone.photo.src}
                      width={milestone.photo.width}
                      height={milestone.photo.height}
                      sizes="(max-width: 767px) min(520px, calc(100vw - 48px)), 340px"
                      loading="lazy"
                      alt={milestone.photo.alt}
                    />
                  </figure>
                )}
                <div className={styles.entryCopy}>
                  <p className="type-body-md text-mute">{milestone.body}</p>
                </div>
              </div>
            </article>
          ))}
        </Fragment>
      ))}
    </section>
  );
}
