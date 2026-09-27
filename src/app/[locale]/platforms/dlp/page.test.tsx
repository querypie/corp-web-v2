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

  it("Preview에서는 페이지와 metadata를 노출한다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");

    const metadata = await generateMetadata(pageProps);
    const page = await DlpPlatformPage(pageProps);

    expect(metadata).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
      alternates: {
        canonical: "https://www.querypie.com/en/platforms/dlp",
      },
    });
    expect(page.props.locale).toBe("en");
    expect(navigationMocks.notFound).not.toHaveBeenCalled();
  });

  it.each(["production", undefined])("%s 환경에서는 페이지를 숨긴다", async (environment) => {
    vi.stubEnv("VERCEL_TARGET_ENV", environment);

    await expect(generateMetadata(pageProps)).resolves.toEqual({});
    await expect(DlpPlatformPage(pageProps)).rejects.toThrow("NEXT_NOT_FOUND");
    expect(navigationMocks.notFound).toHaveBeenCalledOnce();
  });
});
