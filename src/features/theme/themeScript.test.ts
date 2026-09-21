import { describe, expect, it, vi } from "vitest";
import { themeInitializationScript } from "./themeScript";

function runInitializationScript(pathname: string, hostname = "www.querypie.com") {
  const root = {
    dataset: {} as Record<string, string>,
    lang: "en",
    style: {} as Record<string, string>,
  };
  const themeColor = { setAttribute: vi.fn() };

  const execute = new Function("window", "document", "localStorage", themeInitializationScript);
  execute(
    { location: { pathname, hostname } },
    {
      documentElement: root,
      querySelector: () => themeColor,
    },
    { getItem: vi.fn(() => null) },
  );

  return root;
}

describe("themeInitializationScript", () => {
  it("querypie.ai 하위 도메인에서는 prefix 없이 일본어 테마를 초기화한다", () => {
    const root = runInitializationScript("/solutions/ai-crew", "stage-v2.querypie.ai");
    expect(root.lang).toBe("ja");
    expect(root.dataset.theme).toBe("light");
  });

  it.each([
    ["/en", "en"],
    ["/ko/features/demo", "ko"],
    ["/ja", "ja"],
    ["/admin", "en"],
  ])("%s 경로의 문서 언어를 %s로 설정한다", (pathname, expectedLocale) => {
    expect(runInitializationScript(pathname).lang).toBe(expectedLocale);
  });
});
