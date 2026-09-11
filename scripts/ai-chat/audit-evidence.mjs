import { readFile } from "node:fs/promises";
import { reviewEvidenceSection } from "../../src/features/ai-chat/evidencePolicy.ts";

const changes = [];
let sections = 0;
for (const file of ["knowledge.snapshot.json", "curated-product-facts.json", "approved-knowledge.json"]) {
  const source = JSON.parse(await readFile(new URL(`../../src/features/ai-chat/${file}`, import.meta.url), "utf8"));
  for (const document of source.documents) {
    document.chunks.forEach((section, index) => {
      sections += 1;
      const result = reviewEvidenceSection(document, section);
      if (!result.removed.length) return;
      changes.push({
        file, documentId: document.id, sectionIndex: index, locale: document.locale,
        sourceUrl: document.url, heading: section.heading,
        disposition: result.text ? "trimmed" : "withheld",
        retainedText: result.text, removed: result.removed,
      });
    });
  }
}
console.log(JSON.stringify({
  sections,
  unchanged: sections - changes.length,
  trimmed: changes.filter((change) => change.disposition === "trimmed").length,
  withheld: changes.filter((change) => change.disposition === "withheld").length,
  changes,
}, null, 2));
