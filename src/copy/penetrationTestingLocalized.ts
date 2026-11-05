import type { Locale } from "@/constants/i18n";
import { penetrationTestingCopy, pentestMockCopy } from "./penetrationTesting";

type Copy = typeof penetrationTestingCopy;
const en: Copy = {
  metadata: { title: "AI Penetration Testing Services | QueryPie AI", description: "AI explores attack paths and validates vulnerabilities in real services. QueryPie AI supports evidence-based reporting, remediation, and retesting." },
  hero: { eyebrow: "AI PENTESTING", title: "Find the path.", accent: "Verify the risk.", description: "AI understands your web services and APIs, explores entry points from an attacker’s perspective, and validates vulnerabilities with real requests. Connect discovery to remediation and retesting." },
  exploration: { eyebrow: "01 / AUTONOMOUS EXPLORATION", title: "Explore and validate attack paths", description: "AI forms hypotheses, analyzes responses, and chooses the next test. By combining paths and access conditions, it examines impacts that isolated vulnerability checks can miss.", methods: [
    { label: "SAST", kind: "Static analysis", title: "Find clues in the code", body: "Analyze source code and data flows to identify security flaws." },
    { label: "DAST", kind: "Dynamic analysis", title: "Test the running service", body: "Send requests to live web services and APIs to validate authentication and authorization behavior." },
  ], visual: { link: "Connected findings", request: "Request", response: "Response" } },
  remediation: { eyebrow: "02 / EVIDENCE TO RESOLUTION", title: "From evidence to remediation", description: "Reports bring together impact, reproduction steps, evidence, and recommended fixes. Integrate with development tools and retest the service to confirm the issue is resolved.", report: "Vulnerability report / Sample", finding: "Broken access control in the orders API", severity: "High risk", endpoint: "GET /api/orders/1042", evidence: "Access to another account’s order data confirmed", before: "Before fix", after: "Retest", beforeResult: "200 OK · Accessible", afterResult: "403 Forbidden · Denied", steps: [
    { title: "Understand the evidence", body: "Review requests, responses, and proofs of concept to understand impact and prioritize remediation." },
    { title: "Connect to development tools", body: "Support remediation through coding agents such as Devin, Codex, and Claude Code." },
    { title: "Retest the same issue", body: "Test the updated service, review the evidence, and track remediation status." },
  ], formats: "Reports in formats suited to management reviews, audits, and regular updates." },
  security: { eyebrow: "03 / CONTROLLED & PRIVATE", title: "Controlled testing. Protected data.", description: "QueryPie AI operates QLM in its own data center to analyze data without sending it to external AI services. Agreed execution rules control testing, and collected data is discarded when the service ends.", boundary: "QUERYPIE AI / OWN DATA CENTER", infrastructure: ["Dedicated GPU infrastructure", "QueryPie QLM", "Security agents"], private: "No data sent to external LLM services", items: [
    { title: "Controlled execution", body: "Apply agreed scope and safety rules. Block risky operations such as data deletion before execution." },
    { title: "No external AI transfers", body: "Analysis runs within QueryPie AI infrastructure without calling external LLM services." },
    { title: "Data discarded after testing", body: "Collected testing data and materials are discarded after the service ends rather than retained separately." },
  ] },
  cases: { eyebrow: "04 / IN PRACTICE", title: "Applied to real services", description: "Used on QueryPie AI products as well as services from Vision in Japan and Gowid in Korea. Findings from real environments inform improvements to authentication and access control.", exampleLabel: "Testing our own services", exampleTitle: "A blocked admin function still had another way in.", steps: [
    { title: "Direct access was blocked", body: "Rules restricted external access to internal administrative functions." },
    { title: "AI found an alternate path", body: "Exploration continued through different request paths, revealing differences in how rules and servers interpreted routes." },
    { title: "Controls were strengthened", body: "Evidence was shared with the team to improve internal API authentication and blocking rules." },
  ], customers: [
    { name: "Vision", label: "JAPAN / TELECOM & TRAVEL", body: "Travel connectivity services including global WiFi and eSIM, and business telecommunications solutions." },
    { name: "Gowid", label: "KOREA / FINTECH", body: "Corporate cards and expense management services that support growing businesses." },
  ] },
  process: { eyebrow: "05 / GETTING STARTED", title: "How the service works", description: "Share the target URLs or IP addresses and agree on scope and testing conditions. Allow our testing IPs where access is restricted. QueryPie AI handles exploration through reporting.", steps: [
    { owner: "Your team", title: "Define the scope", body: "Share the URLs or IP addresses to test and confirm the scope." },
    { owner: "Your team", title: "Prepare access", body: "Allow our testing IPs if your service restricts access." },
    { owner: "QueryPie AI", title: "Explore and validate", body: "Confirm connectivity and test attack paths under the agreed conditions." },
    { owner: "QueryPie AI", title: "Review the results", body: "Receive a report with evidence and recommended remediation." },
  ] },
  cta: { title: "Verify your exposure before an attacker does", description: "Tell us about the services you want to test and the security challenges you face.", action: "Contact us" },
};

