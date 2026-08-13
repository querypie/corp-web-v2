import { describe, expect, it } from "vitest";
import { getSolutionHref, solutionEntries } from "@/features/solutions/routes";

import { generateMetadata as g1 } from "./aip/page";
import Page1 from "./aip/page";
import Content1EN, { metadata as Metadata1EN } from "@/components/pages/solutions/aip/content.en";
import Content1KO, { metadata as Metadata1KO } from "@/components/pages/solutions/aip/content.ko";
import Content1JA, { metadata as Metadata1JA } from "@/components/pages/solutions/aip/content.ja";
import { generateMetadata as g2 } from "./aip/usage-based-llm/page";
import Page2 from "./aip/usage-based-llm/page";
import Content2EN, { metadata as Metadata2EN } from "@/components/pages/solutions/aip/usage-based-llm/content.en";
import Content2KO, { metadata as Metadata2KO } from "@/components/pages/solutions/aip/usage-based-llm/content.ko";
import Content2JA, { metadata as Metadata2JA } from "@/components/pages/solutions/aip/usage-based-llm/content.ja";
import { generateMetadata as g3 } from "./aip/mcp-gateway/page";
import Page3 from "./aip/mcp-gateway/page";
import Content3EN, { metadata as Metadata3EN } from "@/components/pages/solutions/aip/mcp-gateway/content.en";
import Content3KO, { metadata as Metadata3KO } from "@/components/pages/solutions/aip/mcp-gateway/content.ko";
import Content3JA, { metadata as Metadata3JA } from "@/components/pages/solutions/aip/mcp-gateway/content.ja";
import { generateMetadata as g4 } from "./aip/fde-services/page";
import Page4 from "./aip/fde-services/page";
import Content4EN, { metadata as Metadata4EN } from "@/components/pages/solutions/aip/fde-services/content.en";
import Content4KO, { metadata as Metadata4KO } from "@/components/pages/solutions/aip/fde-services/content.ko";
import Content4JA, { metadata as Metadata4JA } from "@/components/pages/solutions/aip/fde-services/content.ja";
import { generateMetadata as g5 } from "./aip/integrations/page";
import Page5 from "./aip/integrations/page";
import { generateMetadata as g6 } from "./acp/page";
import Page6 from "./acp/page";
import Content6EN, { metadata as Metadata6EN } from "@/components/pages/solutions/acp/content.en";
import Content6KO, { metadata as Metadata6KO } from "@/components/pages/solutions/acp/content.ko";
import Content6JA, { metadata as Metadata6JA } from "@/components/pages/solutions/acp/content.ja";
import { generateMetadata as g7 } from "./acp/integrations/page";
import Page7 from "./acp/integrations/page";
import { generateMetadata as g8 } from "./ai-crew/page";
import Page8 from "./ai-crew/page";
import { metadata as Metadata8JA } from "@/components/pages/solutions/japan/AiCrewPage";
import { aiCrewCopy } from "@/components/pages/solutions/japan/aiCrewCopy";
import { generateMetadata as g9 } from "./ai-dashi/page";
import Page9 from "./ai-dashi/page";
import { metadata as Metadata9JA } from "@/components/pages/solutions/japan/AiDashiPage";
import { aiDashiCopy } from "@/components/pages/solutions/japan/aiDashiCopy";

const routeModules = {
  "aip": {
    page: Page1,
    generateMetadata: g1,
    content: { en: Content1EN, ko: Content1KO, ja: Content1JA },
    metadata: { en: Metadata1EN, ko: Metadata1KO, ja: Metadata1JA },
  },
  "usage-based-llm": {
    page: Page2,
    generateMetadata: g2,
    content: { en: Content2EN, ko: Content2KO, ja: Content2JA },
    metadata: { en: Metadata2EN, ko: Metadata2KO, ja: Metadata2JA },
  },
  "mcp-gateway": {
    page: Page3,
    generateMetadata: g3,
    content: { en: Content3EN, ko: Content3KO, ja: Content3JA },
    metadata: { en: Metadata3EN, ko: Metadata3KO, ja: Metadata3JA },
  },
  "fde-services": {
    page: Page4,
    generateMetadata: g4,
    content: { en: Content4EN, ko: Content4KO, ja: Content4JA },
    metadata: { en: Metadata4EN, ko: Metadata4KO, ja: Metadata4JA },
  },
  "aip-integrations": {
    page: Page5,
    generateMetadata: g5,
  },
  "acp": {
    page: Page6,
    generateMetadata: g6,
    content: { en: Content6EN, ko: Content6KO, ja: Content6JA },
    metadata: { en: Metadata6EN, ko: Metadata6KO, ja: Metadata6JA },
  },
  "acp-integrations": {
    page: Page7,
    generateMetadata: g7,
  },
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
} as const;

describe("solutions solution route modules", () => {
  it("모든 canonical solution entry에 대해 route-local page를 제공한다", () => {
    for (const entry of solutionEntries) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      expect(modules.page, `${entry.id} page`).toBeTypeOf("function");
    }
  });

  it("content 기반 solution entry에 대해 solution content 모듈을 제공한다", () => {
    for (const entry of solutionEntries) {
      const modules = routeModules[entry.id as keyof typeof routeModules];

      if (!("content" in modules)) continue;

      expect(modules.content.en, `${entry.id} en`).toBeTypeOf("function");
      expect(modules.content.ko, `${entry.id} ko`).toBeTypeOf("function");
      expect(modules.content.ja, `${entry.id} ja`).toBeTypeOf("function");
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
