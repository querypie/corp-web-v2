import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AipUsageBasedLlmENSolutionContent({ locale, searchParams }: Props) {
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
          {'QueryPie AIP:'}
          <br />
          {'Usage-Based Enterprise AI That Works'}
        </StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'Browser-based platform with instant access—no downloads, no setup, no fixed costs.'
          }
          <br />
          {
            'Up to 90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.'
          }
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
        title={'Pay-Per-Use Pricing'}
        description={'Pay only for what you use—no fixed costs, no waste.\nAI adoption becomes affordable and scalable\nfor any organization size.'}
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
        title={'Premium LLM Models at Your Choice'}
        description={'Access OpenAI, Anthropic, Google, and more industry-leading models.\nChoose the right AI for your needs\nand boost team productivity instantly.'}
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
        title={'SSO & Central Management'}
        description={'Seamless login with existing identity provider through SSO.\nCentrally manage all accounts\nfor better security and administrative control.'}
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
          {'Best Performance, Best Price!'}
        </StaticH2>
      </Box>
      <Box as="section">
        <FileImage
          alt="Platform Comparison"
          filepath="public/solutions/aip/usage-based-llm/platform-comparison-en.svg"
          responsive
        />
      </Box>
    </CenterSection>
  </Box>
</Box>
  );
}
