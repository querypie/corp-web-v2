import type { Locale } from "@/constants/i18n";
import { groupMilestones } from "@/features/anniversary/archive";
import { anniversaryHistoryLocales, megazonePhotoAlt, softwareCeoPhotoAlt } from "./anniversaryHistoryLocales";

const company = "https://www.querypie.com/ko/about-us";
const news = "https://www.querypie.com/ko/news/";
const seed = "https://www.newswire.co.kr/newsRead.php?no=936380";
const datanet = "https://www.datanet.co.kr/news/articleView.html?idxno=";
const japanNews = "https://www.querypie.com/ja/news/";

// Keep the date only as precise as the public record.
function event<Title extends string>(date: string, category: string, title: Title, body: string,
  source: string, href?: string, options?: {
    newsPhotoAlt?: Record<Locale, string>;
    photo?: { src: string; alt: Record<Locale, string>; credit: string; width: number; height: number };
    plainTitleNames?: readonly string[];
  }) {
  return { date, year: Number(date.slice(0, 4)), category, title, body, source, href, ...options };
}

const milestones = [
  event("2016", "설립", "체커 설립", "오늘의 쿼리파이로 이어지는 첫 법인, 체커가 문을 열었습니다.", "쿼리파이 공식 연혁", company),
  event("2018", "투자", "카카오인베스트먼트 투자 유치", "카카오인베스트먼트의 투자를 유치하고, 개발자를 위한 SQL 클라이언트 개발을 시작했습니다.", "쿼리파이 공식 연혁", company),
  event("2019", "제품 출시", "QueryPie SQL Client 출시", "개발자가 데이터베이스에 접속해 쿼리를 작성하고 실행하는 도구를 선보였습니다.", "쿼리파이 공식 연혁", company),
  event("2019", "수상", "LG Startup Competition 수상", "첫 제품을 출시한 해, LG Startup Competition에서 수상했습니다.", "쿼리파이 공식 연혁", company),
  event("2020", "투자", "Y Combinator W20 선정", "미국 스타트업 액셀러레이터 Y Combinator의 투자를 받았습니다. 같은 해 제품의 초점을 SQL 개발 도구에서 기업의 데이터 보호로 옮겼습니다.", "쿼리파이 공식 연혁", company),
  event("2020-06", "제품 출시", "데이터 거버넌스 솔루션 출시", "기업이 데이터 접근 권한과 사용 이력을 관리할 수 있도록 QueryPie를 출시했습니다. 야놀자와 카카오페이 등이 초기 고객이 됐습니다.", "뉴스와이어 · 회사 보도자료", seed),
  event("2021-07", "파트너십", "Okta Integration Network 합류", "Okta의 계정 인증과 QueryPie의 데이터 접근 제어를 연결하는 파트너가 됐습니다.", "CIO Applications", "https://robotic-process-automation.cioapplications.com/news/querypie-becomes-okta-integration-network-partner-in-korea-nid-8103.html"),
  event("2021-12", "투자", "1,775만 달러 시드 투자 유치", "에이티넘인베스트먼트와 뮤렉스파트너스가 공동으로 주도한 투자 라운드에서 약 210억 원을 유치했습니다.", "뉴스와이어 · 회사 보도자료", seed),
  event("2022-06", "고객 도입", "고위드에 데이터 거버넌스 구축", "스타트업 금융 플랫폼 고위드가 사내 서버와 클라우드에 흩어진 데이터의 접근 권한을 한곳에서 관리할 수 있게 됐습니다.", "뉴스와이어 · 회사 보도자료", "https://www.newswire.co.kr/newsRead.php?no=945647"),
  event("2022-10", "선정", "신용보증기금 혁신아이콘 선정", "신용보증기금이 성장 가능성이 높은 스타트업을 지원하는 혁신아이콘 프로그램에 선정됐습니다.", "KoreaTechDesk", "https://koreatechdesk.com/korea-credit-guarantee-fund-backs-4-startups-with-a-13-million-credit-guarantee-to-become-unicorns"),
  event("2023-01", "업무협약", "메가존클라우드와 데이터 보안 업무협약", "메가존클라우드와 데이터 접근 권한과 사용 이력을 관리하는 QueryPie 솔루션을 기업 고객에게 공급하기로 했습니다.", "데일리시큐", "https://www.dailysecu.com/news/articleView.html?idxno=142561", {
    photo: {
      src: "/news/anniversary-megazone-agreement.webp",
      width: 600,
      height: 310,
      alt: megazonePhotoAlt,
      credit: "사진 제공: 메가존클라우드",
    },
  }),
  event("2023-08", "제품 출시", "DAC에 이어 서버 접근 제어 제품 SAC 출시", "데이터베이스 접속을 관리하는 DAC에 이어, 서버 접속 권한을 관리하고 작업 이력을 기록하는 SAC를 출시했습니다.", "데이터넷", datanet + "185851"),
  event("2024", "투자", "Salesforce Ventures·Z Venture Capital 투자 유치", "두 투자사가 전략적 투자자로 합류했습니다. 쿼리파이는 일본 현지 파트너와 함께 사업을 넓혀 갔습니다.", "쿼리파이 공식 연혁", company),
  event("2024-05", "선정", "초격차 스타트업 1000+ 선정", "중소벤처기업부가 첨단 기술 스타트업을 육성하는 사업에 사이버보안 기업으로 선정됐습니다.", "데이터넷", datanet + "193658"),
  event("2024", "시장 진출", "일본 법인 QueryPie Japan 출범", "일본 고객과 파트너를 현지에서 지원할 사업 거점을 마련했습니다.", "쿼리파이 공식 연혁", company),
  event("2024-06", "제품 출시", "쿠버네티스 접근 제어 제품 KAC 출시", "여러 쿠버네티스 환경의 역할과 접근 정책을 통합 관리하고, 사용자별 API 활동을 확인할 수 있는 제품을 선보였습니다.", "데이터넷", datanet + "194202"),
  event("2024-07", "제품 출시", "민감정보 탐지 솔루션 AIDD 출시", "기업의 데이터와 시스템 자산에서 개인정보 등 민감 데이터를 찾아내고, 탐지 결과를 보안 정책과 감사에 활용할 수 있게 했습니다.", "데이터넷", datanet + "195218"),
  event("2024-08", "선정", "레알 마드리드 액셀러레이터 선정", "아시아 스타트업과 스포츠 산업의 기술 협력을 모색하는 Real Madrid Next Accelerator for Asia에 선정됐습니다.", "데이터넷", datanet + "195720"),
  event("2024-11", "선정", "글로벌 소프트웨어 기업 100곳에 이름을 올리다", "미국 매체 The Software Report가 발표한 ‘The Top 100 Software Companies of 2024’에 선정됐습니다.", "The Software Report · 선정 명단", "https://www.thesoftwarereport.com/the-top-100-software-companies-of-2024/"),
  event("2024-12", "제품 공개", "웹 애플리케이션 접근 제어 WAC 초기 버전 공개", "사내 웹 애플리케이션에 누가 접근할 수 있는지 관리하는 WAC의 초기 버전을 QueryPie 10.2.0에서 선보였습니다.", "QueryPie ACP · 공식 릴리스 노트", "https://docs.querypie.com/ko/release-notes/10.2.0-10.2.12"),
  event("2025-01", "선정", "황인서 대표, 소프트웨어 CEO 50인 선정", "The Software Report가 선정한 2024년 소프트웨어 CEO 50인에 쿼리파이 창업자 황인서 대표가 이름을 올렸습니다.", "쿼리파이 · 선정 소식", news + "top-50-software-ceos-of-2024", {
    newsPhotoAlt: softwareCeoPhotoAlt,
  }),
  event("2025-03", "시장 진출", "싱가포르 CyberBoost Catalyse 선정", "싱가포르 정부가 지원하는 사이버보안 기업 육성 프로그램에 선정돼 현지 시장과 만날 기회를 얻었습니다.", "아시아경제", "https://view.asiae.co.kr/article/2025033108392136156"),
  event("2025-07", "시장 진출", "조달청 디지털서비스몰 등록", "공공기관이 데이터베이스와 서버의 접근 권한과 작업 이력을 관리하는 QueryPie 보안 솔루션을 조달청 디지털서비스몰에서 도입할 수 있게 됐습니다.", "데이터넷 · 등록 소식", datanet + "203322"),
  event("2025-07", "제품 출시", "접근 제어 커뮤니티 버전 공개", "스타트업과 중소기업도 데이터베이스·서버·쿠버네티스·웹 애플리케이션의 접근 제어와 감사 기능을 경험할 수 있도록 무료 버전을 선보였습니다.", "데일리시큐", "https://www.dailysecu.com/news/articleView.html?idxno=168156"),
  event("2025-08", "기술 제휴", "일본 HR 기업 Payroll과 보안 협력", "일본 급여 관리 기업 Payroll과 인사 데이터를 안전하게 다루기 위한 AI 보안 기술 협력을 시작했습니다.", "데이터넷", datanet + "204196"),
  event("2025", "제품 출시", "QueryPie AIP와 FDE 서비스 출시", "기업의 업무 도구와 AI를 연결하는 플랫폼 AIP를 출시했습니다. 엔지니어가 고객 현장에서 도입과 구현을 돕는 FDE 서비스도 시작했습니다.", "쿼리파이 공식 연혁", company),
  event("2025-11", "파트너십", "TerraSky, mitoco Buddy에 AIP 채택", "일본 클라우드 기업 TerraSky가 업무용 AI 에이전트 mitoco Buddy를 발표했습니다. AI가 기업의 업무 도구와 데이터를 사용할 수 있게 연결하는 QueryPie AIP를 기반으로 합니다.", "TerraSky · 공식 발표", "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/"),
  event("2026-04", "제품 미리보기", "AIP 주소록 앱 LinkPie 미리보기", "AIP 앱 미리보기에서 LinkPie를 소개했습니다. 주소록에 명함과 연락처를 정리하고, 동료와 공유하거나 AIP 대화에서 활용할 수 있습니다.", "QueryPie AIP · 공식 앱 가이드", "https://aip-docs.app.querypie.com/ko/user-guide/apps", { plainTitleNames: ["AIP"] }),
  event("2026-06", "인증", "AI 경영시스템 국제표준 인증 취득", "AI를 개발하고 운영할 때 위험을 식별하고 관리하는 체계에 대해 ISO/IEC 42001 인증을 받았습니다.", "쿼리파이 · 인증 발표", news + "iso-42001-certification-announcement"),
  event("2026-06", "제품 출시", "실시간 통역 서비스 Lingo 공개", "서로 다른 언어로 말하는 회의에서 실시간 자막과 번역을 제공하고, 회의가 끝나면 요약과 후속 업무로 이어지도록 했습니다.", "쿼리파이 · Lingo 출시 발표", news + "lingo-launch"),
  event("2026-06", "제품 출시", "문서 기반 AI 어시스턴트 NotePie 공개", "사용자가 고른 문서와 웹 자료에서 답을 찾고, 근거를 확인하며 보고서나 슬라이드로 정리할 수 있는 NotePie를 선보였습니다.", "쿼리파이 · NotePie 출시 발표", news + "notepie-launch"),
  event("2026-06", "제품 출시", "ACP AI Pack 출시", "데이터베이스와 서버, 쿠버네티스의 접근 권한을 관리하는 ACP에 AI 기능을 더했습니다. AI 에이전트도 기존 승인과 감사 정책 안에서 데이터를 분석하고 시스템을 운영할 수 있습니다.", "쿼리파이 · ACP 발표", news + "querypie-expands-access-control-platform-ai-capabilities"),
  event("2026-07", "시장 진출", "일본에서 FDE 기반 AI 전환 지원 확대", "일본 기업의 현장에 엔지니어를 배치해 업무에 맞는 AI 환경을 설계·구축하고 정착까지 돕는 현지 지원 사업을 본격화했습니다.", "쿼리파이 일본 · 공식 발표", japanNews + "fde-ai-transformation-support-japan"),
  event("2026-08", "파트너십", "AI Terasu와 일본 기업의 AI 도입 지원", "일본 AI 컨설팅 기업 AI Terasu와 기업의 업무 도구를 AI 에이전트에 연결하는 플랫폼 AIP를 함께 판매하고 구축하기로 했습니다.", "쿼리파이 · 협력 발표", news + "querypie-ai-ashisuto-ai-terasu-partnership"),
  event("2026-09", "기술 공개", "다국어 DLP 모델 공개", "여러 언어의 텍스트에서 민감정보를 식별하는 데이터 유출 방지(DLP) 모델을 Hugging Face에 공개했습니다.", "쿼리파이 · 연구 발표", news + "querypie-open-multilingual-dlp-ai-models"),
  event("2026-10", "제품 출시", "데스크톱 AI 에이전트 Aru 제공 시작", "일본 공식 발표를 통해 데스크톱 AI 에이전트 Aru의 제공을 시작했습니다. 사용자는 자신의 컴퓨터에서 자료 조사, 문서 작성, 개발 작업을 자연어로 맡길 수 있습니다.", "쿼리파이 일본 · 공식 발표", japanNews + "aru-desktop-ai-agent-launch"),
  event("2026-10", "기술 공개", "민감정보를 판별하는 AI 모델 QEV 발표", "텍스트 속 정보가 노출되면 안 되는 민감정보인지 판별하는 자체 AI 모델 QEV와 평가 결과를 공개했습니다.", "쿼리파이 · 기술 해설", "https://www.querypie.com/ko/blog/qev-decision-ai-dlp-detection"),
  event("2026-10", "제품 발표", "AI Gateway 독립 제품화 계획 공개", "AIP에 포함된 AI Gateway를 별도 제품으로 제공할 계획을 공개했습니다. 기업이 AI 모델과 에이전트의 연결을 한곳에서 관리할 수 있도록 설계했습니다.", "쿼리파이 · 경영진 인터뷰", "https://www.querypie.com/en/news/querypie-ceo-cto-interview-ai-security-2026"),
  event("2026", "연동 공개", "기업 재무 데이터 플랫폼 CorpNavi 연동 공개", "일본 상장기업의 공시와 재무제표, 주가, IR 자료를 AIP 채팅과 에이전트에서 활용할 수 있도록 CorpNavi의 MCP 연동 방법을 공개했습니다.", "QueryPie AIP · 공식 연동 가이드", "https://aip-docs.app.querypie.com/ko/user-guide/mcps/corpnavi"),
  event("2026-11", "서비스 출시", "일본 기업 대상 AI 모의침투 테스트 시작", "일본 기업의 웹 서비스와 API를 대상으로 보안 진단을 제공하기 시작했습니다. 자체 보안 AI 모델 QLM을 활용해 진단 결과 보고부터 수정 지원과 재검증까지 돕습니다.", "쿼리파이 일본 · 공식 발표", japanNews + "ai-penetration-testing-service-launch"),
  event("2026-11", "내부 파일럿", "Hito-Q 전사 파일럿 시작", "구성원 설문과 면담을 통해 조직과 팀의 상태를 파악하도록 돕는 Hito-Q를 사내에서 시범 운영하기 시작했습니다.", "첨부 통합 연혁"),
];

