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
import { generateMetadata as g5 } from "./aip/integrations/page";
import Page5 from "./aip/integrations/page";
import Content5EN, { metadata as Metadata5EN } from "./aip/integrations/content.en";
import Content5KO, { metadata as Metadata5KO } from "./aip/integrations/content.ko";
import Content5JA, { metadata as Metadata5JA } from "./aip/integrations/content.ja";
import { generateMetadata as g6 } from "./acp/page";
import Page6 from "./acp/page";
import Content6EN, { metadata as Metadata6EN } from "./acp/content.en";
import Content6KO, { metadata as Metadata6KO } from "./acp/content.ko";
import Content6JA, { metadata as Metadata6JA } from "./acp/content.ja";
import { generateMetadata as g7 } from "./acp/database-access-controller/page";
import Page7 from "./acp/database-access-controller/page";
import Content7EN, { metadata as Metadata7EN } from "./acp/database-access-controller/content.en";
import Content7KO, { metadata as Metadata7KO } from "./acp/database-access-controller/content.ko";
import Content7JA, { metadata as Metadata7JA } from "./acp/database-access-controller/content.ja";
import { generateMetadata as g8 } from "./acp/system-access-controller/page";
import Page8 from "./acp/system-access-controller/page";
import Content8EN, { metadata as Metadata8EN } from "./acp/system-access-controller/content.en";
import Content8KO, { metadata as Metadata8KO } from "./acp/system-access-controller/content.ko";
import Content8JA, { metadata as Metadata8JA } from "./acp/system-access-controller/content.ja";
import { generateMetadata as g9 } from "./acp/kubernetes-access-controller/page";
import Page9 from "./acp/kubernetes-access-controller/page";
import Content9EN, { metadata as Metadata9EN } from "./acp/kubernetes-access-controller/content.en";
import Content9KO, { metadata as Metadata9KO } from "./acp/kubernetes-access-controller/content.ko";
import Content9JA, { metadata as Metadata9JA } from "./acp/kubernetes-access-controller/content.ja";
import { generateMetadata as g10 } from "./acp/web-access-controller/page";
import Page10 from "./acp/web-access-controller/page";
import Content10EN, { metadata as Metadata10EN } from "./acp/web-access-controller/content.en";
import Content10KO, { metadata as Metadata10KO } from "./acp/web-access-controller/content.ko";
import Content10JA, { metadata as Metadata10JA } from "./acp/web-access-controller/content.ja";
import { generateMetadata as g11 } from "./acp/integrations/page";
import Page11 from "./acp/integrations/page";
import Content11EN, { metadata as Metadata11EN } from "./acp/integrations/content.en";
import Content11KO, { metadata as Metadata11KO } from "./acp/integrations/content.ko";
import Content11JA, { metadata as Metadata11JA } from "./acp/integrations/content.ja";

const routeModules = {
  "aip": {
    page: Page1,
    generateMetadata: g1,
    content: { en: Content1EN, ko: Content1KO, ja: Content1JA },
    metadata: { en: Metadata1EN, ko: Metadata1KO, ja: Metadata1JA },
  },
  "aip-usage-based-llm": {
    page: Page2,
    generateMetadata: g2,
    content: { en: Content2EN, ko: Content2KO, ja: Content2JA },
    metadata: { en: Metadata2EN, ko: Metadata2KO, ja: Metadata2JA },
  },
  "aip-mcp-gateway": {
    page: Page3,
    generateMetadata: g3,
    content: { en: Content3EN, ko: Content3KO, ja: Content3JA },
    metadata: { en: Metadata3EN, ko: Metadata3KO, ja: Metadata3JA },
  },
  "aip-fde-services": {
    page: Page4,
    generateMetadata: g4,
    content: { en: Content4EN, ko: Content4KO, ja: Content4JA },
    metadata: { en: Metadata4EN, ko: Metadata4KO, ja: Metadata4JA },
  },
  "aip-integrations": {
    page: Page5,
    generateMetadata: g5,
    content: { en: Content5EN, ko: Content5KO, ja: Content5JA },
    metadata: { en: Metadata5EN, ko: Metadata5KO, ja: Metadata5JA },
  },
  "acp": {
    page: Page6,
    generateMetadata: g6,
    content: { en: Content6EN, ko: Content6KO, ja: Content6JA },
    metadata: { en: Metadata6EN, ko: Metadata6KO, ja: Metadata6JA },
  },
  "acp-database-access-controller": {
    page: Page7,
    generateMetadata: g7,
    content: { en: Content7EN, ko: Content7KO, ja: Content7JA },
    metadata: { en: Metadata7EN, ko: Metadata7KO, ja: Metadata7JA },
  },
  "acp-system-access-controller": {
    page: Page8,
    generateMetadata: g8,
    content: { en: Content8EN, ko: Content8KO, ja: Content8JA },
    metadata: { en: Metadata8EN, ko: Metadata8KO, ja: Metadata8JA },
  },
  "acp-kubernetes-access-controller": {
    page: Page9,
    generateMetadata: g9,
    content: { en: Content9EN, ko: Content9KO, ja: Content9JA },
    metadata: { en: Metadata9EN, ko: Metadata9KO, ja: Metadata9JA },
  },
  "acp-web-access-controller": {
    page: Page10,
    generateMetadata: g10,
    content: { en: Content10EN, ko: Content10KO, ja: Content10JA },
    metadata: { en: Metadata10EN, ko: Metadata10KO, ja: Metadata10JA },
  },
  "acp-integrations": {
    page: Page11,
    generateMetadata: g11,
    content: { en: Content11EN, ko: Content11KO, ja: Content11JA },
    metadata: { en: Metadata11EN, ko: Metadata11KO, ja: Metadata11JA },
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
