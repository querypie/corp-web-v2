import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { aiChatCopy } from "@/copy/aiChat";
import { findHermesLinks } from "@/features/ai-chat/markdown";
import HermesAnswer from "./HermesAnswer";

afterEach(cleanup);

describe("Hermes Markdown 답변", () => {
  it.each(["en", "ko", "ja"] as const)("%s 표·목록·문단을 정상 DOM으로 렌더링한다", (locale) => {
    const { container } = render(<HermesAnswer tableLabel={aiChatCopy[locale].table}>{
      "**AIP 플랜 / プラン**\n\n- Business\n- Enterprise\n\n1. 설정 확인\n2. 저장\n\n| 플랜 | 요금 | 포함량 |\n| --- | --- | --- |\n| Business | $650/월 | 20,000 credits |"
    }</HermesAnswer>);
    expect(container.querySelector("strong")).toHaveTextContent("AIP 플랜 / プラン");
    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByRole("cell", { name: "$650/월" })).toBeVisible();
    expect(screen.getByRole("region", { name: aiChatCopy[locale].table })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("table").closest("p")).toBeNull();
  });

  it("괄호·다국어·참조 링크의 렌더링과 출처 추출이 같은 URL을 사용한다", () => {
    const content = "[**문서**](https://example.test/제품_(資料)?a=1&b=2)\n\n[요금][plans]\n\nhttps://docs.querypie.com.\n\n[plans]: https://www.querypie.com/en/plans/aip";
    render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    const links = findHermesLinks(content);
    expect(links).toHaveLength(3);
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(links.map((link) => link.url));
    expect(links[0].title).toBe("문서");
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("임의 HTML·위험한 링크·원격 이미지를 실행하거나 불러오지 않는다", () => {
    const content = '<script>alert(1)</script>\n\n<img src="https://tracker.test/pixel" onerror="alert(1)">\n\n[bad](javascript:alert(1))\n\n[data](data:text/html,test)\n\n![설명](https://tracker.test/image.png)';
    const { container } = render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    expect(container.querySelector("script, img, iframe")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    expect(screen.queryByRole("link", { name: "bad" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "data" })).not.toBeInTheDocument();
    expect(container.textContent).toContain("<script>alert(1)</script>");
    expect(findHermesLinks("![설명](https://tracker.test/image.png)")).toEqual([]);
  });

  it("코드 예시의 URL을 참고 링크로 추출하지 않는다", () => {
    const content = "`https://example.test/inline`\n\n```text\nhttps://example.test/code\n```";
    render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(findHermesLinks(content)).toEqual([]);
  });

  it.each([
    ["**ACP(Access Control Platform)**가 접근 제어를 담당합니다.", "ACP(Access Control Platform)", "가 접근 제어를 담당합니다."],
    ["**ACP（アクセス制御）**は製品です。", "ACP（アクセス制御）", "は製品です。"],
    ["**ACP（访问控制）**是产品。", "ACP（访问控制）", "是产品。"],
    ["__ACP(Access Control Platform)__는 제품입니다.", "ACP(Access Control Platform)", "는 제품입니다."],
    ["**ACP:**를 설명합니다.", "ACP:", "를 설명합니다."],
  ])("문장부호 뒤 강조와 CJK 문자가 붙어도 정상 표시한다: %s", (content, title, suffix) => {
    const { container } = render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    expect(screen.getByText(title)).toHaveProperty("tagName", "STRONG");
    expect(container.querySelector("p")?.textContent).toBe(title + suffix);
  });

  it("강조처럼 보이는 코드·이스케이프·URL 원문을 보존한다", () => {
    const literal = "**ACP(Access Control Platform)**가";
    const url = "https://example.test/**ACP(Access_Control_Platform)**가";
    const content = `\`${literal}\`\n\n\`\`\`text\n${literal}\n\`\`\`\n\n\\*\\*ACP(Access Control Platform)\\*\\*가\n\n[문서](${url})`;
    const { container } = render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("code")?.textContent).toBe(literal);
    expect(container.querySelector("pre code")?.textContent).toBe(literal + "\n");
    expect(container.textContent).toContain(literal);
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute("href", new URL(url).href);
    expect(findHermesLinks(content)).toEqual([{ title: "문서", url: new URL(url).href }]);
  });

  it("강조된 링크 제목의 렌더링과 출처 추출이 일치한다", () => {
    const content = "[**ACP(Access Control Platform)**의 문서](https://docs.querypie.com)";
    render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    expect(screen.getByText("ACP(Access Control Platform)")).toHaveProperty("tagName", "STRONG");
    expect(findHermesLinks(content)).toEqual([{ title: "ACP(Access Control Platform)의 문서", url: "https://docs.querypie.com/" }]);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://docs.querypie.com/");
    expect(screen.getByRole("link").textContent).toBe("ACP(Access Control Platform)의 문서");
  });

  it("짝이 없는 강조와 영문 단어 경계의 원래 해석을 유지한다", () => {
    const content = "ACP(Access Control Platform)**가\n\n**ACP(Access Control Platform)**is a platform.";
    const { container } = render(<HermesAnswer tableLabel="표">{content}</HermesAnswer>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container.textContent).toContain("ACP(Access Control Platform)**가");
    expect(container.textContent).toContain("**ACP(Access Control Platform)**is a platform.");
  });
});
