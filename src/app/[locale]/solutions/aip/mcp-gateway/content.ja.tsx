import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "MCP Gateway",
  description:
    "AIエージェントをエンタープライズのツールとデータに接続する、ガバナンス対応MCPゲートウェイです。",
  keywords: ["MCP Gateway", "Model Context Protocol", "AI governance"],
} as const;

const featureItems = [
  {
    title: ["Smart Edge", "Tunneling"],
    body: [
      "セキュアなトンネリングで内部システムへ接続します。",
      "ファイアウォールで保護されたリソースに",
      "既存のセキュリティ構成を変えずにアクセスできます。",
    ],
    imageAlt: "スマートエッジトンネリングプレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Easy MCP", "Proxy Access"],
    body: [
      "セキュアなローカルMCPプロキシを通じて、",
      "外部ツールからMCPプリセットを利用できます。",
      "Cursor IDE、Claude Desktop、Windsurfに対応します。",
    ],
    imageAlt: "MCPプロキシアクセスプレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Org-Level MCP", "Management"],
    body: [
      "細かな権限でMCPツールへのアクセスを制御します。",
      "有効化、無効化、ガバナンスを",
      "組織単位で一元管理できます。",
    ],
    imageAlt: "組織レベルMCP管理プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Audit", "Logging"],
    body: [
      "組織全体のすべてのイベントを追跡します。",
      "ユーザー操作とシステム変更を監視し、",
      "セキュリティとコンプライアンスを支援します。",
    ],
    imageAlt: "監査ログプレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Data Loss", "Prevention"],
    body: [
      "機密情報がAI会話に入ることを",
      "自動的にブロックします。",
      "APIキーや社外秘情報を保護します。",
    ],
    imageAlt: "データ損失防止プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
];

export default function McpGatewayJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">MCP Hub</span>
              <span className="block">That Connects Everything</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Single platform centrally managing all MCP servers and tools—no fragmentation, no
            complexity, no limits. Streamline AI workflows across your entire tech stack while we
            handle the complexity behind the scenes.
          </p>
        </header>
      </section>

      <FeatureSection items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
