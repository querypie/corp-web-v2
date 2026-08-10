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
  title: "MCP Gateway",
  description:
    "AIエージェントをエンタープライズのツールとデータに接続する、ガバナンス対応MCPゲートウェイです。",
  keywords: ["MCP Gateway", "Model Context Protocol", "AI governance"],
} as const;

const featureItems = [
  {
    title: ["スマートエッジトンネリング"],
    body: [
      "セキュアなトンネリング技術で内部システムへ接続します。ファイアウォールで保護されたリソースに、既存のセキュリティ構成を変えずにアクセスできます。",
    ],
    imageAlt: "スマートエッジトンネリングプレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_tunneling.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["簡単なMCPプロキシアクセス"],
    body: [
      "セキュアなローカルMCPプロキシを通じて外部ツールからMCPプリセットを利用できます。カスタムプリセットをCursor IDE、Claude Desktop、Windsurfで直接利用できます。",
    ],
    imageAlt: "MCPプロキシアクセスプレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_mcpproxy.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["組織レベルのMCP管理"],
    body: [
      "細かな権限で誰がどのMCPツールにアクセスできるかを制御します。AIツール利用の有効化、無効化、ガバナンスを組織全体で一元管理できます。",
    ],
    imageAlt: "組織レベルMCP管理プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_mcpmanagement.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["監査ログ"],
    body: [
      "組織全体のすべてのイベントを完全な可視性で追跡します。ユーザー操作とシステム変更を監視し、セキュリティとコンプライアンスを支援します。",
    ],
    imageAlt: "監査ログプレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_audit.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["データ損失防止 (DLP)"],
    body: [
      "機密情報がAI会話に入ることを自動的にブロックします。クレジットカード、SSN、APIキー、機密情報の露出を即座に防ぎます。",
    ],
    imageAlt: "データ損失防止プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_dlp.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
];

export default function McpGatewayJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                すべてをつなぐ
                <br className="hidden md:block" /> MCPハブ
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              すべてのMCPサーバーとツールをひとつのプラットフォームで一元管理します。分断、
              複雑さ、制約を抑え、技術スタック全体のAIワークフローを効率化します。
            </p>
          </header>
        </section>
        <Hero
          imageAlt="MCP Gateway製品プレビュー"
          imageSrc="/assets/products/aip/mcp-gateway/mcp-gateway.png"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
