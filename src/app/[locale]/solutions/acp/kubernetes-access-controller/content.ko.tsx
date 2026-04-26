import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie KAC, Kubernetes Access Controller",
    "description": "QueryPie KAC는 AWS EKS와 온프레미스 클러스터를 관리하며, 쿠버네티스 API 보호를 위한 솔루션입니다.",
    "keywords": [
      "QueryPie KAC",
      "쿠버네티스 접근 제어기",
      "AWS EKS",
      "쿠버네티스 API 보호",
      "자동화",
      "ABAC",
      "RBAC",
      "세션 기록",
      "쿠버네티스 클러스터",
      "SSH 연결"
    ]
} as const;


export default function AcpKubernetesAccessControllerKOSolutionContent({ locale, searchParams }: Props) {
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
  <Box paddingTopSize="lg" center as="section" background="kac">
    <CenterSection gapSize="xxl" center>
      <Box direction="column" gapSize="sm" center>
        <StaticH1>{'Kubernetes Access Controller'}</StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie KAC은 Kubernetes API 보호 솔루션으로, AWS EKS와 같은 클라우드 인프라와 온프레미스 클러스터의 중앙 관리를 가능하게 합니다.'
          }
          <br />
          {
            '관리자는 접근을 제어하고, API 요청을 모니터링하며, 컨테이너 명령 실행 이력을 사용자가 보던 화면 그대로 재생할 수 있습니다.'
          }
        </StaticHeader>
      </Box>
      <Youtube src="https://www.youtube.com/embed/OzxB0qqmCTQ?si=qbFYGIDUg2GPuzfU" />
    </CenterSection>
  </Box>

  <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="lg">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'Key Features of KAC'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie KAC은 Kubernetes에서의 정밀한 접근 관리를 위해 RBAC 및 ABAC 기반 접근 제어를 제공하며, IAM 권한을 자동으로 획득합니다.'
          }
          <br />
          {
            '감사 로그, 세션 녹화, 다중 클러스터 접근 관리 기능을 통해 실시간 가시성을 제공하며, 자동으로 KUBECONFIG 설정이 적용됩니다.'
          }
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/iam.svg"
          label="RBAC/ABAC 기반 접근 제어"
          description="Kubernetes 클러스터에 역할 기반(RBAC: Role-Based Access Control) 접근 제어를 구현하여, 맞춤형 정책으로 API 접근을 관리합니다. 또한 속성 기반(ABAC: Attribute-Based Access Control)으로 특정 사용자 속성에 맞는 권한을 부여할 수 있습니다. "
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/gateway.svg"
          label="자동화된 접근 권한 부여"
          description="IAM 권한을 할당하기만 하면 AWS EKS와 같은 클라우드 기반 Kubernetes 클러스터에 대한 관리자 접근 권한이 자동으로 등록되어, 관리자는 복잡한 설정 없이도 손쉽게 클러스터에 대한 접근을 제어하고 관리할 수 있습니다."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/audit.svg"
          label="감사 로그 및 세션 녹화"
          description="감사 로그와 Pod 세션 녹화를 통해 여러 클러스터에서 사용자가 실행한 명령과 활동을 실시간으로 모니터링하고, 사용자가 수행한 명령어, API 요청 및 기타 작업에 대한 상세 정보를 확보할 수 있어 보안과 운영의 가시성을 강화합니다."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/cluster.svg"
          label="멀티 클러스터 접근 중앙화"
          description="사용자가 컨테이너에 접근할 때마다 세션을 자동으로 기록하고, 사용자의 활동을 모니터링합니다. 표준 K8S RBAC에서 지원되지 않는 K8S 리소스 이름(정규식)을 기반으로 접근 제어 규칙을 적용할 수 있습니다."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/config.svg"
          label="자동 KUBECONFIG 구성"
          description="분산된 리소스를 동기화하고 여러 Kubernetes 통합하여 클라우드 환경을 최적화합니다. 스케줄링 기능을 통해 리소스 동기화를 자동화하고, 동기화 이력을 추적하여 효율적인 관리를 할 수 있습니다."
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'How QueryPie KAC Works'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {'관리자는 Azure Active Directory, OneLogin, Okta와 같은 IdP(Identity Providers)를 데이터 접근 정책에 통합할 수 있습니다.'}
          <br />
          {
            '사용자는 QueryPie의 기본 SQL 에디터 또는 타사 분석 도구를 사용해 기존 데이터 워크플로우를 변경하지 않고도 데이터 소스에 접근할 수 있습니다.'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="How QueryPie KAC Works"
            filepath="public/solutions/acp/kubernetes-access-controller/works.png"
            width={1000}
            height={400}
            responsive
          />
        </div>
      </Box>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="ultra" center as="section">
    <CenterSection gapSize="xl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'Entirely Protect Your Kubernetes'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie는 Kubernetes 보호를 강화하여 네임스페이스 내외부 환경을 모두 안전하게 유지합니다.'
          }
          <br />
          {'SAC은 엄격한 접근 제어와 노드의 SSH 연결 감사 기능을 처리하며, '}
          <br />
          {
            'KAC은 Kubernetes 리소스와의 모든 API 상호작용을 관리하고 모니터링하여, 모든 작업이 원활하고 안전하게 실행되도록 보장합니다.'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="Entirely Protect Your Kubernetes"
            filepath="public/solutions/acp/kubernetes-access-controller/protect-k8s.png"
            width={1000}
            height={440}
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
            <StaticH4>{'간편하고 빠른 클라우드 동기화'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'QueryPie로 클라우드 리소스를 손쉽게 동기화하세요!클라우드 환경에 최적화되어 Kubernetes 통합을 간소화하고, 스마트한 스케줄링 기능으로 리소스 동기화를 자동화하며, 변경 사항 또한 쉽게 추적할 수 있습니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="51.7%">
          <FileImage
            alt="간편하고 빠른 클라우드 동기화"
            filepath="public/solutions/acp/kubernetes-access-controller/cloud-sync.png"
            width={620}
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
            alt="Multi-K8S 환경 통합 관리"
            filepath="public/solutions/acp/kubernetes-access-controller/management-env.png"
            width={640}
            height={610}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Multi-K8S 환경 통합 관리'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '단일 콘솔에서 권한을 관리하여 각 Kubernetes 클러스터에 대해 RBAC(Role-Based Access Control) 설정을 개별적으로 구성할 필요를 없앱니다. 와일드카드를 사용해 여러 클러스터에 동일한 권한 정책을 적용하여 접근 제어를 간소화합니다.'
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
            <StaticH4>{'세분화된 K8S 리소스 단위 정책 관리'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '와일드카드와 정규식 지원으로 리소스에 대한 접근 제어를 간소화하고, 사용자 권한에 따라 응답을 필터링하며, 변수 이름에 적응할 수 있습니다. API 그룹, 동작, 리소스 유형, 네임스페이스 및 리소스 이름에 대한 세밀한 정책 관리를 통해 정확한 제어가 가능합니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="48.3%">
          <FileImage
            alt="세분화된 K8S 리소스 단위 정책 관리"
            filepath="public/solutions/acp/kubernetes-access-controller/management-policy.png"
            width={580}
            height={460}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="50.8%">
          <FileImage
            alt="Kubernetes API 실행 이력 로깅"
            filepath="public/solutions/acp/kubernetes-access-controller/logging-api.png"
            width={610}
            height={760}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Kubernetes API 실행 이력 로깅'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '혼란스러운 Kubernetes API 감사 로그는 이제 그만! QueryPie의 프록시는 여러 클러스터에서 모든 API 요청을 기록하며, 핵심 작업에 집중해 효율적인 추적을 지원합니다. 또한, 마스터 서버에 불필요한 부하를 줄여줍니다.'
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
            <StaticH4>{'컨테이너 쉘 명령 실행 이력 기록'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '사용자가 Pod에 접속한 후 실행한 모든 작업을 재생할 수 있는 세션 녹화를 통해 컨테이너 내에서 발생한 사용자 활동을 철저히 추적하세요. 이 기능은 사용자가 수행한 명령, API 요청, 및 작업을 세밀하게 기록하여, 전반적인 감독과 제어를 강화하고, 문제 발생 시 빠르게 대응할 수 있도록 도와줍니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="50%">
          <FileImage
            alt="컨테이너 쉘 명령 실행 이력 기록"
            filepath="public/solutions/acp/kubernetes-access-controller/session-replay.png"
            width={600}
            height={590}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="48.3%">
          <FileImage
            alt="Kubernetes 접근 권한 자동 설정"
            filepath="public/solutions/acp/kubernetes-access-controller/auto-setup.png"
            width={580}
            height={510}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Kubernetes 접근 권한 자동 설정'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '사용자에게 할당된 역할에 따라 자동으로 kubeconfig 파일을 생성합니다. 사용자는 QueryPie Agent를 통해 이 파일에 쉽게 접근할 수 있으며, 기존 Kubernetes 도구인 kubectx를 사용해 접근 가능한 클러스터를 선택할 수 있습니다.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>
</Box>
  );
}
