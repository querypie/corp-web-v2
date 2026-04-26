import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AcpDatabaseAccessControllerKOSolutionContent({ locale, searchParams }: Props) {
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
    <Box paddingTopSize="lg" center as="section" background="dac">
        <CenterSection gapSize="xxl" center>
            <Box direction="column" gapSize="sm" center>
                <StaticH1>{'Database Access Controller'}</StaticH1>
                <StaticHeader color="var(--text-body)">
                    {
                        'QueryPie DAC은 클라우드와 온프레미스 환경 모두를 아우르는 데이터 보호 및 접근 제어 솔루션입니다.'
                    }
                    <br />
                    {
                        '어디서든 데이터 보안과 접근 제어를 완벽하게, QueryPie DAC으로 시작하세요!'
                    }
                </StaticHeader>
            </Box>
            <Youtube src="https://www.youtube.com/embed/SoACnHF6s3Y?si=1DSZJfMYeXjeT0kU" />
        </CenterSection>
    </Box>

    <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="lg">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'Key Features of DAC'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie DAC은 RBAC와 ABAC 기반의 동적 접근 제어를 제공하여, 전문적인 권한 관리를 할 수 있도록 도와줍니다.'
                    }
                    <br />
                    {
                        '사용자는 내장된 SQL 에디터로 매끄러운 데이터베이스 작업을, 관리자는 다양한 데이터 소스의 사용자 활동을 실시간으로 감사할 수 있습니다. '
                    }
                </StaticBody>
            </Box>
            <ThreeColumnList gapSize="md">
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/iam.svg"
                    label="RBAC/ABAC 기반 접근 제어"
                    description="사용자 역할(RBAC: Role-Based Access Control)에 따라 기본 권한을 설정할 수 있을 뿐만 아니라 시간, 요일, IP 주소, SQL 유형 등 다양한 속성(ABAC: Attribute-Based Access Control)을 기반으로 한 세부적인 접근 제어까지 가능합니다."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/web-editor.svg"
                    label="웹 SQL 에디터 지원"
                    description="사용자의 운영 체제가 무엇이더라도, IDE툴이 없더라도 사용자 친화적인 웹 SQL 에디터로 브라우저에서 직접 데이터베이스에 연결할 수 있습니다. 쿼리 실행부터 데이터 가져오기와 내보내기까지 모든 작업을 간편하게 처리할 수 있습니다."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/alert.svg"
                    label="데이터 감사 및 이상 징후 알림"
                    description="로그인, 데이터베이스 접근, 권한 변경, SQL 명령, 쿼리 결과 등 모든 사용자 활동을 추적하여, 비정상적인 행동을 빠르게 감지하고 데이터 보안을 철저히 유지할 수 있습니다.또한, Slack과 같은 채널로 실시간 알림을 받아 중요한 이벤트를 확인할 수 있습니다."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/table-access-control.svg"
                    label="테이블/컬럼 단위 접근 제어"
                    description="민감한 정보를 보호하기 위해 데이터 마스킹 정책을 적용하고, 특정 쿼리 규칙을 통해 중요한 테이블과 컬럼에 대한 접근 제한을 설정하여 데이터 보안을 강화할 수 있습니다."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/workflow.svg"
                    label="Just-in-Time 접근 요청 처리"
                    description="사용자가 필요한 시점에 접근 권한을 요청하고, 관리자가 즉시 승인 및 권한을 부여할 수 있습니다. Slack과 같은 매끄러운 통합으로 간편하고 효율적인 접근 관리가 가능합니다."
                />
            </ThreeColumnList>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="xxl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'How QueryPie DAC Works'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        "QueryPie는 고객의 고유한 환경에 맞춰 유연한 워크스페이스를 제공하며 보안을 한층 강화합니다."
                    }
                    <br />
                    {
                        '브라우저 기반 웹 SQL 에디터를 통해 데이터 유출 통제를 손쉽게 관리할 수 있을 뿐만 아니라 '
                    }
                    <br />
                    {
                        '사용자들의 3rd-party 도구 사용을 가능하게 하는 에이전트 또는 에이전트리스(URL 프록시) 방식을 지원합니다.'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="How QueryPie DAC Works"
                        filepath="public/solutions/acp/database-access-controller/works.png"
                        width={1000}
                        height={400}
                        responsive
                    />
                </div>
            </Box>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="xxl">
            <Box direction="column" gapSize="sm">
                <StaticH2>
                    {'QueryPie Universal Analyzer:'}
                    <br />
                    {'Speak Any Query Language'}
                </StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        "QueryPie만의 독보적인 무기, 쿼리 분석기를 통해 다양한 데이터 소스 간의 격차를 해소합니다. "
                    }
                    <br />
                    {
                        "어떠한 복잡한 쿼리도 QueryPie Analyzer가 분석하고 해석하여 단순화된 형식으로 변환합니다. "
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <LottiePlayer src="/solutions/acp/database-access-controller/dac-analyzer.json" loop>
                        <FileImage
                            alt="QueryPie Universal Analyzer"
                            filepath="public/solutions/acp/database-access-controller/analyzer.png"
                            width={1000}
                            height={420}
                            responsive
                        />
                    </LottiePlayer>
                </div>
            </Box>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="ultra" center as="section">
        <CenterSection gapSize="xl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'Easy Installation, Easy Use'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie는 클라우드 네이티브 기술과 웹 기반 인터페이스를 결합하여 다양한 운영 체제에서 손쉽게 설치하고 운영할 수 있도록 합니다.'
                    }
                    <br />
                    {
                        'Docker 패키징을 통해 쉬운 배포가 가능하며, 온프레미스 보안과 SaaS처럼 편리한 업데이트 방식을 결합한 하이브리드 접근 방식을 지원합니다.'
                    }
                    <br />
                    {
                        '이 디자인은 금융, 의료, 공공 부문에서의 컴플라이언스를 지원하며, 문제가 발생할 경우 즉시 롤백할 수 있는 기능을 제공합니다.'
                    }
                    <br />
                    {
                        'QueryPie는 SaaS의 편리함과 온프레미스 솔루션의 강력한 보안을 결합하여 고객 가치를 전달하는 데 중점을 둡니다.'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="Easy Installation, Easy Use"
                        filepath="public/solutions/acp/database-access-controller/easy-use-ko.png"
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
                        <StaticH4>{'사용자 친화적인 웹 SQL 에디터'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '별도의 IDE가 필요 없습니다! QueryPie의 웹 SQL 에디터로 쿼리 실행, 데이터 가져오기 및 내보내기, 다양한 작업을 브라우저에서 바로 실행하세요. 어떤 운영 체제를 사용하든 관계없이 쉽고 편리하게 작업할 수 있습니다.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="51.7%">
                    <FileImage
                        alt="사용자 친화적인 웹 SQL 에디터"
                        filepath="public/solutions/acp/database-access-controller/sql-editor.png"
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
                <SplitView.View fixWidth="50%">
                    <FileImage
                        alt="3rd Party 툴 사용을 위한 안전한 프록시 접속 지원"
                        filepath="public/solutions/acp/database-access-controller/third-party-tools.png"
                        width={600}
                        height={380}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>
                            {'3rd Party 툴 사용을 위한'}
                            <br />
                            {'안전한 프록시 접속 지원'}
                        </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '사용하던 툴 그대로 데이터베이스 접속이 필요한 경우를 위해 QueryPie는 안전한 Proxy Server 접근 방식을 지원합니다. Agent 및 Agentless 방식을 모두 지원하여 QueryPie의 접근 통제 및 정책이 동일하게 적용됩니다.'
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
                        <StaticH4>{'통합된 데이터베이스 구문 통제 지원'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '표준 SQL을 기반으로 데이터베이스를 통합한 구문 통제가 가능합니다.RDBMS, 데이터 웨어하우스, NoSQL 등을 일관된 권한 정책으로 관리하며, Redis는 200여 가지 이상의 명령어를, MongoDB Shell은 표준 SQL에 대응하여 구문 통제를 지원합니다.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="통합된 데이터베이스 구문 통제 지원"
                        filepath="public/solutions/acp/database-access-controller/db-control.png"
                        width={640}
                        height={760}
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
                        alt="중요 데이터 마스킹 처리 및 보호"
                        filepath="public/solutions/acp/database-access-controller/data-masking.png"
                        width={640}
                        height={660}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'중요 데이터 마스킹 처리 및 보호'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '사전 정의된 패턴과 정규식으로 민감 정보 데이터 마스킹 처리를 지원합니다. 커스텀 패턴 설정을 통해 유연한 마스킹 정책을 구성하고, 뷰 생성 및 함수 사용 시 데이터를 차단하며, 정책에 따라 개인정보를 안전하게 보호합니다. 단일 컬럼뿐만 아니라 JSON 형태의 데이터도 처리합니다.'
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
                        <StaticH4>{'원장 테이블 접근 제어'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '원장 테이블의 중요 데이터 변경 시 형상 관리를 위해 사전 승인 절차와 정책 기능을 제공합니다. 원장 테이블 정책(Ledger Table Policy)에 탐지된 경우, 사전 정의된 승인 프로세스가 자동으로 진행됩니다. 또한 데이터 변경 전후 결과를 통한 형상 관리가 가능합니다.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="원장 테이블 접근 제어"
                        filepath="public/solutions/acp/database-access-controller/ledger.png"
                        width={640}
                        height={670}
                        responsive
                    />
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="lg" center as="section">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
                <SplitView.View fixWidth="51.7%">
                    <FileImage
                        alt="권한 SQL 승인 프로세스 자동화"
                        filepath="public/solutions/acp/database-access-controller/workflow.png"
                        width={620}
                        height={670}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'권한 SQL 승인 프로세스 자동화'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '관리자가 승인 프로세스를 설정할 수 있는 사용자 정의 템플릿으로 워크플로우를 간소화하세요! 권한이 없는 사용자가 데이터베이스 접근 또는 변경을 요청하면, 자동화된 워크플로우가 개입하여 모든 과정의 원활한 진행을 보장합니다.'
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
