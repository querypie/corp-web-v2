import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie WAC, Web Access Controller",
    "description": "QueryPie WAC는 사내 관리자 사이트 및 SaaS 플랫폼을 포함한 웹 애플리케이션의 접근을 보호하고 로그 활동을 관리합니다.",
    "keywords": [
      "QueryPie WAC",
      "웹 접근 제어기",
      "SaaS",
      "민감 데이터",
      "데이터 보호",
      "통합 접근 제어",
      "권한 관리",
      "HTTP 요청",
      "웹 애플리케이션 준수",
      "SIEM 통합"
    ]
} as const;


export default function AcpWebAccessControllerKOSolutionContent({ locale, searchParams }: Props) {
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
  <Box paddingTopSize="lg" center as="section" background="wac">
    <CenterSection gapSize="xxl" center>
      <Box direction="column" gapSize="sm" center>
        <StaticH1>{'Web Access Controller'}</StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie WAC은 웹 애플리케이션의 접근을 보호하고 활동을 기록합니다.'
          }
          <br />
          {
            '사내 관리자 사이트 및 SaaS 플랫폼을 포함한 웹 애플리케이션에 대해 권한이 부여된 사용자에게 접근을 허용하고, '
          }
          <br />
          {
            '로그와 스크린샷을 캡처하며, 민감한 데이터를 마스킹하고, 파일 전송과 같은 작업을 제어합니다.'
          }
        </StaticHeader>
      </Box>
      <div style={{ maxWidth: '1000px' }}>
        <FileImage
          alt="Web Access Controller"
          filepath="public/solutions/acp/web-access-controller/main.png"
          width={1000}
          height={520}
          responsive
        />
      </div>
    </CenterSection>
  </Box>

  <Box paddingTopSize="mega" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="lg">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'Key Features of WAC'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie WAC은 모든 웹 애플리케이션을 통합하여 원활한 RBAC(Role-Based Access Control) 및 권한 관리를 지원하고, 보안 취약점을 차단합니다.'
          }
          <br />
          {
            '타임라인 기반의 기록으로 사용자 활동을 캡처하고, 상세한 로그와 스크린샷을 통해 활동에 대한 가시성을 제공합니다.'
          }
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/web.svg"
          label="웹 애플리케이션 통합 접근 제어"
          description="사용자가 URL을 통해 특정 사이트를 탐색하거나 링크를 클릭하고 클립보드에 복사하는 등의 활동을 스크린샷과 함께 기록하며, HTTP 요청을 분석하여 이벤트의 명확한 흐름을 제공합니다."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/activity-recording.svg"
          label="브라우저 타임라인 기반 사용자 활동 기록"
          description="사용자가 URL을 통해 특정 사이트를 탐색하거나 링크를 클릭하고 클립보드에 복사하는 등의 활동을 스크린샷과 함께 기록하며, HTTP 요청을 분석하여 이벤트의 명확한 흐름을 제공합니다."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/tracking.svg"
          label="이벤트 및 콘텐츠 기반 사용자 활동 추적"
          description="사용자의 클릭, 타이핑, 클립보드 사용, 파일 전송 등 다양한 활동을 세밀하게 추적하여 기록합니다. 버튼 클릭과 같은 구체적인 동작을 기록하고, 이를 스크린샷과 함께 저장하여 활동을 쉽게 검토하고 분석할 수 있습니다."
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'How QueryPie WAC Works'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {'QueryPie WAC은 사용자와 웹 애플리케이션 간의 게이트웨이 역할을 하며, 안전한 접근을 위해 역할 기반 접근 제어(RBAC)를 적용합니다.'}
          <br />
          {
            'URL 탐색, 클릭, 파일 전송 등의 사용자 활동을 기록하고, 민감한 정보는 마스킹 처리합니다.'
          }
          <br />
          {
            '실시간 모니터링, 이벤트 추적 및 쉬운 SIEM 통합 기능을 통해, 웹 애플리케이션에 대한 뛰어난 보안과 가시성을 제공합니다.'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="How QueryPie WAC Works"
            filepath="public/solutions/acp/web-access-controller/works.png"
            width={1000}
            height={400}
            responsive
          />
        </div>
      </Box>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'웹 애플리케이션 통합 관리'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'SaaS, 사내 애플리케이션 등 다양한 웹 애플리케이션에 대해 웹프록시와 크롬 익스텐션을 사용해 접근 제어를 통합 관리합니다. 보안 기능이 상대적으로 부족한 SaaS에서도 일관된 권한 제어와 로깅을 지원하며, 자체 구축된 GUI 콘솔을 통해 보안 사각지대에 있는 기업 내에서도 접근 제어 및 로깅을 제공합니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="웹 애플리케이션 통합 관리"
            filepath="public/solutions/acp/web-access-controller/management.png"
            width={640}
            height={530}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="역할 및 속성 기반의 접근 제어"
            filepath="public/solutions/acp/web-access-controller/pac.png"
            width={640}
            height={470}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'역할 및 속성 기반의 접근 제어'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '사용자 역할(RBAC)을 기반으로 웹 애플리케이션의 접근 권한과 정책을 관리하며, SaaS와 사내 애플리케이션 모두에 대해 로그인 인증과 접근 제어를 원활하게 통합합니다. 보안 기능이 제한적인 SaaS 애플리케이션에 대해서도 권한 부여와 로깅을 제공하여, 가장 필요한 곳에서 보안을 강화합니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'타임라인 기반 브라우저 모니터링'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '웹 애플리케이션에서의 사용자 행동을 타임라인 기반으로 추적합니다.QueryPie는 사용자 활동을 스크린샷으로 캡처하고 권한을 관리하여, 모든 상호 작용을 실시간으로 명확하게 확인할 수 있도록 합니다. 실시간 타임라인 모니터링을 통해 관리자는 이상 징후를 신속하게 파악함으로써 사내 및 SaaS 애플리케이션 모두에서 뛰어난 보안을 보장할 수 있습니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="타임라인 기반 브라우저 모니터링"
            filepath="public/solutions/acp/web-access-controller/monitoring.png"
            width={640}
            height={490}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="이벤트 및 콘텐츠 기반 사용자 활동 추적"
            filepath="public/solutions/acp/web-access-controller/tracking.png"
            width={640}
            height={590}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'이벤트 및 콘텐츠 기반 사용자 활동 추적'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '웹 애플리케이션에서 사용자의 클릭, 스크롤, 입력 등 모든 활동을 실시간으로 추적하며, URL을 통합 웹사이트 탐색부터 파일 전송까지 사용자의 행동을 완벽하게 파악하고 민감한 상호작용에 대한 완전한 가시성을 확보할 수 있습니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'원클릭 SIEM 연동'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'QueryPie에서 기록된 모든 이벤트의 로그 스트리밍을 간소화하여, 웹 접근, 감사 및 사용자 활동을 포함한 데이터를 실시간 모니터링합니다. 이를 통해 관리자는 중요한 이벤트를 추적하고, 사용자 행동을 분석하며, 접근 패턴을 검토하여 보안 강화를 위한 인사이트를 제공합니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="원클릭 SIEM 연동"
            filepath="public/solutions/acp/web-access-controller/siem.png"
            width={640}
            height={630}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="서브 URL 접근 제어"
            filepath="public/solutions/acp/web-access-controller/url-path-management.png"
            width={640}
            height={460}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'서브 URL 접근 제어'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '태그 기반 RBAC 및 ABAC 규칙을 사용하여 서브 URL 접근을 제어합니다. 관리자는 웹 애플리케이션을 잠그고, 사용자가 자신의 역할에 따라 허용된 페이지와 콘텐츠만 접근할 수 있도록 보장합니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="ultra" center as="section" background="gray">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <DarkBadge>{'Coming Soon'}</DarkBadge>
            <StaticH4>{'웹 애플리케이션에서의 데이터 마스킹'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '웹 애플리케이션에서 민감한 정보를 마스킹하여 무단 접근 및 유출을 방지합니다. 마스킹 기법을 적용하여 노출 위험을 줄이고, 데이터 보안 규정을 준수하며 사용자 개인정보를 보호할 수 있습니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="50%">
          <FileImage
            alt="웹 애플리케이션에서의 데이터 마스킹"
            filepath="public/solutions/acp/web-access-controller/data-masking.png"
            width={600}
            height={450}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>
</Box>
  );
}
