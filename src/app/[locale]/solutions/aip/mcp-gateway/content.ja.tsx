import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie AIP：すべてを接続するMCPハブ",
    "description": "すべてのMCPサーバーとツールを一元管理する単一プラットフォーム—分散なし、複雑さなし、制限なし。舞台裏の複雑さは私たちが処理し、技術スタック全体のAIワークフローを効率化。",
    "keywords": [
      "クエリパイ AI",
      "QueryPie AI",
      "AI Platform",
      "AIP",
      "AI",
      "MCPゲートウェイ",
      "アクセス制御",
      "カスタムAIエージェント",
      "インフラ運用",
      "QueryPie AI Agent",
      "使用量ベース",
      "フォワードデプロイドエンジニア",
      "FDE"
    ]
} as const;


export default function AipMcpGatewayJASolutionContent({ locale, searchParams }: Props) {
  const {
    Box,
    CenterSection,
    DarkBadge,
    FileImage,
    Integrations,
    IntroducingQueryPie,
    KeyFeature,
    KillerFeature,
    KillerFeatureCategory,
    KillerFeatures,
    LearnMoreLink,
    Link,
    LottiePlayer,
    MainFeatureDescription,
    SplitView,
    StaticBody,
    StaticH1,
    StaticH2,
    StaticH4,
    StaticHeader,
    ThreeColumnList,
    ThumbnailYoutube,
    Youtube
  } = buildSolutionContentComponents({ locale, searchParams }) as any;

  return (
<Box direction="column">
  <Box paddingTopSize="lg" paddingBottomSize="xxl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" center gapSize="sm">
        <StaticH1>
          {'QueryPie AIP'}
          <br />
          {'統合型AIゲートウェイ'}
        </StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'AIによる業務最適化には、既存システムとの連携が必須。でも、大規模なシステム再構築は不要です。'
          }
          <br />
          {
            'QueryPie AIPなら、45種類以上の構築済みツールとカスタムツールを統合して一元管理できます。'
          }
          <br />
          {
            '複雑な接続処理はプラットフォームが担当し、既存システム全体のAIワークフローを効率化します。'
          }
        </StaticHeader>
      </Box>
      <Box as="section" center>
        <FileImage
          alt="MCP Gateway"
          filepath="public/solutions/aip/mcp-gateway/mcp-gateway.svg"
          width={920}
          height={580}
          responsive
        />
      </Box>
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" background="gray" center as="section" id="features">
    <CenterSection gapSize="xxl">
      <MainFeatureDescription
        title={'セキュアな社内システム接続\n（スマートエッジトンネリング）'}
        description={'トンネリングを通じて、社内システムへ安全にアクセス。\n既存のセキュリティ環境を変更せずに、\nファイアウォールで保護されたリソースに接続できます。'}
        image="public/solutions/aip/mcp-gateway/aip_function_tunneling.gif"
        imageWidth={540}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <MainFeatureDescription
        imagePosition="left"
        title={'外部ツールとの連携'}
        description={'安全なローカルプロキシサーバーを介して、\n外部開発ツールからQueryPie AIPのMCP設定を利用可能。\nCursor IDE、Claude Desktop、Windsurfなどから、\nシームレスにアクセスできます。'}
        image="public/solutions/aip/mcp-gateway/aip_function_mcpproxy.gif"
        imageWidth={580}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section" background="gray">
    <CenterSection>
      <MainFeatureDescription
        title={'組織全体を一元管理'}
        description={'詳細な権限設定で、誰がどのツールにアクセスできるかを制御。\n組織全体のすべてのAIツール利用を、一元的に管理できます。'}
        image="public/solutions/aip/mcp-gateway/aip_function_mcpmanagement.gif"
        imageWidth={520}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <MainFeatureDescription
        imagePosition="left"
        title={'組織全体のすべての操作を、\n完全に可視化して追跡。'}
        description={'ユーザーの活動とシステム変更を監視し、\nセキュリティとコンプライアンスを強化します。'}
        image="public/solutions/aip/mcp-gateway/aip_function_audit.gif"
        imageWidth={580}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section" background="gray">
    <CenterSection>
      <MainFeatureDescription
        title={'データ漏洩防止（DLP）'}
        description={'機密データがAIチャットに入り込むことを自動的にブロック。\nクレジットカード番号、APIキー、個人情報などの露出を瞬時に防止します。'}
        image="public/solutions/aip/mcp-gateway/aip_function_dlp.gif"
        imageWidth={520}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

</Box>
  );
}
