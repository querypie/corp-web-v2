import { describe, expect, it } from "vitest";
import { getSolutionHref, solutionEntries } from "@/features/solutions/routes";

import { generateMetadata as g1 } from "./aip/page";
import Page1 from "./aip/page";
import Content1EN, { metadata as Metadata1EN } from "./aip/content.en";
import Content1KO, { metadata as Metadata1KO } from "./aip/content.ko";
import Content1JA, { metadata as Metadata1JA } from "./aip/content.ja";
import { generateMetadata as g2 } from "./aip/usage-based-llm/page";
import Page2 from "./aip/usage-based-llm/page";
import Content2EN, { metadata as Metadata2EN } from "./aip/usage-based-llm/content.en";
import Content2KO, { metadata as Metadata2KO } from "./aip/usage-based-llm/content.ko";
import Content2JA, { metadata as Metadata2JA } from "./aip/usage-based-llm/content.ja";
import { generateMetadata as g3 } from "./aip/mcp-gateway/page";
import Page3 from "./aip/mcp-gateway/page";
import Content3EN, { metadata as Metadata3EN } from "./aip/mcp-gateway/content.en";
import Content3KO, { metadata as Metadata3KO } from "./aip/mcp-gateway/content.ko";
import Content3JA, { metadata as Metadata3JA } from "./aip/mcp-gateway/content.ja";
import { generateMetadata as g4 } from "./aip/fde-services/page";
import Page4 from "./aip/fde-services/page";
import Content4EN, { metadata as Metadata4EN } from "./aip/fde-services/content.en";
import Content4KO, { metadata as Metadata4KO } from "./aip/fde-services/content.ko";
import Content4JA, { metadata as Metadata4JA } from "./aip/fde-services/content.ja";
import { generateMetadata as g6 } from "./acp/page";
import Page6 from "./acp/page";
import Content6EN, { metadata as Metadata6EN } from "./acp/content.en";
import Content6KO, { metadata as Metadata6KO } from "./acp/content.ko";
import Content6JA, { metadata as Metadata6JA } from "./acp/content.ja";

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
  "acp": {
    page: Page6,
    generateMetadata: g6,
    content: { en: Content6EN, ko: Content6KO, ja: Content6JA },
    metadata: { en: Metadata6EN, ko: Metadata6KO, ja: Metadata6JA },
  },
} as const;

describe("solutions route-local modules", () => {
  it("모든 canonical solution entry에 대해 route-local content 모듈을 제공한다", () => {
    for (const entry of solutionEntries) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      expect(modules.page, `${entry.id} page`).toBeTypeOf("function");
      expect(modules.content.en, `${entry.id} en`).toBeTypeOf("function");
      expect(modules.content.ko, `${entry.id} ko`).toBeTypeOf("function");
      expect(modules.content.ja, `${entry.id} ja`).toBeTypeOf("function");
    }
  });

  it("모든 canonical solution entry에 대해 route-local generateMetadata를 제공한다", async () => {
    for (const entry of solutionEntries) {
      const modules = routeModules[entry.id as keyof typeof routeModules];
      const metadata = await modules.generateMetadata({ params: Promise.resolve({ locale: "en" }) });
      const localizedMetadata = await modules.generateMetadata({ params: Promise.resolve({ locale: "ko" }) });
      const japaneseMetadata = await modules.generateMetadata({ params: Promise.resolve({ locale: "ja" }) });

      expect(metadata).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        alternates: { canonical: getSolutionHref("en", entry.id) },
      });
      expect(localizedMetadata).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        alternates: { canonical: getSolutionHref("ko", entry.id) },
      });
      expect(japaneseMetadata).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        alternates: { canonical: getSolutionHref("ja", entry.id) },
      });
    }
  });
});
