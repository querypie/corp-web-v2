import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContentBodyPreview from "./ContentBodyPreview";

describe("ContentBodyPreview", () => {
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
  });
});
