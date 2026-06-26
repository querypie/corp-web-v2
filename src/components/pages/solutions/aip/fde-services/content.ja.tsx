import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Hero from "@/components/pages/solutions/aip/Hero";
import Cta from "@/components/sections/Cta";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "FDEサービス",
  description:
    "専任エンジニア（FDE）が業務フローを特定し、カスタムAIエージェントを構築してAIを成果へつなげます。",
  keywords: ["FDE Services", "Forward Deployed Engineers", "AI agents"],
} as const;

const featureItems = [
  {
    title: ["課題の発見"],
    body: [
      "AI専門家が変革を妨げる課題を特定します。時間とコストが膨らむ前に課題を早期に把握します。",
    ],
    imageAlt: "AI変革の課題発見プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/find-problems.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["計画の策定"],
    body: [
      "事業に合ったAIアプローチを専門家と設計します。複雑な課題を明確で実行可能なアクションプランへ落とし込みます。",
    ],
    imageAlt: "AI変革計画プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/make-plans.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["カスタムAIエージェント構築"],
    body: [
      "初期アイデアから完成したプロダクトまでAIエージェント構築を支援します。すべてのステップをガイドします。",
    ],
    imageAlt: "カスタムAIエージェント構築プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/build-custom-ai-agents.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["機能するAIの実現"],
    body: [
      "AIが本番環境で機能するよう継続的に支援します。専門家のガイドにより、AI変革が実際に成功するよう支援します。",
    ],
    imageAlt: "本番AI運用プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/make-ai-work.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
];

export default function FdeServicesJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                AI変革の専門家が伴走する
                <br className="hidden md:block" /> FDEサービス
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              組織に入り込む専任エンジニア（FDE）が、戦略、開発、本番運用までAI変革を
              包括的に支援し、AI施策を確かな成果へつなげます。
            </p>
          </header>
        </section>
        <Hero
          imageAlt="FDE Services製品プレビュー"
          imageSrc="/solutions/aip/fde-services/fde.svg"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
