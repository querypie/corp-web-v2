import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./not-found";

const request = vi.hoisted(() => ({ hostname: "querypie.ai", pathname: "/blog/missing" }));
vi.mock("@/features/seo/requestUrl.server", () => ({
  getRequestSiteOrigin: async () => new URL(`https://${request.hostname}`),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => request.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));

describe("404 사이트별 화면", () => {
  it.each(["querypie.ai", "www.querypie.ai", "stage-v2.querypie.ai"])(
    "%s는 일본어 문구·메뉴·테마를 적용하고 언어 선택을 숨긴다", async (hostname) => {
      request.hostname = hostname;
      request.pathname = "/blog/terrasky-mitoco-buddy";
      render(await NotFound());
      expect(screen.getByText("お探しのページは移動したか、見つかりませんでした。")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "ホームへ戻る" })).toHaveAttribute("href", "/");
      expect(document.documentElement.lang).toBe("ja");
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(screen.queryByRole("button", { name: "Change language" })).not.toBeInTheDocument();
      expect(screen.queryByText("価格・プラン")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      expect(screen.getAllByRole("link", { name: "AS/400・COBOLモダナイゼーション" }).length).toBeGreaterThan(0);
      expect(screen.queryByRole("link", { name: "English" })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "한국어" })).not.toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toHaveTextContent("リソース");
    },
  );

  it.each([
    ["www.querypie.com", "/ko/missing", "ko", "홈으로 돌아가기", "/ko"],
    ["www.querypie.com", "/en/missing", "en", "Back to home", "/en"],
    ["querypie.ai.example.com", "/missing", "en", "Back to home", "/en"],
  ])("%s%s는 기존 다국어 화면을 유지한다", async (hostname, pathname, locale, label, href) => {
    request.hostname = hostname;
    request.pathname = pathname;
    render(await NotFound());
    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    expect(screen.getAllByRole("button", { name: "Change language" })).toHaveLength(2);
    expect(document.documentElement.lang).toBe(locale);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
