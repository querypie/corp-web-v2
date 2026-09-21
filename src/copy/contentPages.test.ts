import { describe, expect, it } from "vitest";
import { getDocumentationPageCopy } from "./contentPages";

describe("getDocumentationPageCopy", () => {
  it("자료 페이지의 화면 및 metadata 타이틀을 locale별 페이지명으로 반환한다", () => {
    expect(getDocumentationPageCopy("en")).toMatchObject({ metadataTitle: "Resource", title: "Resource" });
    expect(getDocumentationPageCopy("ko")).toMatchObject({ metadataTitle: "자료", title: "리소스" });
    expect(getDocumentationPageCopy("ja")).toMatchObject({ metadataTitle: "リソース", title: "リソース" });
  });
});
