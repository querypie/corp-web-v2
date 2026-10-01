import { afterEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => navigationMocks);
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "www.querypie.com" }),
}));

import DlpPlatformPage, { generateMetadata } from "./page";

const pageProps = {
  params: Promise.resolve({ locale: "en" }),
  searchParams: Promise.resolve({}),
};

describe("DLP 제품 소개 route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    navigationMocks.notFound.mockClear();
  });

  describe.each(["preview", "production", undefined])("%s 환경", (environment) => {
    it.each(["en", "ko"])("%s 페이지와 metadata를 노출한다", async (locale) => {
      vi.stubEnv("VERCEL_TARGET_ENV", environment);
      const localizedProps = { ...pageProps, params: Promise.resolve({ locale }) };

      const metadata = await generateMetadata(localizedProps);
      const page = await DlpPlatformPage(localizedProps);

      expect(metadata).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        alternates: {
          canonical: `https://www.querypie.com/${locale}/platforms/dlp`,
        },
      });
      expect(page.props.locale).toBe(locale);
      expect(navigationMocks.notFound).not.toHaveBeenCalled();
    });

    it("일본어 제품 페이지와 metadata는 숨긴다", async () => {
      vi.stubEnv("VERCEL_TARGET_ENV", environment);
      const jaProps = { ...pageProps, params: Promise.resolve({ locale: "ja" }) };

      await expect(generateMetadata(jaProps)).resolves.toEqual({});
      await expect(DlpPlatformPage(jaProps)).rejects.toThrow("NEXT_NOT_FOUND");
      expect(navigationMocks.notFound).toHaveBeenCalledOnce();
    });
  });
});