export type AnniversaryMilestoneTitle = (typeof milestones)[number]["title"];

// These milestones cite other sources, but the same events are covered in company news.
const matchingNewsIds: Partial<Record<AnniversaryMilestoneTitle, string>> = {
  "Okta Integration Network 합류": "querypie-becomes-okta-integration-network-partner-in-korea",
  "1,775만 달러 시드 투자 유치": "querypie-closes-usd-1775-million-in-oversubscribed-preferred-series-seed-round-co-led-by-atinum-investment-and-murex-partners",
  "신용보증기금 혁신아이콘 선정": "data-governance-and-security-solutions-provider-querypie-partners-with-collaborative-documentation-tool-typed-to-enhance-productivity-and-streamline-collaboration-2",
  "레알 마드리드 액셀러레이터 선정": "querypie-selected-for-real-madrid-next-accelerator-program",
  "글로벌 소프트웨어 기업 100곳에 이름을 올리다": "쿼리파이-글로벌-탑-100-소프트웨어-기업-선정",
  "싱가포르 CyberBoost Catalyse 선정": "쿼리파이-싱가포르-정부-지원-글로벌-사이버보안-프로그램-선정",
  "접근 제어 커뮤니티 버전 공개": "쿼리파이-ai-기반-데이터-보안-솔루션-버전-공개1년간-무료-사용-가능",
  "일본 HR 기업 Payroll과 보안 협력": "payroll-partners-with-querypie-on-ai-security-solutions",
  "TerraSky, mitoco Buddy에 AIP 채택": "terrasky-and-querypie-ai-unveil-mitoco-buddy-for-work",
  "민감정보를 판별하는 AI 모델 QEV 발표": "qev-decision-ai-dlp-press-release",
};
const companyNewsHref = /^https:\/\/www\.querypie\.com\/(?:en|ko|ja)\/news\/([^/?#]+)/;

export type AnniversaryNewsThumbnail = { src: string; alt: string };

export function getAnniversaryHistory(locale: Locale, newsThumbnails?: ReadonlyMap<string, AnniversaryNewsThumbnail>) {
  return groupMilestones(milestones.map(({ title, body, year, href, photo, newsPhotoAlt, plainTitleNames }) => {
    const [localizedTitle, localizedBody] = locale === "ko"
      ? [title, body]
      : anniversaryHistoryLocales[title][locale];
    const newsId = matchingNewsIds[title] ?? href?.match(companyNewsHref)?.[1];
    const thumbnail = newsId ? newsThumbnails?.get(newsId) : undefined;
    const localizedPhoto = thumbnail
      ? { ...thumbnail, alt: newsPhotoAlt?.[locale] ?? thumbnail.alt }
      : photo && { ...photo, alt: photo.alt[locale] };

    return {
      id: title,
      year,
      title: localizedTitle,
      body: localizedBody,
      photo: localizedPhoto,
      plainTitleNames,
    };
  }));
}
