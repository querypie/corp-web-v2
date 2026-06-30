import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ContentShareActions from "./ContentShareActions";

describe("ContentShareActions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('link[rel="canonical"]').forEach((element) => element.remove());
    window.history.replaceState(null, "", "/");
  });

  it("현재 페이지 URL로 Facebook, LinkedIn, X 공유 링크를 만든다", async () => {
    window.history.replaceState(null, "", "/ko/news/product-update?utm_source=test#section");

    render(<ContentShareActions locale="ko" title="QueryPie update" />);
    await act(async () => {});

    const encodedUrl = encodeURIComponent("http://localhost:3000/ko/news/product-update?utm_source=test");
    expect(screen.getByLabelText("Facebook에 공유")).toHaveAttribute(
      "href",
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    );
    expect(screen.getByLabelText("Share on LinkedIn")).toHaveAttribute(
      "href",
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    );
    expect(screen.getByLabelText("Share on X")).toHaveAttribute(
      "href",
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent("QueryPie update")}`,
    );
  });

  it("canonical URL이 있으면 소셜 공유 링크에 canonical을 사용한다", async () => {
    window.history.replaceState(null, "", "/ko/news/local-preview");
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://www.querypie.com/ko/news/product-update";
    document.head.appendChild(canonical);

    render(<ContentShareActions locale="ko" title="QueryPie update" />);
    await act(async () => {});

    const encodedUrl = encodeURIComponent("https://www.querypie.com/ko/news/product-update");
    expect(screen.getByLabelText("Facebook에 공유")).toHaveAttribute(
      "href",
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    );
    expect(screen.getByLabelText("Share on LinkedIn")).toHaveAttribute(
      "href",
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    );
  });

  it("URL 복사 버튼을 누르면 현재 페이지 URL을 클립보드에 복사한다", async () => {
    window.history.replaceState(null, "", "/en/features/documentation/security-guide");
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<ContentShareActions locale="en" title="Security guide" />);
    await act(async () => {});

    await act(async () => {
      fireEvent.click(screen.getByLabelText("Copy URL"));
    });

    expect(writeText).toHaveBeenCalledWith("http://localhost:3000/en/features/documentation/security-guide");
    expect(screen.getByLabelText("Copied")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("URL copied");
  });

  it("공개 공유 URL을 받으면 소셜 링크와 URL 복사에 같은 URL을 사용한다", async () => {
    window.history.replaceState(null, "", "/ko/news/local-preview");
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <ContentShareActions
        locale="ko"
        shareUrl="https://www.querypie.com/ko/news/product-update"
        title="제품 업데이트"
      />,
    );
    await act(async () => {});

    const encodedUrl = encodeURIComponent("https://www.querypie.com/ko/news/product-update");
    expect(screen.getByLabelText("Facebook에 공유")).toHaveAttribute(
      "href",
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText("URL 복사"));
    });

    expect(writeText).toHaveBeenCalledWith("https://www.querypie.com/ko/news/product-update");
  });

  it("한국어 페이지에서는 복사 완료 팝오버를 한국어로 표시한다", async () => {
    window.history.replaceState(null, "", "/ko/news/product-update");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    render(<ContentShareActions locale="ko" title="제품 업데이트" />);
    await act(async () => {});

    await act(async () => {
      fireEvent.click(screen.getByLabelText("URL 복사"));
    });

    expect(screen.getByRole("status")).toHaveTextContent("URL이 복사되었습니다");
  });
});
