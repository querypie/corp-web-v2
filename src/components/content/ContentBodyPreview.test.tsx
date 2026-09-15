import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContentBodyPreview from "./ContentBodyPreview";

describe("ContentBodyPreview", () => {
  it("일본어 화면의 본문 링크는 현재 도메인의 일본어 경로를 사용한다", () => {
    const { container } = render(
      <ContentBodyPreview locale="ja" bodyHtml='<a href="https://www.querypie.com/en/demo/aip">Demo</a>' />,
    );
    expect(container.querySelector("a")).toHaveAttribute("href", "/ja/demo/aip");
  });

  it("bodyHtml이 없으면 null을 렌더링한다", () => {
    const { container } = render(<ContentBodyPreview bodyHtml="" />);
    expect(container.firstChild).toBeNull();
  });

  it("공백만 있는 bodyHtml이면 null을 렌더링한다", () => {
    const { container } = render(<ContentBodyPreview bodyHtml="   " />);
    expect(container.firstChild).toBeNull();
  });

  it("HTML 콘텐츠를 dangerouslySetInnerHTML로 렌더링한다", () => {
    const { container } = render(<ContentBodyPreview bodyHtml="<p>Hello</p>" />);
    expect(container.querySelector("p")?.textContent).toBe("Hello");
  });

  it("public/ 경로를 / 경로로 정규화한다", () => {
    const { container } = render(
      <ContentBodyPreview bodyHtml='<img src="public/image.png" />' />,
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/image.png");
  });

  it("href의 public/ 경로도 정규화한다", () => {
    const { container } = render(
      <ContentBodyPreview bodyHtml='<a href="public/file.pdf">link</a>' />,
    );
    const anchor = container.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("/file.pdf");
  });

  it("rich-content 클래스가 포함된 wrapper div를 렌더링한다", () => {
    const { container } = render(<ContentBodyPreview bodyHtml="<p>Content</p>" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain("rich-content");
    expect(wrapper?.className).toContain("[&_a]:text-brand");
    expect(wrapper?.className).toContain("[&_a:hover]:underline");
    expect(wrapper?.className).not.toContain("[&_a:hover]:text-fg");
  });
});
