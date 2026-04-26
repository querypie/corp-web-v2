import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AipUsageBasedLlmJASolutionContent({ locale, searchParams }: Props) {
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
          {'QueryPie AIP'}
          <br />
          {'従量課金型エンタープライズAI'}
        </StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie AIPは、ブラウザで使えるプラットフォーム。ダウンロード不要、セットアップ不要で即座にアクセスできます。'
          }
          <br />
          {
            '固定費用なしで使った分だけ支払う従量課金型だから、ChatGPTと比較して最大90%*のコスト削減を実現。'
          }
          <br />
          {
            '小さく始めて効果を見ながら段階的に拡大できます。'
          }
          <small>
          {
            '*ユーザーの利用量により異なります'
          }
          </small>
        </StaticHeader>
      </Box>
      <Box as="section" center>
        <FileImage
          alt="Usage-based LLM Deployment"
          filepath="public/solutions/aip/usage-based-llm/usage-based-llm.svg"
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
        title={'利用量に応じた課金モデル'}
        description={'使った分だけ支払う従量課金型。\n高額な月額固定費がないので無駄がありません。\nあらゆる規模の組織にとって、AI導入が手軽で拡張も簡単です。'}
        image="public/solutions/aip/usage-based-llm/aip_function_pay.gif"
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
        title={'選択可能なプレミアムLLM\n(大規模言語モデル)'}
        description={'ChatGPT、Claude、Geminiなど、業界をリードするAIモデルにアクセス。\nニーズに適したAIを選択し、チームの生産性を瞬時に向上します。'}
        image="public/solutions/aip/usage-based-llm/aip_function_llmmodel.gif"
        imageWidth={580}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section" background="gray">
    <CenterSection>
      <MainFeatureDescription
        title={'シングルサインオン(SSO) で一元管理'}
        description={'既存のアイデンティティプロバイダーとSSO連携し、\nシームレスにログイン。すべてのアカウントを一元管理し、\nセキュリティと管理体制を強化します。'}
        image="public/solutions/aip/usage-based-llm/aip_function_sso.gif"
        imageWidth={520}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="giga" paddingBottomSize="giga" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" center gapSize="sm">
        <StaticH2>
          {'最高のパフォーマンスを、最適なコストで！'}
        </StaticH2>
      </Box>
      <Box as="section">
        <FileImage
          alt="Platform Comparison"
          filepath="public/solutions/aip/usage-based-llm/platform-comparison-jp-rev2.svg"
          responsive
        />
      </Box>
    </CenterSection>
  </Box>
</Box>
  );
}
