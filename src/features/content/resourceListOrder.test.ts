import { describe, expect, it } from "vitest";
import { createEmptyManagedContentDraft, createLocalizedContent } from "./data";
import { sortResourceCategoryItems } from "./resourceListOrder";

const items = [
  { ...createEmptyManagedContentDraft("resources", "manuals"), id: "aip", title: createLocalizedContent("QueryPie AIP Manual") },
  { ...createEmptyManagedContentDraft("resources", "manuals"), id: "acp", title: createLocalizedContent("QueryPie ACP Manual") },
  { ...createEmptyManagedContentDraft("resources", "manuals"), id: "other", title: createLocalizedContent("Getting Started") },
  { ...createEmptyManagedContentDraft("resources", "manuals"), id: "acp-community", title: createLocalizedContent("QueryPie ACP Community Edition Installation Guide") },
];

describe("sortResourceCategoryItems", () => {
  it.each(["en", "ko"] as const)("%s 제품소개·매뉴얼에서 ACP를 먼저 표시하고 기존 상대 순서를 유지한다", (locale) => {
    for (const category of ["introduction", "manuals"] as const) {
      const sorted = sortResourceCategoryItems(items, locale, category);

      expect(sorted.map((item) => item.id)).toEqual(["acp", "acp-community", "aip", "other"]);
      expect(items.map((item) => item.id)).toEqual(["aip", "acp", "other", "acp-community"]);
    }
  });

  it("일본어 목록은 모든 카테고리에서 기존 순서를 유지한다", () => {
    for (const category of ["introduction", "manuals"] as const) {
      expect(sortResourceCategoryItems(items, "ja", category)).toEqual(items);
    }
  });

  it.each(["en", "ko"] as const)("%s 전체 목록과 다른 리소스 카테고리는 기존 순서를 유지한다", (locale) => {
    for (const category of ["all", "blogs", "glossary", "white-papers", "voc", "events"] as const) {
      expect(sortResourceCategoryItems(items, locale, category)).toEqual(items);
    }
  });
});
