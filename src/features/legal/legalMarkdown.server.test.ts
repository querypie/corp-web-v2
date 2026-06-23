import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { renderLegalMarkdown } from "./legalMarkdown.server";

describe("renderLegalMarkdown", () => {
  it("허용된 링크만 href로 렌더링한다", () => {
    const html = renderLegalMarkdown([
      "[internal](/en/privacy-policy)",
      "[external](https://querypie.com)",
      "[email](mailto:legal@querypie.com)",
      "[blocked](javascript:alert(1))",
    ].join("\n\n"));

    expect(html).toContain('href="/en/privacy-policy"');
    expect(html).toContain('href="https://querypie.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('href="mailto:legal@querypie.com"');
    expect(html).not.toContain('href="javascript:');
  });

  it("실행성 HTML은 제거한다", () => {
    const html = renderLegalMarkdown("<script>alert(1)</script><iframe src=\"https://example.com\"></iframe><p>Safe</p>");

    expect(html).toContain("<p>Safe</p>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("alert(1)");
  });

  it("한국어 개인정보 국외 이전 테이블의 보관기간 행에 빈 마지막 칸을 렌더링한다", () => {
    const html = renderLegalMarkdown(
      '<table><thead><tr><th>구분</th><th>국외 이전/보관 목적</th><th>이전/보관 항목</th><th>이전/보관 플랫폼</th></tr></thead><tbody><tr><td>이전 받는 자의 보관기간</td><td colspan="2"><p>보관기간 안내</p></td></tr></tbody></table>',
    );

    expect(html).toContain('<td colspan="2"><p>보관기간 안내</p></td><td></td></tr>');
  });
});
