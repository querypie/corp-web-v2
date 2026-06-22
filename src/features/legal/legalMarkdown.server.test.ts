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
});
