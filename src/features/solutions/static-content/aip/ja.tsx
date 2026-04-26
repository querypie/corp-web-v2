import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AipJASolutionContent({ locale, searchParams }: Props) {
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
  } = buildSolutionMdxComponents({ locale, searchParams }) as any;

  return (
<Box direction="column">
  <Box paddingTopSize="lg" paddingBottomSize="xxl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" center gapSize="sm">
        <StaticH1>
          {'QueryPie AIプラットフォーム (AIP)'}
        </StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie AIPは、既存の業務システムとつながり、実務で使えるAIを実現します。'
          }
          <br />
          {
            '従量課金でコストを最適化。大規模なシステム改修も不要。'
          }
          <br />
          {
            '専門家が伴走するので、確実に成果が出るAIプラットフォームです。'
          }
        </StaticHeader>
      </Box>
      <Box as="section" center>
        <ThumbnailYoutube
          videoId="nJGSCd6itUE"
          thumbnailImg="public/solutions/aip/aip-video-thumb-jp.png"
        />
      </Box>
    </CenterSection>
  </Box>

  <IntroducingQueryPie
    title="成果にこだわるエンタープライズAI"
    description="AI導入を、ワンストップで実現する３つの価値"
    items={[
      {
        titleImage: 'public/solutions/aip/tailored-security.png',
        title: '従量課金型の\nAIモデル',
        description: '全社員分のライセンス購入を経営層にどう説明する？使われなかったら？\nQueryPie AIPは使った分だけ支払う従量課金型。小さく始めて効果を見ながら段階的に拡大できます。\nプレミアムLLMを必要な時だけ利用でき、月額固定費の無駄から解放されます。',
        learnMoreButton: {
          href: '/solutions/aip/usage-based-llm',
          label: '詳細を見る',
          external: true
        }
      },
      {
        titleImage: 'public/solutions/aip/simple-compliance.png',
        title: '統合型\nAIゲートウェイ',
        description: '既存システムに「つなぐだけ」で、大規模なシステム改修は不要です。\n複雑な接続処理はQueryPie AIPが担当。\nバラバラだったシステムが、1つのプラットフォームで統合されたAIワークフローに変わります。',
        learnMoreButton: {
          href: '/solutions/aip/mcp-gateway',
          label: '詳細を見る',
          external: true
        }
      },
      {
        titleImage: 'public/solutions/aip/complete-visibility.png',
        title: 'AI専門家伴走\nサービス',
        description: 'ビジネスとテクノロジーの両方を理解する専門家、フォワードデプロイドエンジニア(FDE)が、あなたのチームに入り込みます。\n課題発見から構築、本番稼働まで伴走し、確実に成果を出すAI導入を実現します。',
        learnMoreButton: {
          href: '/solutions/aip/fde-services',
          label: '詳細を見る',
          external: true
        }
      }
    ]}
  />

  <Box paddingTopSize="lg" paddingBottomSize="lg" background="gray" center as="section" id="features">
    <CenterSection gapSize="xxl">
      <Box direction="column" center gapSize="sm">
        <StaticH2>{'QueryPie AIPができること'}</StaticH2>
      </Box>
      <MainFeatureDescription
        title={'プロンプト自動生成'}
        description={'プリセットされた簡単な指示文（プロンプト）から始めれば\n包括的かつ最適化されたプロンプトを自動生成します。\n専門知識がなくてもAIエージェントの効果を最大限に引き出せます。'}
        checkList={[]}
        image="public/solutions/aip/aip_function_prompt.gif"
        imageWidth={540}
        imageShadow={true}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <MainFeatureDescription
        imagePosition="left"
        title={'シンプルな統合'}
        description={'OAuth認証でお使いのツール（Slack、Googleなど）を簡単に接続。\n提供されている統合機能に加えて、カスタムツールや内部ツールも追加でき、\nニーズに合わせたビジネスワークフロー自動化を実現します。'}
        checkList={[]}
        learnMoreButton={{
          href: '/solutions/aip/integrations',
          label: 'QueryPie AIPと接続可能な連携ツールの一覧はこちら',
          external: true
        }}
        image="public/solutions/aip/aip_function_integration.gif"
        imageWidth={580}
        imageShadow={true}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section" background="gray">
    <CenterSection>
      <MainFeatureDescription
        title={'社内文書の学習機能'}
        description={'社内文書をアップロードして知識ベース化。\nAIが組織の情報を瞬時に取得し、貴社のビジネスに合った正確な回答をします。'}
        checkList={[]}
        image="public/solutions/aip/aip_function_knowledge.gif"
        imageWidth={520}
        imageShadow={true}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <MainFeatureDescription
        imagePosition="left"
        title={'カスタムエージェント作成'}
        description={'包括的なライブラリから構築済みのエージェントをインストール、\nまたは特定の運用要件に合わせて各エージェントの機能を\nカスタマイズした独自のソリューションを作成できます。'}
        checkList={[]}
        image="public/solutions/aip/aip_function_createagent.gif"
        imageWidth={620}
        imageShadow={true}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section" background="gray">
    <CenterSection>
      <MainFeatureDescription
        title={'ビジュアルレポート作成'}
        description={'AIの回答をグラフや表、インタラクティブな図で表示。\n複雑な分析結果を視覚的にわかりやすく整理し、\nそのままエクスポートして会議に活用できます。'}
        checkList={[]}
        image="public/solutions/aip/aip_function_visualization.gif"
        imageWidth={520}
        imageShadow={true}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <MainFeatureDescription
        imagePosition="left"
        title={'エージェントスケジューリング'}
        description={'指定した間隔でAIエージェントをスケジュール設定し、\n定型タスクを自動化。\n簡単なエージェント会話を通じて定期的な操作を設定でき、\n手動作業を削減しながら一貫した実行を保証します。'}
        checkList={[]}
        image="public/solutions/aip/aip_function_schedule.gif"
        imageWidth={620}
        imageShadow={true}
      />
    </CenterSection>
  </Box>

</Box>
  );
}
