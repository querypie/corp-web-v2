import { generateJSON } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { describe, expect, it } from "vitest";
import { ContentTableLayout } from "./tableLayout";
import { renderTiptapHtml } from "./tiptapHtml";

describe("content table layout", () => {
  it("인물 표의 반응형 배치를 HTML과 에디터 JSON 사이에서 유지한다", () => {
    const json = generateJSON(
      '<table data-content-layout="profiles"><tbody><tr><td><p>Portrait</p></td><td><p>Biography</p></td></tr></tbody></table>',
      [StarterKit, TableKit, ContentTableLayout],
    );
    expect(json.content?.[0].attrs?.layout).toBe("profiles");
    expect(renderTiptapHtml(JSON.stringify(json))).toContain('data-content-layout="profiles"');
  });

  it("일반 표에는 인물 배치를 적용하지 않는다", () => {
    const json = generateJSON(
      "<table><tbody><tr><td><p>Data</p></td></tr></tbody></table>",
      [StarterKit, TableKit, ContentTableLayout],
    );
    expect(json.content?.[0].attrs?.layout).toBeNull();
    expect(renderTiptapHtml(JSON.stringify(json))).not.toContain("data-content-layout");
  });
});