const ko: Copy = {
  metadata: { title: "AI 모의 해킹 서비스 | QueryPie AI", description: "AI가 공격 경로를 탐색하고 실제 서비스의 취약점을 검증합니다. 증거 기반 보고부터 수정 지원·재검증까지 QueryPie AI가 함께합니다." },
  hero: { eyebrow: "AI PENTESTING", title: "AI가 탐색하고 공격해,", accent: "실제 위험을 검증합니다.", description: "웹 서비스와 API의 구조를 이해하고 공격자 관점에서 침투 경로를 탐색합니다. 실제 요청으로 취약점을 검증하고, 발견부터 수정·재검증까지 연결합니다." },
  exploration: { eyebrow: "01 / AUTONOMOUS EXPLORATION", title: "공격 경로 탐색과 검증", description: "AI가 가설을 세우고 응답을 분석하며 다음 테스트를 선택합니다. 여러 경로와 접근 조건을 조합해 개별 취약점 점검만으로는 놓칠 수 있는 영향까지 검증합니다.", methods: [
    { label: "SAST", kind: "정적 분석", title: "코드에서 단서를 찾습니다", body: "소스코드와 데이터 흐름을 분석해 보안 결함을 확인합니다." },
    { label: "DAST", kind: "동적 분석", title: "실행 중인 서비스에서 검증합니다", body: "운영 중인 웹 서비스와 API에 요청을 보내 실제 응답으로 인증·권한 문제를 검증합니다." },
  ], visual: { link: "분석 결과 연계", request: "요청", response: "응답" } },
  remediation: { eyebrow: "02 / EVIDENCE TO RESOLUTION", title: "보고부터 수정·재검증까지", description: "영향 범위, 재현 방법, 검증 증거와 수정안을 보고서로 정리합니다. 개발 도구와 연계해 대응을 지원하고, 수정 후 테스트로 문제가 해결되었는지 확인합니다.", report: "취약점 보고서 / 예시", finding: "주문 API의 접근 제어 미흡", severity: "높은 위험", endpoint: "GET /api/orders/1042", evidence: "다른 계정의 주문 정보에 접근할 수 있음을 확인", before: "수정 전", after: "재검증", beforeResult: "200 OK · 접근 가능", afterResult: "403 Forbidden · 접근 거부", steps: [
    { title: "증거와 재현 절차로 파악", body: "요청·응답과 PoC를 제시해 영향 범위와 대응 우선순위를 명확히 합니다." },
    { title: "개발 도구와 연결해 수정", body: "Devin, Codex, Claude Code 등 코딩 에이전트와 연계해 수정을 지원합니다." },
    { title: "같은 문제가 재발하는지 검증", body: "수정된 서비스를 다시 테스트합니다. 결과와 근거를 확인하고 대응 상태를 관리합니다." },
  ], formats: "경영 보고·감사 대응·정기 공유 등 목적에 맞는 형식으로 제공합니다." },
  security: { eyebrow: "03 / CONTROLLED & PRIVATE", title: "안전한 운영과 데이터 보호", description: "자체 LLM인 QLM을 자체 데이터센터에서 운영해 외부 AI에 데이터를 보내지 않고 분석합니다. 합의된 실행 규칙으로 작업을 제어하고, 서비스 종료 후 수집 데이터를 폐기합니다.", boundary: "QUERYPIE AI / 자체 데이터센터", infrastructure: ["전용 GPU 인프라", "자체 QLM", "보안 에이전트"], private: "외부 LLM 서비스로 데이터 전송 없음", items: [
    { title: "실행 권한 제어", body: "고객과 합의한 대상과 안전 기준에 따라 실행 규칙을 적용합니다. 데이터 삭제 등 위험한 작업은 사전에 차단합니다." },
    { title: "외부 AI로 전송하지 않음", body: "분석 데이터는 QueryPie AI 내부 인프라에서 처리하며 외부 LLM 서비스를 호출하지 않습니다." },
    { title: "서비스 종료 후 데이터 폐기", body: "검증 과정에서 수집한 데이터와 자료는 서비스 종료 후 폐기하며 별도로 보관하지 않습니다." },
  ] },
  cases: { eyebrow: "04 / IN PRACTICE", title: "실제 서비스에 적용한 경험", description: "QueryPie AI 제품뿐 아니라 일본 Vision, 한국 고위드 서비스에도 적용했습니다. 실제 환경에서 발견한 공격 경로를 인증과 접근 제어 개선으로 연결합니다.", exampleLabel: "자체 서비스 검증 사례", exampleTitle: "차단된 관리 기능에도 우회 경로가 있었습니다.", steps: [
    { title: "일반적인 접근은 차단", body: "내부 관리 기능에 외부 접근을 제한하는 규칙을 적용했습니다." },
    { title: "AI가 우회 경로 발견", body: "차단 후에도 요청 경로를 바꿔 탐색하며 규칙과 서버의 경로 해석 차이를 확인했습니다." },
    { title: "인증·접근 제어 강화", body: "검증 증거를 담당 팀에 공유해 내부 API 인증과 차단 규칙을 개선했습니다." },
  ], customers: [
    { name: "Vision", label: "일본 / 통신·여행 서비스", body: "글로벌 WiFi·eSIM 등 여행 통신 서비스와 기업용 정보통신 솔루션을 제공합니다." },
    { name: "고위드", label: "한국 / 핀테크", body: "성장 기업을 위한 법인카드와 지출 관리 등 기업의 경비 관리를 지원합니다." },
  ] },
  process: { eyebrow: "05 / GETTING STARTED", title: "서비스 진행 절차", description: "대상 URL 또는 IP 주소를 공유하고 범위와 실행 조건을 확인합니다. 접근 제한이 있다면 검증용 IP를 허용해 주세요. 탐색부터 결과 보고까지 QueryPie AI가 진행합니다.", steps: [
    { owner: "고객", title: "대상 공유", body: "검증할 URL 또는 IP 주소를 공유하고 대상 범위를 확인합니다." },
    { owner: "고객", title: "접근 준비", body: "접근 제한이 있다면 QueryPie AI의 검증용 IP를 허용합니다." },
    { owner: "QueryPie AI", title: "AI 탐색·검증", body: "연결을 확인하고 합의된 조건에 따라 침투 가능성을 검증합니다." },
    { owner: "QueryPie AI", title: "결과 보고", body: "검증 증거와 수정안을 정리한 보고서를 전달합니다." },
  ] },
  cta: { title: "공격받기 전에, AI로 검증하세요", description: "검증하고 싶은 서비스와 보안 과제를 알려주세요.", action: "문의하기" },
};
export const penetrationTestingLocalizedCopy: Record<Locale, Copy> = { en, ko, ja: penetrationTestingCopy };

