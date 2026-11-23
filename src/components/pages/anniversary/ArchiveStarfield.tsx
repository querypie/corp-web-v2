import styles from "./anniversary.module.css";

const dustPeriod = 563;
const starPeriod = 719;

// Two differently sized tiles keep the quiet field continuous as the document scrolls.
function points(
  seed: number,
  width: number,
  height: number,
  count: number,
  near: boolean,
  mobileOnly = false,
) {
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  return Array.from({ length: count }, (_, i) => {
    const cx = Math.round(random() * width);
    const cy = Math.round(random() * height);
    const size = random();
    const radius = near
      ? 1.25 + size ** 2 * 0.95 + (size > 0.82 ? 0.42 : 0)
      : 0.45 + size ** 2 * 0.65;
    return (
      <circle
        key={i}
        className={[near && styles.twinklingStar, mobileOnly && styles.mobileStar]
          .filter(Boolean)
          .join(" ") || undefined}
        style={
          near
            ? {
                animationDuration: `${6 + (cx % 23) * 0.19}s`,
                animationDelay: `${-(cy % 29) * 0.31}s`,
              }
            : undefined
        }
        cx={cx}
        cy={cy}
        r={radius}
        opacity={(near ? 0.36 : 0.18) + random() * 0.34}
      />
    );
  });
}

export default function ArchiveStarfield() {
  return (
    <div className={styles.starfieldViewport} aria-hidden="true">
      <div
        className={styles.starfieldLayer}
        data-star-period={dustPeriod}
        data-star-speed={0.11}
        style={{ height: `calc(100% + ${dustPeriod}px)` }}
      >
        <svg className={styles.starfield} focusable="false">
          <defs>
            <pattern
              id="decade-dust"
              width="821"
              height={dustPeriod}
              patternUnits="userSpaceOnUse"
              fill="#a1c4df"
            >
              {points(826, 821, dustPeriod, 28, false)}
              {points(1427, 320, dustPeriod, 12, false, true)}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#decade-dust)" />
        </svg>
      </div>
      <div
        className={styles.starfieldLayer}
        data-star-period={starPeriod}
        data-star-speed={0.243}
        style={{ height: `calc(100% + ${starPeriod}px)` }}
      >
        <svg className={`${styles.starfield} ${styles.driftingStarfield}`} focusable="false">
          <defs>
            <pattern
              id="decade-stars"
              width="1063"
              height={starPeriod}
              patternUnits="userSpaceOnUse"
              fill="#c8dfef"
            >
              {points(1967, 1063, starPeriod, 10, true)}
              {points(8127, 320, starPeriod, 4, true, true)}
            </pattern>
          </defs>
          <g transform="translate(16 16)">
            <rect x="-16" y="-16" width="100%" height="100%" fill="url(#decade-stars)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
