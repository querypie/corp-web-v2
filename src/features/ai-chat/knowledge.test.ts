import { describe, expect, it } from "vitest";
import { knowledgeChunks, retrieveKnowledge } from "./knowledge";

describe("테스트 문서 검색", () => {
  it.each([
    ["ko" as const, "Lingo 회의 결과를 AIP 업무로 어떻게 이어갈 수 있어?"],
    ["en" as const, "How can I connect Lingo meeting results to an AIP workflow?"],
    ["ja" as const, "Lingoの会議結果をAIPの業務に連携できますか？"],
  ])("%s Lingo-AIP 업무 연계에는 기존 연계 개요와 연결 절차를 먼저 검색한다", (locale, question) => {
    const chunks = retrieveKnowledge([{ role: "user", content: question }], locale);
    expect(chunks[0].url).toContain("/apps/lingo/mcp");
    expect(chunks[0].locale).toBe(locale);
    expect(chunks.slice(0, 2).some((chunk) => chunk.heading === "lingo mcp")).toBe(true);
    expect(chunks.slice(0, 2).some((chunk) => chunk.heading.includes("aip"))).toBe(true);
  });
  it("AIP·ACP 비교 질문에서 양쪽 제품의 근거를 확보한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "AIP와 ACP는 어떤 차이가 있나요?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "aip")).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "acp")).toBe(true);
  });
  it("조사가 아닌 AIP 제품 정의 질문에는 제품 개요를 우선 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "AIP는 어떤 제품이야?" }], "ko");
    expect(chunks.some((chunk) => chunk.url.endsWith("/ko/user-guide")
      && chunk.title.includes("What is QueryPie AIP")
      && chunk.text.includes("AI Playground"))).toBe(true);
    expect(chunks.some((chunk) => chunk.url.endsWith("/ko/solutions/aip/fde-services")
      && chunk.text.includes("전담 엔지니어 동반 서비스"))).toBe(true);
  });
  it("Lingo 언어 질문에서 공식 FAQ를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "링고는 어떤 언어를 지원해?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "lingo" && chunk.text.includes("베트남"))).toBe(true);
    expect(chunks.every((chunk) => chunk.product === "lingo" || chunk.product === "site")).toBe(true);
  });
  it("Lingo Voice 질문에서 번역 음성 출력 근거를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "Lingo Voice로 한국어를 일본어 음성으로 통역해서 발표할 수 있어?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "lingo"
      && chunk.url.includes("/apps/lingo/real-time-interpreter")
      && chunk.text.includes("일본어 번역 음성")
      && chunk.text.includes("다국어 발표"))).toBe(true);
  });
  it.each([
    ["en" as const, "Can Lingo Voice translate Korean speech into Japanese audio?", "Korean speech can be translated and played in Japanese"],
    ["ja" as const, "Lingo Voiceで韓国語を日本語の音声に通訳できますか？", "日本語の翻訳音声が出力されます"],
  ])("Lingo Voice의 %s 근거를 해당 언어로 검색한다", (locale, question, expected) => {
    const chunks = retrieveKnowledge([{ role: "user", content: question }], locale);
    expect(chunks.some((chunk) => chunk.locale === locale
      && chunk.url.includes("/apps/lingo/real-time-interpreter")
      && chunk.text.includes(expected))).toBe(true);
  });
  it("Lingo FAQ의 질문과 답변을 같은 청크로 유지한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "Lingo 데이터는 어디에 저장돼?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "lingo"
      && chunk.url.includes("/resources/help")
      && chunk.title.includes("데이터는 어디에 저장되나요?")
      && chunk.text.includes("AWS 도쿄 리전"))).toBe(true);
  });
  it.each([
    ["lingo", "링고 120만엔 24만크레딧이랑 36만엔 7.2만크레딧 패키지를 알려줘"],
    ["notepie", "노트파이 120만엔 24만크레딧이랑 36만엔 7.2만크레딧 패키지를 알려줘"],
  ])("%s Enterprise 선불 크레딧 패키지를 검색한다", (product, question) => {
    const chunks = retrieveKnowledge([{ role: "user", content: question }], "ko");
    expect(chunks.some((chunk) => chunk.product === product
      && chunk.text.includes("¥360,000")
      && chunk.text.includes("72,000크레딧")
      && chunk.text.includes("¥1,200,000")
      && chunk.text.includes("240,000크레딧"))).toBe(true);
  });
  it("금액을 명시하지 않은 Lingo 요금제 질문에도 Enterprise 패키지를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "Lingo 요금제를 알려줘" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "lingo"
      && chunk.text.includes("¥360,000")
      && chunk.text.includes("240,000크레딧"))).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "lingo"
      && chunk.text.includes("월 $650")
      && chunk.text.includes("20,000크레딧")
      && chunk.text.includes("1시간당 200크레딧"))).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "aip" && chunk.text.includes("$650"))).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "lingo"
      && chunk.url.endsWith("/ko/pricing")
      && chunk.text.includes("sales@querypie.com"))).toBe(true);
  });
  it("NotePie 요금제 질문에 Lingo와 동일한 Business와 Enterprise 가격을 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "NotePie 요금제를 알려줘" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "notepie"
      && chunk.text.includes("월 $650")
      && chunk.text.includes("20,000크레딧"))).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "notepie"
      && chunk.text.includes("¥360,000")
      && chunk.text.includes("¥1,200,000")
      && chunk.text.includes("sales@querypie.com"))).toBe(true);
  });
  it("FDE를 AIP 위의 전담 엔지니어 서비스로 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "AIP 위에서 제공하는 FDE 서비스가 뭐고, QueryPie의 강점은 뭐야?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "aip"
      && chunk.url.endsWith("/ko/solutions/aip/fde-services")
      && chunk.text.includes("전담 엔지니어 동반 서비스")
      && chunk.text.includes("맞춤형 AI 에이전트 구축부터 실제 운영까지")
      && chunk.text.includes("플랫폼과 전문 엔지니어 지원이 끊기지"))).toBe(true);
  });
  it("FDE와 ACP 연계의 보안·인증 근거를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "FDE에서 ACP와 연계해서 보안, 인증, 권한 관리를 할 수 있어?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "aip"
      && chunk.title.includes("ACP 보안·인증 연계")
      && chunk.text.includes("SSO와 MFA")
      && chunk.text.includes("역할 기반 접근 제어(RBAC)")
      && chunk.text.includes("감사 로그"))).toBe(true);
  });
  it("수집 지식에서 화면 조작과 푸터 문구를 제거한다", () => {
    const noise = /Cookie Preference|Powered by QueryPie|Protected by Lingo|©\s*20\d{2}|How to get closer to the world|실제 사용 중 궁금한 점|利用中に不明な点/i;
    expect(knowledgeChunks.some((chunk) => noise.test(`${chunk.title}\n${chunk.text}`))).toBe(false);
  });
  it("제품명이 없는 후속 질문에는 앞선 질문의 제품을 적용한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "Lingo가 뭐야?" }, { role: "assistant", content: "회의 번역 서비스입니다." }, { role: "user", content: "그럼 요금은?" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("pricing"))).toBe(true);
    expect(chunks.every((chunk) => chunk.product === "lingo" || chunk.product === "aip" || chunk.product === "site")).toBe(true);
  });
  it("다른 제품의 요금제 후속 질문에는 공개 가격이 있는 제품을 함께 검색한다", () => {
    const chunks = retrieveKnowledge([
      { role: "user", content: "AIP 요금제는?" },
      { role: "assistant", content: "AIP 가격을 안내했습니다." },
      { role: "user", content: "다른 제품 요금제도 알려줘" },
    ], "ko");
    expect(chunks.some((chunk) => chunk.product === "acp" && chunk.text.includes("$50"))).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "lingo" && chunk.url.includes("pricing"))).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "notepie" && chunk.text.includes("240,000크레딧"))).toBe(true);
  });
  it("제품 간 관계 질문에 AIP Apps와 Lingo 연동, FDE·ACP 근거를 함께 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "제품 간 관계를 알려줘" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("/user-guide/apps") && chunk.text.includes("AIP에 직접 연결"))).toBe(true);
    expect(chunks.some((chunk) => chunk.url.includes("/apps/lingo/mcp") && chunk.text.includes("회의 준비부터 후속 업무"))).toBe(true);
    expect(chunks.some((chunk) => chunk.title.includes("FDE") && chunk.title.includes("ACP") && chunk.text.includes("SSO와 MFA"))).toBe(true);
  });
  it("여러 제품명을 나열한 관계 질문도 포트폴리오 질문으로 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "QueryPie 제품들 관계를 AIP, ACP, Lingo, NotePie, LinkPie 중심으로 설명해줘" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("/user-guide/apps"))).toBe(true);
    expect(chunks.some((chunk) => chunk.title.includes("FDE") && chunk.title.includes("ACP"))).toBe(true);
  });
  it("FDE 강점 질문에 FDE 운영 지원과 ACP 보안 연계 근거를 함께 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "FDE 서비스가 정확히 뭐고 QueryPie의 강점은 뭐야?" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("/solutions/aip/fde-services"))).toBe(true);
    expect(chunks.some((chunk) => chunk.title.includes("FDE") && chunk.title.includes("ACP"))).toBe(true);
  });
  it("일본어 유료 플랜 질문을 가격 질문으로 인식한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "Lingoの有料プランとクレジット数を教えてください" }], "ja");
    expect(chunks.some((chunk) => chunk.text.includes("月額$650") && chunk.text.includes("20,000クレジット"))).toBe(true);
    expect(chunks.some((chunk) => chunk.text.includes("¥360,000") && chunk.text.includes("¥1,200,000"))).toBe(true);
  });
  it("LinkPie 질문에서 AIP Apps의 공개 제품 설명을 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "LinkPie로 명함을 관리할 수 있어?" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("/user-guide/apps") && chunk.text.includes("명함 이미지"))).toBe(true);
  });
  it("회사 인증 질문에서 공식 인증 페이지를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "QueryPie가 보유한 보안 인증은 뭐야?" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("/company/certifications") && chunk.text.includes("SOC 2 Type II"))).toBe(true);
  });
  it("AIP와 ACP 가격 질문에서 각각의 공식 가격표를 검색한다", () => {
    const aip = retrieveKnowledge([{ role: "user", content: "AIP Business 가격과 크레딧은?" }], "ko");
    const acp = retrieveKnowledge([{ role: "user", content: "ACP Standard 가격은?" }], "ko");
    expect(aip.some((chunk) => chunk.url.endsWith("/ko/plans/aip") && chunk.text.includes("$650"))).toBe(true);
    expect(aip.some((chunk) => chunk.product === "notepie")).toBe(false);
    expect(acp.some((chunk) => chunk.url.endsWith("/ko/plans/acp") && chunk.text.includes("$50"))).toBe(true);
  });
  it("DAC 설명에서 AI Preview가 AI Chat 기능이라는 제품 경계를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "DAC 제품과 기능을 설명해줘" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "acp"
      && chunk.locale === "ko"
      && chunk.url === "https://docs.querypie.com/ko/user-manual/ai-chat"
      && chunk.text.includes("AI Preview는 DAC 기능이 아니라 QueryPie AI Chat 기능"))).toBe(true);
  });
  it("MAC 질문에서 Remote MCP Server의 권한과 연결 방법을 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "MAC으로 Remote MCP Server를 어떻게 사용해?" }], "ko");
    const macChunks = chunks.filter((chunk) => chunk.url.endsWith("/ko/user-manual/mcp-access-control/using-remote-mcp-servers-through-mac"));
    expect(macChunks).toHaveLength(2);
    expect(macChunks.some((chunk) => chunk.text.includes("Role과 Policy") && chunk.text.includes("MCP Endpoint"))).toBe(true);
    expect(macChunks.some((chunk) => chunk.text.includes("/mac/mcp") && chunk.text.includes("User OAuth"))).toBe(true);
  });
  it("CorpNavi 정의와 위젯 기반 리서치 흐름을 승인 지식에서 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "CorpNavi가 어떤 제품이야?" }], "ko");
    expect(chunks.slice(0, 2).some((chunk) => chunk.product === "corpnavi"
      && chunk.text.includes("기업·금융 리서치 워크벤치")
      && chunk.text.includes("분석 위젯")
      && chunk.publicSource === false)).toBe(true);
  });
  it("ACP 모듈 비교 질문에서 기능 경계표와 AI Chat 구분 근거를 함께 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "DAC, SAC, KAC, WAC, MAC과 AI Chat의 차이를 알려줘" }], "ko");
    expect(chunks.some((chunk) => chunk.title.includes("ACP 기능 경계")
      && chunk.text.includes("데이터베이스 접근")
      && chunk.text.includes("Remote MCP Server"))).toBe(true);
    expect(chunks.some((chunk) => chunk.text.includes("AI Preview는 DAC 기능이 아니라 QueryPie AI Chat 기능"))).toBe(true);
  });
  it("공개 근거가 없는 CorpNavi 가격에 다른 제품 가격표를 섞지 않는다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "CorpNavi 가격은 얼마야?" }], "ko");
    expect(chunks.some((chunk) => /\$\d|¥\d|월\s*\d|가격은/u.test(chunk.text))).toBe(false);
  });
});
