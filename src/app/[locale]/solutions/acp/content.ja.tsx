import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";
import AcpDiagram from "./AcpDiagram";
import AcpIntegrationSection from "./AcpIntegrationSection";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie Access Control Platform (ACP)",
  description:
    "QueryPie ACPは、データとインフラ全体のアクセス管理を提供するアクセス制御プラットフォームです。",
  keywords: ["QueryPie ACP", "Access Control Platform", "ACP", "access control"],
} as const;

const featureItems = [
  {
    body: [
      "統合ポリシー、クエリ単位のガバナンス、",
      "マスキング、完全な監査ログにより、",
      "開発者の作業を妨げずにDBアクセスを制御します。",
    ],
    imageAlt: "データベースアクセス制御プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["すべてのDB", "セッションを統制"],
  },
  {
    body: [
      "Webターミナル、承認ワークフロー、セッション録画、",
      "Policy as Codeによる制御で、特権ユーザーの",
      "システムアクセスを安全に管理します。",
    ],
    imageAlt: "システムアクセス制御プレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["特権システム", "アクセスを保護"],
  },
  {
    body: [
      "複数のKubernetesクラスターに一貫したRBACを適用し、",
      "APIアクティビティとコンテナセッションを",
      "中央のアクセス制御レイヤーで記録・管理します。",
    ],
    imageAlt: "Kubernetesアクセス制御プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Kubernetesの", "アクセス統制を統合"],
  },
  {
    body: [
      "SaaSと社内Webアプリケーションを中央ポリシー下に置き、",
      "監視、ウォーターマーク、Just-in-time権限で",
      "ビジネスアプリへのアクセスを制御します。",
    ],
    imageAlt: "Webアクセス制御プレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["ビジネスWebアプリ", "アクセスを制御"],
  },
];

export default function AcpJASolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">Access Control Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                QueryPie ACPは、データベース、システム、Kubernetes、Webアプリケーション全体の
                アクセス制御を一元化し、最小権限の付与、特権操作の監視、監査に対応できる
                ガバナンスを複雑なエンタープライズ環境でも維持できるよう支援します。
              </p>
            </header>
          </section>
        </div>

        <div>
          <AcpDiagram locale={locale} />
        </div>
      </div>

      <div>
        <FeatureSection items={featureItems} />
      </div>

      <div className="-mx-5 md:-mx-10">
        <AcpIntegrationSection locale={locale} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
