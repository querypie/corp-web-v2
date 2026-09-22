import type { Locale } from "@/constants/i18n";

export const notFoundCopy = {
  en: {
    title: "404",
    ctaLabel: "Back to home",
    messageLines: [
      "The page you’re looking for has wandered off, but don’t worry!",
      "Let’s get you back on track.",
    ],
  },
  ko: {
    title: "404",
    ctaLabel: "홈으로 돌아가기",
    messageLines: [
      "찾으시는 페이지가 다른 곳으로 이동했거나 사라졌습니다.",
      "홈으로 돌아가 다시 시작해 보세요.",
    ],
  },
  ja: {
    title: "404",
    ctaLabel: "ホームへ戻る",
    messageLines: [
      "お探しのページは移動したか、見つかりませんでした。",
      "ホームに戻ってもう一度お試しください。",
    ],
  },
} satisfies Record<Locale, { title: string; ctaLabel: string; messageLines: string[] }>;
