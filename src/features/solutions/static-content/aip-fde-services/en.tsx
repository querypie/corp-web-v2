import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AipFdeServicesENSolutionContent({ locale, searchParams }: Props) {
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
          {'AI Transformation Expert at Your Service'}
        </StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—'
          }
          <br />
          {
            'from strategy and development to production operations, ensuring your AI initiatives succeed.'
          }
        </StaticHeader>
      </Box>
      <Box as="section" center>
        <FileImage
          alt="Custom AI Agents"
          filepath="public/solutions/aip/fde-services/fde.svg"
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
        title={'Find Problems'}
        description={'AI experts help find what\'s blocking your AI transformation.\nIdentify problems early before they cost you time and money.'}
        image="public/solutions/aip/fde-services/find-problems.png"
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
        title={'Make Plans'}
        description={'Work with specialists to plan the right AI approach for your business.\nTurn challenges into clear, doable action steps.'}
        image="public/solutions/aip/fde-services/make-plans.png"
        imageWidth={580}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

  <Box paddingTopSize="lg" paddingBottomSize="lg" center as="section" background="gray">
    <CenterSection>
      <MainFeatureDescription
        title={'Build Custom AI Agents'}
        description={'Get help building AI agents from first ideas to finished products—\nwe guide you through every step.'}
        image="public/solutions/aip/fde-services/build-custom-ai-agents.png"
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
        title={'Make AI Work'}
        description={'Get ongoing support to make your AI work in the real world.\nExpert guidance ensures your AI transformation actually succeeds.'}
        image="public/solutions/aip/fde-services/make-ai-work.png"
        imageWidth={580}
        imageShadow={true}
        checkList={[]}
      />
    </CenterSection>
  </Box>

</Box>
  );
}
