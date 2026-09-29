import type { Locale } from "@/constants/i18n";
import { getDlpDemoUrl } from "@/features/platforms/dlpDemo";

type Props = {
  demoUrl?: string;
  locale: Locale;
};

export default function DlpDemoPage({
  locale,
  demoUrl = getDlpDemoUrl(locale),
}: Props) {
  const title = {
    en: "DLP detection demo",
    ko: "DLP 탐지 데모",
    ja: "DLP検出デモ",
  }[locale];

  return (
    <div className="fixed inset-0 z-30 overflow-hidden bg-bg pt-[calc(64px+var(--language-banner-offset,0px))]">
      <iframe
        allow="clipboard-read; clipboard-write; fullscreen"
        className="block h-full w-full border-0 bg-bg"
        referrerPolicy="strict-origin-when-cross-origin"
        src={demoUrl}
        title={title}
      />
    </div>
  );
}
