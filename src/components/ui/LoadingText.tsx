import type { CSSProperties } from "react";

type LoadingTextTone = "primary" | "theme";

type LoadingTextProps = {
  className?: string;
  text: string;
  tone?: LoadingTextTone;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const toneStyles: Record<LoadingTextTone, CSSProperties> = {
  primary: {
    ["--loading-text-base" as string]: "color-mix(in srgb, var(--color-bg) 68%, transparent)",
    ["--loading-text-highlight" as string]: "var(--color-bg)",
  },
  theme: {
    ["--loading-text-base" as string]: "color-mix(in srgb, var(--color-fg) 52%, transparent)",
    ["--loading-text-highlight" as string]: "var(--color-fg)",
  },
};

export default function LoadingText({
  className,
  text,
  tone = "theme",
}: LoadingTextProps) {
  return (
    <span
      aria-label={text}
      className={cx("loading-text inline-block whitespace-nowrap", className)}
      data-text={text}
      style={toneStyles[tone]}
    >
      {text}
    </span>
  );
}
