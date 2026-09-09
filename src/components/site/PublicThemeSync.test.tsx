import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicThemeSync from "./PublicThemeSync";

describe("PublicThemeSync", () => {
  it("현재 locale을 최상위 문서 언어에 동기화한다", () => {
    const { rerender } = render(<PublicThemeSync locale="ja" />);
    expect(document.documentElement.lang).toBe("ja");

    rerender(<PublicThemeSync locale="ko" />);
    expect(document.documentElement.lang).toBe("ko");
  });

  it("지원하지 않는 locale은 기본 언어로 되돌린다", () => {
    render(<PublicThemeSync locale="fr" />);
    expect(document.documentElement.lang).toBe("en");
  });
});
