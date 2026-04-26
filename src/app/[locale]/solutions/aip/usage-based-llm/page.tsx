import { createGenerateMetadata, createSolutionPage } from "../../_shared/pageHelpers";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";
import metadataByLocale from "./metadata";

export const generateMetadata = createGenerateMetadata("aip-usage-based-llm", metadataByLocale);

export default createSolutionPage({
  en: ContentEN,
  ko: ContentKO,
  ja: ContentJA,
});
