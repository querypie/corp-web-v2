import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LegalContentBody from "./LegalContentBody";

describe("LegalContentBody", () => {
  it("본문 링크는 브랜드 컬러를 유지하고 hover 언더라인을 사용한다", () => {
    const { container } = render(
      <LegalContentBody bodyHtml='<p><a href="/terms">Terms</a></p>' />,
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain("[&_a]:text-brand");
    expect(wrapper.className).toContain("[&_a:hover]:underline");
    expect(wrapper.className).not.toContain("[&_a:hover]:text-fg");
  });
});
