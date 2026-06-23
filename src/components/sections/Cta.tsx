import type { Locale } from "@/constants/i18n";
import type { ReactNode } from "react";
import { getButtonStyle, type ButtonSize } from "../common/Button";

type CtaProps = {
  actionLabel?: string;
  actionHref?: string;
  actionSize?: ButtonSize;
  className?: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  locale?: Locale;
  title?: ReactNode;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const defaultCopyByLocale = {
  en: {
    actionLabel: "Make It Happen",
    description: "Sign up in seconds and secure your 14-day free trial now.",
    eyebrow: "Stop Thinking.",
    title: "Start Transforming.",
  },
  ko: {
    actionLabel: "지금 실현하기",
    description: "지금 가입하고 14일 무료 체험을 바로 시작하세요.",
    eyebrow: "생각은 멈추고.",
    title: "이제 전환하세요.",
  },
  ja: {
    actionLabel: "今すぐ実現する",
    description: "今すぐ登録して、14日間の無料トライアルを始めましょう。",
    eyebrow: "考え続けるのをやめて。",
    title: "変革を始めよう。",
  },
} satisfies Record<
  Locale,
  {
    actionLabel: string;
    description: string;
    eyebrow: string;
    title: string;
  }
>;

export default function Cta({
  actionLabel,
  actionHref = "https://app.querypie.com/",
  actionSize = "large",
  className,
  description,
  eyebrow,
  locale = "en",
  title,
}: CtaProps) {
  const defaultCopy = defaultCopyByLocale[locale];
  const resolvedActionLabel = actionLabel ?? defaultCopy.actionLabel;
  const actionStyles = getButtonStyle("secondary", "full", actionSize, "default");

  return (
    /* 페이지 하단 전환 유도용 CTA 섹션 */
    <section className={cx("flex w-full justify-center pt-14 md:pt-20", className)}>
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-6 text-center md:gap-[30px]">
        <div className="min-w-full type-h1">
          <p className="mb-0 text-mute">{eyebrow ?? defaultCopy.eyebrow}</p>
          <p className="mb-0 text-fg">{title ?? defaultCopy.title}</p>
        </div>
        <p className="m-0 min-w-full type-body-md text-mute">
          {description ?? defaultCopy.description}
        </p>
        <a
          className={cx(actionStyles.container, actionStyles.text, "group cursor-pointer")}
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
