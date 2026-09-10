import { describe, expect, it, vi } from "vitest";
import { themeInitializationScript } from "./themeScript";

function runInitializationScript(pathname: string) {
  const root = {
    dataset: {} as Record<string, string>,
    lang: "en",
    style: {} as Record<string, string>,
  };
  const themeColor = { setAttribute: vi.fn() };

  const execute = new Function("window", "document", "localStorage", themeInitializationScript);
  execute(
    { location: { pathname } },
    {
      documentElement: root,
      querySelector: () => themeColor,
    },
    { getItem: vi.fn(() => null) },
  );

  return root;
}

describe("themeInitializationScript", () => {
  it.each([
    ["/en", "en"],
    ["/ko/features/demo", "ko"],
    ["/ja", "ja"],
    ["/admin", "en"],
  ])("%s 경로의 문서 언어를 %s로 설정한다", (pathname, expectedLocale) => {
    expect(runInitializationScript(pathname).lang).toBe(expectedLocale);
  });
});
