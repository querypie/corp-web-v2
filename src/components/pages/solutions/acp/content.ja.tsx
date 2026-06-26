import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/common/Cta";
import FeatureMediaList from "@/components/sections/common/FeatureMediaList";
import type { Locale } from "@/constants/i18n";
import AcpAiPackSection from "./AcpAiPackSection";
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
      "QueryPie DACは、さまざまなクラウドエコシステムをシームレスにつなぎ、クラウド時代のデータ保護のために設計されています。",
      "機密データや個人情報を自動で識別し、重要なデータ資産を堅牢に保護します。",
    ],
    imageAlt: "データベースアクセス制御プレビュー",
    title: ["DAC -", "Database Access Control"],
    videoSrc: "/solutions/acp/acp-dac.mp4",
  },
  {
    body: [
      "QueryPie SACは、AWS、GCP、Azure上のクラウドインスタンス保護に加え、オンプレミス環境にも対応します。",
      "管理者はユーザーコマンドを監視し、セッションを再生することで、セキュリティと管理の可視性を高められます。",
    ],
    imageAlt: "システムアクセス制御プレビュー",
    reverse: true,
    title: ["SAC -", "System Access Control"],
    videoSrc: "/solutions/acp/acp-sac.mp4",
  },
  {
    body: [
      "QueryPie KACはKubernetes APIを保護するソリューションで、AWS EKSなどのクラウドインフラやオンプレミスクラスターを一元管理できます。",
      "管理者はアクセス権限の管理、APIリクエストの監視、コンテナコマンド実行の再生を行えます。",
    ],
    imageAlt: "Kubernetesアクセス制御プレビュー",
    title: ["KAC -", "Kubernetes Access Control"],
    videoSrc: "/solutions/acp/acp-kac.mp4",
  },
  {
    body: [
      "QueryPie WACは、管理者ポータルやSaaSプラットフォームを含むWebアプリケーションへのアクセスを保護し、操作を記録します。",
      "ログやスクリーンショットを取得し、機密データをマスキングし、ファイル転送などの操作を制御します。",
    ],
    imageAlt: "Webアクセス制御プレビュー",
    reverse: true,
    title: ["WAC -", "Web Access Control"],
    videoSrc: "/solutions/acp/acp-wac.mp4",
  },
  {
    body: [
      "リアルタイムのリスク検知、ポリシーベースの権限、機密データのマスキングを、ひとつの統合ゲートウェイで提供します。",
      "単なるブロックにとどまらず、状況とコンプライアンス要件に適応するインテリジェントなアクセス制御を実現します。",
    ],
    imageAlt: "マネージドアクセス制御プレビュー",
    title: ["MAC -", "MCP Access Controller"],
    videoSrc: "/solutions/acp/acp-mac.mp4",
  },
];

export default function AcpJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
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
        <FeatureMediaList items={featureItems} />
      </div>

      <div className="-mx-5 md:-mx-10">
        <AcpAiPackSection locale={locale} />
      </div>

      <div>
        <AcpIntegrationSection locale={locale} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