type MockCopy = Pick<typeof pentestMockCopy, "label" | "title" | "sample" | "evidence" | "types" | "services" | "checks">;
const checksEn = [
  ["Explore the service", "Collect public APIs and authentication flows to identify further tests."],
  ["Discover related paths", "Find additional parameters in responses and plan role-specific tests."],
  ["Compare account responses", "Compare owner and non-owner responses and record access conditions."],
  ["Check attachment permissions", "Follow related APIs and verify access from another account."],
  ["Verify session validity", "Compare responses for expired sessions and refresh tokens."],
  ["Test admin API access", "Vary role, organization, and session conditions to test access boundaries."],
  ["Trace an internal path", "Find internal paths in error responses and explore related routes."],
  ["Analyze file responses", "Vary extensions and MIME types to check storage and public access."],
  ["Broken object authorization", "Confirm access to another account’s data and record reproduction steps."],
  ["Test token reuse", "Resubmit a used token and check authentication behavior."],
  ["Test organization switching", "Combine organization switches and query APIs to compare access."],
  ["Record CORS and authentication", "Check allowed origins and authentication headers and save evidence."],
];
const checksKo = [
  ["서비스 구조 탐색", "공개 API와 인증 흐름을 수집하고 추가 검증 대상을 확인합니다."],
  ["관련 경로 발견", "응답에서 추가 매개변수를 찾아 역할별 후속 검증을 준비합니다."],
  ["계정 간 응답 비교", "소유자와 다른 계정의 응답을 비교하고 접근 조건을 기록합니다."],
  ["첨부파일 권한 검증", "관련 API를 따라 다른 계정에서 파일을 가져올 수 있는지 확인합니다."],
  ["세션 유효성 확인", "만료된 세션과 갱신 토큰의 응답을 비교합니다."],
  ["관리 API 접근 검증", "역할·조직·세션 조건을 바꿔 권한 경계를 검증합니다."],
  ["내부 경로 단서 확인", "오류 응답에서 내부 경로를 찾아 관련 경로를 추가 탐색합니다."],
  ["파일 응답 분석", "확장자와 MIME 유형을 바꿔 저장 결과와 공개 범위를 확인합니다."],
  ["객체 접근 권한 미흡", "다른 계정 정보에 대한 접근을 확인하고 재현 조건을 기록합니다."],
  ["토큰 재사용 검증", "사용한 토큰을 다시 전송해 인증 상태의 변화를 확인합니다."],
  ["조직 전환 추가 검증", "조직 전환과 조회 API를 조합해 접근 결과를 비교합니다."],
  ["CORS·인증 조건 기록", "허용 출처와 인증 헤더의 응답을 확인하고 증거를 저장합니다."],
];
export const pentestLocalizedMockCopy: Record<Locale, MockCopy> = {
  ja: pentestMockCopy,
  en: { label: "Sample AI penetration testing exploration and validation screen", title: "Exploration map", sample: "Sample testing screen", evidence: "Evidence", types: ["Test", "Clue", "Analysis", "Vulnerability"], services: ["Authentication", "Orders API", "File service", "Admin console", "Partner API", "Payments"], checks: pentestMockCopy.checks.map((check, i) => ({ ...check, title: checksEn[i][0], detail: checksEn[i][1] })) },
  ko: { label: "AI 모의 해킹 탐색·검증 화면 예시", title: "탐색 지도", sample: "검증 화면 예시", evidence: "검증 기록", types: ["검사 항목", "단서", "분석 결과", "취약점"], services: ["인증 서비스", "주문 API", "파일 서비스", "관리 콘솔", "파트너 API", "결제 서비스"], checks: pentestMockCopy.checks.map((check, i) => ({ ...check, title: checksKo[i][0], detail: checksKo[i][1] })) },
};
