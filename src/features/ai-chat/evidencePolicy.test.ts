import { describe, expect, it } from "vitest";
import snapshot from "./knowledge.snapshot.json";
import curated from "./curated-product-facts.json";
import { reviewEvidenceSection } from "./evidencePolicy";
import { isCurrentKnowledgeEvidence, knowledgeChunks, retrieveKnowledge } from "./knowledge";

const documents = [...snapshot.documents, ...curated.documents];

describe("고객 답변 근거 정제", () => {
  it("공개 승인된 CorpNavi 정의만 포함하고 미확정 입력은 원문 변경 없이 보류한다", () => {
    const document = curated.documents.find((item) => item.product === "corpnavi")!;
    const original = JSON.stringify(document);
    expect(reviewEvidenceSection(document, document.chunks[0]).text).toContain("분석 위젯");
    expect(document.chunks).toHaveLength(1);
    // Synthetic fixtures: internal research notes must not enter the public repo.
    const unapprovedSections = [
      { heading: "모니터링과 데이터 활용 방향", text: "가상의 외부 데이터 연동은 검토 중인 기능입니다." },
      { heading: "대표 활용 사례", text: "가상의 고객군은 공식 타깃으로 확정된 정보는 아닙니다." },
    ];
    for (const section of unapprovedSections) {
      const result = reviewEvidenceSection(document, section);
      expect(result.text).toBe("");
      expect(result.removed[0].text).toBe(section.text);
    }
    expect(JSON.stringify(document)).toBe(original);
    const evidence = knowledgeChunks.filter((chunk) => chunk.product === "corpnavi").map((chunk) => chunk.text).join("\n");
    expect(evidence).not.toMatch(/TDNet|공시|IR·투자|공식 타깃|제품 요구사항/);
    expect(evidence).toContain("기업 리포트");
  });

  it.each(["ko", "en", "ja"])("%s WAC의 예정 문구뿐 아니라 그 아래 기능 목록도 제외한다", (locale) => {
    const document = snapshot.documents.find((item) => item.url.endsWith(`/${locale}/administrator-manual/web-apps`))!;
    const result = reviewEvidenceSection(document, document.chunks[0]);
    expect(result.text).toMatch(/감사 로그|Audit Logs|監査ログ/);
    expect(result.text).not.toMatch(/민감정보 통제|Sensitive Information Control|機密情報制御|권한 통제|Permission Control|権限制御/);
    expect(result.removed[0].text).toMatch(/예정|planned|予定/);
    expect(result.removed[0].text).toMatch(/민감정보 통제|Sensitive Information Control|機密情報制御/);
  });

  it.each(["ko", "en", "ja"])("%s NotePie 기능은 유지하고 PR·회사 소개·계획 문구는 제외한다", (locale) => {
    const chunks = knowledgeChunks.filter((chunk) => chunk.locale === locale && chunk.url.includes("/news/notepie-launch"));
    const text = chunks.map((chunk) => chunk.text).join("\n");
    expect(text).toMatch(/PDF.*DOCX.*PPTX.*XLSX.*TXT/);
    expect(text).not.toMatch(/pr@querypie.com|이전 글|다음 글|Previous Post|Next post|前の記事|次の記事|발전시킬 계획|plans to develop|発展させる計画/);
    expect(chunks.some((chunk) => /About QueryPie|QueryPie 소개|QueryPieについて|홍보 담당|Media Contact|メディアのお問い合わせ/.test(chunk.title))).toBe(false);
  });

  it("WAC 자료 간 충돌도 보류하여 다른 출처로 예정 기능이 다시 들어오지 않게 한다", () => {
    const homepage = knowledgeChunks.filter((chunk) => chunk.url.endsWith("/solutions/acp") && chunk.heading === "wac");
    expect(homepage.length).toBeGreaterThan(0);
    for (const chunk of homepage) {
      expect(chunk.text).not.toMatch(/masks?|masking|민감 데이터|機密データ/i);
      expect(chunk.text).toMatch(/Web Access Control/);
    }
  });

  it.each(["ko", "en", "ja"])("%s 미래 BYOK 행을 통째로 제외한다", (locale) => {
    const chunks = knowledgeChunks.filter((chunk) => chunk.locale === locale && chunk.url.endsWith("/admin-guide/agent-management"));
    expect(chunks.map((chunk) => chunk.text).join("\n")).not.toMatch(/byok|custom API keys|자체 api key|独自api key/i);
    expect(chunks.length).toBeGreaterThan(5);
  });

  it("예정된 회의·베타 주의사항·권한·가격과 문의 경로는 그대로 보존한다", () => {
    const predicates = [
      (chunk: typeof knowledgeChunks[number]) => chunk.text.includes("예정된 회의"),
      (chunk: typeof knowledgeChunks[number]) => chunk.text.includes("Beta 기능이며 조직의 AIP 크레딧"),
      (chunk: typeof knowledgeChunks[number]) => chunk.text.includes("조직 관리자가 허용한 도구만"),
      (chunk: typeof knowledgeChunks[number]) => chunk.text.includes("sales@querypie.com") && chunk.text.includes("¥360,000"),
      (chunk: typeof knowledgeChunks[number]) => chunk.title.includes("에이전트 공개 승인 워크플로"),
    ];
    for (const predicate of predicates) expect(knowledgeChunks.some(predicate)).toBe(true);
    const document = { id: "warning", url: "https://example.com/settings" };
    for (const text of [
      "Lab features are under development and may not work as expected.",
      "실험실 기능은 개발 중인 기능으로, 예상과 다르게 동작할 수 있습니다.",
      "実験室機能は開発中の機能で、予想と異なって動作する場合があります。",
      "관리자가 공개 요청을 검토한 뒤 승인합니다.",
    ]) expect(reviewEvidenceSection(document, { heading: "주의사항", text }).text).toBe(text);
  });

  it.each([
    { heading: "내부 편집 메모", text: "이 기능은 고객에게 설명할지 확인해야 합니다." },
    { heading: "Product roadmap", text: "Automatic analysis of every report." },
    { heading: "機能", text: "今後独自APIサポートを追加します。" },
    { heading: "기능", text: "추후 고급 기능을 지원할 예정입니다.\n자동 데이터 분석을 제공합니다." },
  ])("새로 수집된 미검토 기획은 단서를 지우지 않고 전체 보류한다: $heading", (section) => {
    const result = reviewEvidenceSection({ id: "new", url: "https://example.com/product" }, section);
    expect(result.text).toBe("");
    expect(result.removed[0].text).toBe(section.text);
  });

  it("본문 뒤의 페이지 이동과 관련 글 제목은 함께 제거한다", () => {
    const section = { heading: "제품", text: "명함을 업로드할 수 있습니다.\n이전 글\n다른 제품 제목\n다음 글\n다른 뉴스" };
    expect(reviewEvidenceSection({ id: "news", url: "https://example.com/news/product" }, section).text).toBe("명함을 업로드할 수 있습니다.");
  });

  it("제품 경계 사실은 보존하되 작성자용 지시는 근거에서 제외한다", () => {
    const chunk = knowledgeChunks.find((item) => item.title.includes("ACP 기능 경계"))!;
    expect(chunk.text).toContain("DAC(Database Access Control)");
    expect(chunk.text).toContain("MAC(MCP Access Control)");
    expect(chunk.text).not.toContain("설명하지 않습니다");
  });

  it("정제 결과에 다시 정책을 적용해도 사실이 추가로 손실되지 않는다", () => {
    for (const document of documents) for (const section of document.chunks) {
      const first = reviewEvidenceSection(document, section);
      expect(reviewEvidenceSection(document, { ...section, text: first.text }).text).toBe(first.text);
    }
  });

  it("NotePie와 CorpNavi의 문제 질문은 제외된 본문을 검색하지 않는다", () => {
    for (const question of ["NotePie는 어떤 자료를 넣어서 쓸 수 있어?", "CorpNavi는 누가 사용하면 좋아?", "CorpNavi가 일본 기업 공시를 자동으로 확인해줘?"]) {
      const chunks = retrieveKnowledge([{ role: "user", content: question }], "ko");
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.map((chunk) => chunk.text).join("\n")).not.toMatch(/pr@querypie.com|제품 요구사항|공식 타깃|TDNet/);
    }
  });

  it("오래된 벡터의 전체 본문과 단서가 잘린 예정 기능 조각을 모두 거부한다", () => {
    const document = snapshot.documents.find((item) => item.url.endsWith("/ko/administrator-manual/web-apps"))!;
    const current = knowledgeChunks.find((chunk) => chunk.url === document.url && chunk.title.endsWith("— Overview"))!;
    expect(isCurrentKnowledgeEvidence(current)).toBe(true);
    expect(isCurrentKnowledgeEvidence({ ...current, text: current.text.slice(0, 50) })).toBe(true);
    expect(isCurrentKnowledgeEvidence({ ...current, text: document.chunks[0].text })).toBe(false);
    expect(isCurrentKnowledgeEvidence({ ...current, text: "권한 통제 : 허가된 사용자라 하더라도 웹 애플리케이션의 주요 작업은 통제합니다." })).toBe(false);
    expect(isCurrentKnowledgeEvidence({ ...current, text: "" })).toBe(false);
    expect(isCurrentKnowledgeEvidence({ ...current, url: "https://example.com/unknown" })).toBe(false);
  });
});
