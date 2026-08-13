import type { Locale } from "@/constants/i18n";
import type { ReactNode } from "react";
import {
  getButtonStyle,
  type ButtonSize,
  type ButtonStyle,
  type ButtonVariant,
} from "@/components/ui/Button";
import ButtonGroup from "@/components/ui/ButtonGroup";

type CtaProps = {
  actionLabel?: string;
  actionHref?: string;
  actionShape?: ButtonStyle;
  actionSize?: ButtonSize;
  compactHeading?: boolean;
  eyebrow?: ReactNode;
  description?: ReactNode;
  hideEyebrow?: boolean;
  locale?: Locale;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionVariant?: ButtonVariant;
  title?: ReactNode;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const defaultCopyByLocale = {
  en: {
    actionLabel: "Agentic AI Platform",
    eyebrow: "Stop Thinking.",
    secondaryActionHref: "https://docs.querypie.com/en/installation/querypie-acp-community-edition",
    secondaryActionLabel: "ACP Community Edition",
    title: "Start Transforming.",
  },
  ko: {
    actionLabel: "Agentic AI Platform",
    eyebrow: "생각은 멈추고.",
    secondaryActionHref: "https://docs.querypie.com/ko/installation/querypie-acp-community-edition",
    secondaryActionLabel: "ACP Community Edition",
    title: "이제 전환하세요.",
  },
  ja: {
    actionLabel: "Agentic AI Platform",
    eyebrow: "考え続けるのをやめて。",
    secondaryActionHref: "https://docs.querypie.com/ja/installation/querypie-acp-community-edition",
    secondaryActionLabel: "ACP Community Edition",
    title: "変革を始めよう。",
  },
} satisfies Record<
  Locale,
  {
    actionLabel: string;
    eyebrow: string;
    secondaryActionHref: string;
    secondaryActionLabel: string;
    title: string;
  }
>;

export default function Cta({
  actionLabel,
  actionHref = "https://app.querypie.com/",
  actionShape = "full",
  actionSize = "large",
  compactHeading = false,
  description,
  eyebrow,
  hideEyebrow = false,
  locale = "en",
  secondaryActionHref,
  secondaryActionLabel,
  secondaryActionVariant = "secondary",
  title,
}: CtaProps) {
  const defaultCopy = defaultCopyByLocale[locale];
  const resolvedActionLabel = actionLabel ?? defaultCopy.actionLabel;
  const resolvedSecondaryActionHref = secondaryActionHref ?? defaultCopy.secondaryActionHref;
  const resolvedSecondaryActionLabel = secondaryActionLabel ?? defaultCopy.secondaryActionLabel;
  // 보조 버튼이 있으면 두 버튼을 가로로 나란히 배치
  const hasSecondaryAction =
    resolvedSecondaryActionHref.length > 0 && resolvedSecondaryActionLabel.length > 0;
  const actionStyles = getButtonStyle("secondary", actionShape, actionSize, "default");
  const secondaryStyles = getButtonStyle(
    secondaryActionVariant,
    actionShape,
    actionSize,
    "default",
  );
  const heading = (
    <div className="min-w-full type-h1">
      {hideEyebrow ? null : <p className="mb-0 text-mute">{eyebrow ?? defaultCopy.eyebrow}</p>}
      <p className="mb-0 text-fg">{title ?? defaultCopy.title}</p>
    </div>
  );
  const descriptionContent = description ? (
    <p className="m-0 min-w-full type-body-md text-mute">{description}</p>
  ) : null;

  return (
    /* 페이지 하단 전환 유도용 CTA 섹션 */
    <section className="flex w-full justify-center pb-5 pt-10 md:pb-10 md:pt-20">
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-6 text-center md:gap-[30px]">
        {compactHeading && descriptionContent ? (
          <div className="flex min-w-full flex-col items-center gap-3 md:gap-5">
            {heading}
            {descriptionContent}
          </div>
        ) : (
          <>
            {heading}
            {descriptionContent}
          </>
        )}
        <ButtonGroup
          className={cx(
            "flex-wrap items-center justify-center",
            !hasSecondaryAction && "min-w-full",
          )}
        >
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
          {hasSecondaryAction ? (
            <a
              className={cx(
                secondaryStyles.container,
                secondaryStyles.text,
                "group cursor-pointer",
              )}
              href={resolvedSecondaryActionHref}
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="inline-flex items-center justify-center gap-2 text-center">
                {resolvedSecondaryActionLabel}
              </span>
            </a>
          ) : null}
        </ButtonGroup>
      </div>
    </section>
  );
}
