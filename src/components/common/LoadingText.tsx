import type { CSSProperties } from "react";

type LoadingTextTone = "dark" | "light";

type LoadingTextProps = {
  className?: string;
  text: string;
  tone?: LoadingTextTone;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const toneStyles: Record<LoadingTextTone, CSSProperties> = {
  dark: {
    ["--loading-text-base" as string]: "rgba(0, 0, 0, 0.68)",
    ["--loading-text-highlight" as string]: "rgba(255, 255, 255, 0.72)",
  },
  light: {
    ["--loading-text-base" as string]: "rgba(241, 241, 242, 0.52)",
    ["--loading-text-highlight" as string]: "rgba(255, 255, 255, 0.96)",
  },
};

export default function LoadingText({
  className,
  text,
  tone = "light",
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
