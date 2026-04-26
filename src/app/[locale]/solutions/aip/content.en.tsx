import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie AI Platform (AIP)",
    "description": "QueryPie AIP is the platform that delivers enterprise AI transformation through economical, enterprise-ready solutions—featuring usage-based LLM deployment and comprehensive MCP gateway.Complete transformation through Forward Deployed Engineers (FDE) delivering tailored AI agents.",
    "keywords": [
      "QueryPie AI",
      "AI Platform",
      "MCP management",
      "access control",
      "QueryPie",
      "streamlined operations",
      "MCP servers",
      "Usage-based Enterprise AI",
      "MCP Gateway",
      "FDE Service"
    ]
} as const;


export default function AipENSolutionContent({ locale, searchParams }: Props) {
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
          {'QueryPie AI Platform (AIP)'}
        </StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'The platform that delivers enterprise AI transformation through economical, enterprise-ready solutions—'
          }
          <br />
          {
            'featuring usage-based LLM deployment and comprehensive MCP gateway.'
          }
          <br />
          {
            'Complete transformation through Forward Deployed Engineers (FDE) delivering tailored AI agents.'
          }
        </StaticHeader>
      </Box>
      <Box as="section" center>
        <ThumbnailYoutube
          videoId="nJGSCd6itUE"
          thumbnailImg="public/solutions/aip/aip-video-thumb.png"
        />
      </Box>
    </CenterSection>
  </Box>

  <IntroducingQueryPie
    title="Enterprise AI That Actually Delivers"
    description="AI automation that connects everything, costs less, and comes with expert deployment support."
    items={[
      {
        titleImage: 'public/solutions/aip/tailored-security.png',
        title: 'Usage-Based\nEnterprise AI',
        description: 'Replace expensive ChatGPT subscriptions with cost-effective, usage-based enterprise LLM deployment that scales with your needs.\nPerfect for organizations seeking flexible, budget-friendly AI solutions with enterprise-grade security and compliance capabilities.',
        learnMoreButton: {
          href: '/solutions/aip/usage-based-llm',
          label: 'Learn more',
          external: true
        }
      },
      {
        titleImage: 'public/solutions/aip/simple-compliance.png',
        title: 'Unified\nMCP Gateway',
        description: 'Centrally manage, monitor, and integrate 45+ pre-built MCP tools and custom MCP servers through our comprehensive gateway platform. \nStreamline AI workflows across your entire tech stack with unified governance and seamless tool connectivity.',
        learnMoreButton: {
          href: '/solutions/aip/mcp-gateway',
          label: 'Learn more',
          external: true
        }
      },
      {
        titleImage: 'public/solutions/aip/complete-visibility.png',
        title: 'Forward Deployed Engineer (FDE) Service',
        description: 'Complete AI transformation from strategy consulting to custom AI agent development through our expert team. \nAccelerate your AI journey with dedicated Forward Deployed Engineers (FDE) who deliver tailored, production-ready solutions for your business.',
        learnMoreButton: {
          href: '/solutions/aip/fde-services',
          label: 'Learn more',
          external: true
        }
      }
    ]}
  />

  <Box paddingTopSize="lg" paddingBottomSize="lg" background="gray" center as="section" id="features">
    <CenterSection gapSize="xxl">
      <Box direction="column" center gapSize="sm">
        <StaticH2>{'What QueryPie AIP Can Do'}</StaticH2>
      </Box>
      <MainFeatureDescription
        title={'Prompt Auto-Generation'}
        description={'Start with a simple prompt in your Preset Instructions\nand let our auto-generation create comprehensive,\noptimized prompts that maximize your AI agent effectiveness.'}
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
        title={'Simple Integrations'}
        description={'Easily connect your working tools through OAuth authorization.\nBeyond our provided integrations, add your custom and internal tools\nto create business workflow automation tailored to your needs.'}
        checkList={[]}
        learnMoreButton={{
          href: '/solutions/aip/integrations',
          label: 'See All Available AIP Integrations',
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
        title={'Contextual Knowledge Bundles'}
        description={'Turn your documents into knowledge bundles for smarter AI responses.\nRAG-powered agents pull from your organization\'s information instantly,\ndelivering accurate answers based on your business context.'}
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
        title={'Custom Agent Creation'}
        description={'Install pre-built agents from our comprehensive library\nor create custom solutions tailoring each agent\'s capabilities\nto your specific operational requirements.'}
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
        title={'Artifact Visualization'}
        description={'Enhance AI responses with charts, graphs, and interactive elements.\nMake complex insights easier to understand through visual aids,\nthen export polished reports for stakeholders and decision-makers.'}
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
        title={'Schedule Agents'}
        description={'Automate routine tasks by scheduling AI agents at specified intervals.\nConfigure recurring operations through simple agent conversations,\nreducing manual effort while ensuring consistent execution.'}
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
