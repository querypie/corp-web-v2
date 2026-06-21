import type { Locale } from "@/constants/i18n";
import type { ReactNode } from "react";

type CtaProps = {
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  locale?: Locale;
  title?: ReactNode;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Cta({
  actionLabel,
  actionHref = "https://app.querypie.com/",
  className,
  description = "Sign up in seconds and secure your 14-day free trial now.",
  eyebrow = "Stop Thinking.",
  locale = "en",
  title = "Start Transforming.",
}: CtaProps) {
  const resolvedActionLabel =
    actionLabel ??
    (
      {
        en: "Make It Happen",
        ko: "지금 실현하기",
        ja: "今すぐ実現する",
      } satisfies Record<Locale, string>
    )[locale];

  return (
    /* 페이지 하단 전환 유도용 CTA 섹션 */
    <section className={cx("flex w-full justify-center pt-14 md:pt-20", className)}>
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-6 text-center md:gap-[30px]">
        <div className="min-w-full type-h1">
          <p className="mb-0 text-mute">{eyebrow}</p>
          <p className="mb-0 text-fg">{title}</p>
        </div>
        <p className="m-0 min-w-full type-body-md text-mute">
          {description}
        </p>
        <a
          className="pressable inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-secondary px-5 type-body-md text-fg hover:bg-[#343434] hover:text-fg"
          href={actionHref}
          rel="noreferrer noopener"
          target="_blank"
        >
          <span className="inline-flex items-center justify-center gap-2 text-center">
            {resolvedActionLabel}
          </span>
        </a>
      </div>
    </section>
  );
}
