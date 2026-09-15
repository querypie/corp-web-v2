import { describe, expect, it } from "vitest";
import { getSolutionHref, solutionEntries } from "@/features/solutions/routes";

import { generateMetadata as g8 } from "./ai-crew/page";
import Page8 from "./ai-crew/page";
import { metadata as Metadata8JA } from "@/components/pages/solutions/japan/AiCrewPage";
import { aiCrewCopy } from "@/components/pages/solutions/japan/aiCrewCopy";
import { generateMetadata as g9 } from "./ai-dashi/page";
import Page9 from "./ai-dashi/page";
import { metadata as Metadata9JA } from "@/components/pages/solutions/japan/AiDashiPage";
import { aiDashiCopy } from "@/components/pages/solutions/japan/aiDashiCopy";
import As400CobolPage, { generateMetadata as as400CobolMetadata } from "./as400-cobol/page";

const routeModules = {
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
} as const;

describe("solutions route modules", () => {
  it.each(["en", "ko"])("AS400/COBOL 페이지는 %s에서 404를 반환한다", async (locale) => {
    const props = { params: Promise.resolve({ locale }) };
    await expect(As400CobolPage(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    await expect(as400CobolMetadata(props)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("모든 canonical solution entry에 대해 route-local page를 제공한다", () => {
    for (const entry of solutionEntries) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      expect(modules.page, `${entry.id} page`).toBeTypeOf("function");
    }
  });

  it("모든 canonical solution entry에 대해 route-local generateMetadata를 제공한다", async () => {
    for (const entry of solutionEntries) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      const supportedLocales = entry.locales ?? (["en", "ko", "ja"] as const);

      for (const locale of supportedLocales) {
        const metadata = await modules.generateMetadata({ params: Promise.resolve({ locale }) });
        expect(metadata).toMatchObject({
          title: expect.any(String),
          description: expect.any(String),
          alternates: { canonical: getSolutionHref(locale, entry.id) },
        });
      }
    }
  });
});
