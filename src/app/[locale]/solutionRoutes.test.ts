import { offeringEntries } from "@/constants/offerings";
import { getOfferingHref } from "@/features/offerings/routes";
import { describe, expect, it, vi } from "vitest";

import { generateMetadata as g8 } from "@/app/[locale]/ai-crew/page";
import Page8 from "@/app/[locale]/ai-crew/page";
import { metadata as Metadata8JA } from "@/components/pages/solutions/ai-crew/AiCrewPage";
import { aiCrewCopy } from "@/copy/aiCrew";
import { generateMetadata as g9 } from "@/app/[locale]/ai-dashi/page";
import Page9 from "@/app/[locale]/ai-dashi/page";
import { metadata as Metadata9JA } from "@/components/pages/solutions/ai-dashi/AiDashiPage";
import { aiDashiCopy } from "@/copy/aiDashi";
import As400CobolPage, { generateMetadata as as400CobolMetadata } from "@/app/[locale]/as400-cobol/page";
import AiGatewayPage, { generateMetadata as aiGatewayMetadata } from "@/app/[locale]/ai-gateway/page";
import QlmPage, { generateMetadata as qlmMetadata } from "@/app/[locale]/qlm/page";
import QevPage, { generateMetadata as qevMetadata } from "@/app/[locale]/qev/page";
import PenetrationTestingPage, { generateMetadata as penetrationTestingMetadata } from "@/app/[locale]/penetration-testing/page";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "www.querypie.com" }),
}));

import LocalLlmPage, { generateMetadata as localLlmMetadata } from "@/app/[locale]/local-llm/page";

const routeModules = {
  "penetration-testing": { page: PenetrationTestingPage, generateMetadata: penetrationTestingMetadata },
  "local-llm": { page: LocalLlmPage, generateMetadata: localLlmMetadata },
  "ai-crew": {
    page: Page8,
    generateMetadata: g8,
    metadata: { en: aiCrewCopy.en.metadata, ko: aiCrewCopy.ko.metadata, ja: Metadata8JA },
  },
  "ai-dashi": {
    page: Page9,
    generateMetadata: g9,
    metadata: { en: aiDashiCopy.en.metadata, ko: aiDashiCopy.ko.metadata, ja: Metadata9JA },
  },
  "as400-cobol": {
    page: As400CobolPage,
    generateMetadata: as400CobolMetadata,
  },
  "ai-gateway": {
    page: AiGatewayPage,
    generateMetadata: aiGatewayMetadata,
  },
  qlm: {
    page: QlmPage,
    generateMetadata: qlmMetadata,
  },
  qev: {
    page: QevPage,
    generateMetadata: qevMetadata,
  },
} as const;

describe("solutions route modules", () => {
  it.each(["en", "ko", "ja"])("AI 솔루션과 모의 해킹 페이지는 %s 언어를 유지한다", async (locale) => {
    const props = { params: Promise.resolve({ locale }) };
    for (const id of ["ai-gateway", "penetration-testing", "qlm", "qev"] as const) {
      const element = await routeModules[id].page(props);
      expect(element.props.locale).toBe(locale);
      const metadata = await routeModules[id].generateMetadata(props);
      expect(metadata.alternates?.canonical).toBe(`https://www.querypie.com/${locale}/${id}`);
    }
  });
  it("AI 솔루션은 지원하지 않는 언어에 404를 반환한다", async () => {
    for (const id of ["ai-gateway", "penetration-testing", "qlm", "qev"] as const) {
      const props = { params: Promise.resolve({ locale: "fr" }) };
      await expect(routeModules[id].page(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
      await expect(routeModules[id].generateMetadata(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    }
  });
  it.each(["en", "ko"])("Local LLMページは%sで404を返す", async (locale) => {
    const props = { params: Promise.resolve({ locale }) };
    await expect(LocalLlmPage(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    await expect(localLlmMetadata(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it.each(["en", "ko"])("AS400/COBOL 페이지는 %s에서 404를 반환한다", async (locale) => {
    const props = { params: Promise.resolve({ locale }) };
    await expect(As400CobolPage(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    await expect(as400CobolMetadata(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("모든 canonical solution entry에 대해 route-local page를 제공한다", () => {
    for (const entry of offeringEntries.filter(entry => entry.id in routeModules)) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      expect(modules.page, `${entry.id} page`).toBeTypeOf("function");
    }
  });

  it("모든 canonical solution entry에 대해 route-local generateMetadata를 제공한다", async () => {
    for (const entry of offeringEntries.filter(entry => entry.id in routeModules)) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      const supportedLocales = entry.locales ?? (["en", "ko", "ja"] as const);

      for (const locale of supportedLocales) {
        const metadata = await modules.generateMetadata({ params: Promise.resolve({ locale }) });
        expect(metadata).toMatchObject({
          title: expect.any(String),
          description: expect.any(String),
          alternates: {
            canonical: new URL(getOfferingHref(locale, entry.id), "https://www.querypie.com").toString(),
          },
        });
      }
    }
  });
});
