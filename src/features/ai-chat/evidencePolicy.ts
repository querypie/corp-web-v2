// Applied to original sections BEFORE splitting for embeddings. Raw source files
// remain unchanged so withheld text and its qualifiers can always be reviewed.
export type EvidenceRemoval = { reason: string; text: string };
type EvidenceDocument = { id: string; url: string };
type EvidenceSection = { heading: string; text: string };

const normalize = (value: string) => value.normalize("NFKC").trim();
const navigation = /^(?:이전 글|다음 글|previous (?:post|article)|next (?:post|article)|前の記事|次の記事)$/i;
const boilerplateHeading = /^(?:언론 홍보 담당|보도 문의|media contact|press contact|メディアのお問い合わせ|報道関係者のお問い合わせ|広報担当|product demo - youtube|using this manual|매뉴얼 사용하기)$/i;
const boilerplateLine = /^(?:free start!?|무료로 시작!?|無料で始める|contact us|문의하기|お問い合わせ|learn more|view more|자세히 보기|더 알아보기|詳しく見る|cookie preference|terms of use|privacy policy|eula|powered by .+|protected by .+|©\s*\d{4}.*)$/i;
const editorial = /(?:제품 요구사항에는|공식 타깃.{0,40}확정된 정보는 아닙니다|미확정(?:된)? (?:타깃|고객군)|홈페이지 공개 전.{0,50}확인|내부 (?:편집|검토) 메모|internal editorial note|target (?:audience|segment).{0,30}(?:unconfirmed|not confirmed)|社内編集メモ|ターゲット.{0,20}未確定)/i;
const roadmapHeading = /^(?:제품 로드맵|로드맵|product roadmap|roadmap|製品ロードマップ|ロードマップ)$/i;
// Deliberately do not match generic "예정/予定", "plan", "under development",
// "not yet", or "검토": scheduled meetings, Beta warnings and approvals are facts.
const unreviewedRoadmap = /(?:coming soon|planned to (?:provide|support|transition)|scheduled to be updated|future support for|released in the future|will be phased out|(?:추후|향후).{0,45}(?:기능|지원|출시)|(?:제공|지원|출시|전환|제거|deprecate).{0,12}예정|(?:提供|サポート|移行|廃止).{0,15}予定|今後.{0,30}(?:サポート|リリース)|(?:발전시킬 계획|発展させる計画|plans to develop))/i;

export function reviewEvidenceSection(document: EvidenceDocument, section: EvidenceSection) {
  const removed: EvidenceRemoval[] = [];
  let lines = section.text.split("\n");
  const exclude = (reason: string) => ({ text: "", removed: [{ reason, text: section.text }] });
  const removeLines = (pattern: RegExp, reason: string) => {
    lines = lines.filter((line) => {
      if (!pattern.test(normalize(line))) return true;
      removed.push({ reason, text: line });
      return false;
    });
  };
  const truncateAt = (pattern: RegExp, reason: string) => {
    const start = lines.findIndex((line) => pattern.test(normalize(line)));
    if (start < 0) return;
    removed.push({ reason, text: lines.slice(start).join("\n") });
    lines = lines.slice(0, start);
  };

  if (boilerplateHeading.test(normalize(section.heading)) || navigation.test(normalize(section.heading))) {
    return exclude("page-boilerplate");
  }
  if (document.url.includes("/news/") && /^(?:About QueryPie|QueryPie 소개|QueryPieについて)$/i.test(normalize(section.heading))) {
    return exclude("news-company-boilerplate");
  }
  if (document.id === "corpnavi-approved-product-overview-ko" &&
      ["모니터링과 데이터 활용 방향", "대표 활용 사례"].includes(section.heading)) {
    return exclude("hold-corpnavi-unconfirmed-capabilities-and-targets");
  }
  if (editorial.test(`${section.heading}\n${section.text}`)) return exclude("hold-editorial-or-unconfirmed-brief");
  if (roadmapHeading.test(normalize(section.heading))) return exclude("hold-unreviewed-roadmap");

  truncateAt(navigation, "page-navigation-tail");
  removeLines(boilerplateLine, "page-boilerplate-line");

  // Reviewed mixed sections: remove complete claims/paragraphs, never only a
  // qualifier. WAC's future-feature list inherits its introductory qualifier.
  if (document.url.endsWith("/administrator-manual/web-apps")) {
    truncateAt(/^(?:Additionally, the following features are planned|또한 기능 업데이트를 통해|また、機能更新を通じて)/i, "hold-wac-future-feature-list");
  }
  // The homepage asserts masking/action control while the admin manual marks
  // them as future features. Hold the conflicting paragraph pending confirmation.
  if (document.url.endsWith("/solutions/acp") && section.heading === "WAC") {
    removeLines(/(?:masks?|masking|민감 데이터|機密データ)/i, "hold-wac-conflicting-capability-paragraph");
  }
  if (document.url.endsWith("/admin-guide/agent-management")) {
    removeLines(/^(?:LLM Model|LLMモデル)\s*\|.*(?:future support|추후|今後)/i, "hold-future-byok-row");
  }
  if (document.url.endsWith("/admin-guide/mcp-management")) {
    removeLines(/(?:scheduled to be updated|ABAC.*更新予定)/i, "hold-aip-abac-roadmap");
  }
  if (document.url.endsWith("/user-guide/faq")) {
    removeLines(/^(?:When the Access Control feature is released in the future|추후 Access Control 기능이 출시되면|今後Access Control機能がリリースされると)/i, "hold-future-access-control");
  }
  if (document.url.endsWith("/user-guide/agents")) {
    removeLines(/^(?:The feature previously provided as Preset|기존에 Preset이라는 이름으로|従来 プリセット という名前で)/i, "hold-preset-migration-roadmap");
  }
  if (document.url.includes("/news/notepie-launch")) {
    removeLines(/^(?:QueryPie plans to develop NotePie|QueryPie는 NotePie를.*발전시킬 계획|QueryPieは、NotePieを.*発展させる計画)/i, "hold-notepie-future-direction");
    removeLines(/^(?:June \d+, \d{4}|\d{4}년 \d+월 \d+일|\d{4}年\d+月\d+日|“Enterprises have|He added,|QueryPie의 Brant Hwang 대표는|그는 .*덧붙였다|QueryPieのCEOであるBrant Hwangは|さらに、)/i, "news-date-or-promotional-quote");
  }
  if (document.id === "acp-module-boundaries-ko") {
    // This is an editorial instruction, not a limitation or a product fact.
    const note = "한 모듈의 기능을 다른 모듈의 기능으로 설명하지 않습니다.";
    lines = lines.map((line) => {
      if (!line.endsWith(note)) return line;
      removed.push({ reason: "editorial-instruction", text: note });
      return line.slice(0, -note.length).trimEnd();
    });
  }

  const text = lines.join("\n").trim();
  // Unknown future claims are held as a whole section until reviewed; this also
  // catches a changed source that no longer matches the reviewed rules above.
  if (unreviewedRoadmap.test(text)) return exclude("hold-unreviewed-roadmap");
  return { text, removed };
}
