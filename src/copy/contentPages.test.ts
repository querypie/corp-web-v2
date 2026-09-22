import { describe, expect, it } from "vitest";
import { getResourcesPageCopy } from "./contentPages";

describe("getResourcesPageCopy", () => {
  it("자료 페이지의 화면 및 metadata 타이틀을 locale별 페이지명으로 반환한다", () => {
    expect(getResourcesPageCopy("en")).toMatchObject({ metadataTitle: "Resources", title: "Resources" });
    expect(getResourcesPageCopy("ko")).toMatchObject({ metadataTitle: "자료", title: "리소스" });
    expect(getResourcesPageCopy("ja")).toMatchObject({ metadataTitle: "リソース", title: "リソース" });
  });
});
