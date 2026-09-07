import { describe, expect, it } from "vitest";
import { translateAdminCopy } from "./i18n";

describe("admin i18n", () => {
  it("keeps Korean source copy unchanged", () => {
    expect(translateAdminCopy("ko", "삭제")).toBe("삭제");
  });

  it("translates registered dashboard copy to Korean", () => {
    expect(translateAdminCopy("ko", "Dashboard")).toBe("대시보드");
    expect(translateAdminCopy("ko", "Demo")).toBe("데모");
    expect(translateAdminCopy("ko", "AIP Use Cases")).toBe("AIP 활용");
    expect(translateAdminCopy("ko", "ACP Use Cases")).toBe("ACP 활용");
    expect(translateAdminCopy("ko", "Documentation")).toBe("자료");
    expect(translateAdminCopy("ko", "White Papers")).toBe("화이트페이퍼");
    expect(translateAdminCopy("ko", "VOC")).toBe("고객의 목소리");
    expect(translateAdminCopy("ko", "Content operations")).toBe("콘텐츠 운영");
    expect(translateAdminCopy("ko", "Open Vercel Analytics")).toBe("Vercel Analytics 열기");
  });

  it("translates registered admin copy to Japanese", () => {
    expect(translateAdminCopy("ja", "삭제")).toBe("削除");
    expect(translateAdminCopy("ja", "Dashboard")).toBe("ダッシュボード");
    expect(translateAdminCopy("ja", "Demo")).toBe("デモ");
    expect(translateAdminCopy("ja", "AIP Use Cases")).toBe("AIP機能");
    expect(translateAdminCopy("ja", "ACP Use Cases")).toBe("ACP機能");
    expect(translateAdminCopy("ja", "Documentation")).toBe("リソース");
    expect(translateAdminCopy("ja", "Vercel Web Analytics")).toBe("Vercelウェブアナリティクス");
  });

  it("keeps product names and unknown copy unchanged", () => {
    expect(translateAdminCopy("ja", "QueryPie")).toBe("QueryPie");
  });
});
