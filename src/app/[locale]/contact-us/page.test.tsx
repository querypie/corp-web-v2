import { describe, expect, it, vi } from "vitest";
import { aruProductLabels } from "@/copy/contact";

vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_NOT_FOUND"); },
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "www.querypie.com" }),
}));

import ContactUsRoute, { generateMetadata } from "./page";

describe("문의 route의 Aru 선택", () => {
  it.each(["en", "ko", "ja"] as const)("%s 에서 Aru를 첫 번째에 표시하고 CTA 유입 시 기본 선택한다", async (locale) => {
    const page = await ContactUsRoute({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({ utm_source: "aru", utm_medium: "web", utm_campaign: "footer_contact" }),
    });

    expect(page.props.initialProducts).toEqual([aruProductLabels[locale]]);
    expect(page.props.productOptions[0]).toBe(aruProductLabels[locale]);
  });

  describe.each(["en", "ko", "ja"])("%s 기본 선택", (locale) => {
    it.each([{}, { utm_source: "other" }, { utm_source: ["aru", "other"] }])(
      "일반 방문이나 모호한 유입에서는 기본 선택하지 않는다: %j",
      async (searchParams) => {
        const page = await ContactUsRoute({ params: Promise.resolve({ locale }), searchParams: Promise.resolve(searchParams) });
        expect(page.props.initialProducts).toEqual([]);
      },
    );
  });

  it("CTA 쿼리가 canonical URL에 포함되지 않는다", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "ja" }),
      searchParams: Promise.resolve({ utm_source: "aru" }),
    });
    expect(metadata.alternates?.canonical).toBe("https://www.querypie.com/ja/contact-us");
  });
});
