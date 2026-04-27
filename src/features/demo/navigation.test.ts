import { describe, expect, it } from "vitest";
import {
  getDemoSidebarMenuItems,
  getPublicDemoListHref,
  getPublicDemoListPageCopy,
  getPublicDemoMenuItems,
} from "./navigation";

describe("getPublicDemoListHref", () => {
  it("demo public list canonical 경로를 반환한다", () => {
    expect(getPublicDemoListHref("en", "use-cases")).toBe("/demo/use-cases");
    expect(getPublicDemoListHref("en", "aip-features")).toBe("/demo/aip");
    expect(getPublicDemoListHref("en", "acp-features")).toBe("/demo/acp");
    expect(getPublicDemoListHref("en", "webinars")).toBe("/webinars");
  });

  it("비영어 locale에는 locale prefix를 붙인다", () => {
    expect(getPublicDemoListHref("ko", "use-cases")).toBe("/ko/demo/use-cases");
    expect(getPublicDemoListHref("ja", "webinars")).toBe("/ja/webinars");
  });
});

describe("getPublicDemoListPageCopy", () => {
  it("webinars 일본어 타이틀을 유지한다", () => {
    expect(getPublicDemoListPageCopy("ja", "webinars")).toEqual({
      metadataTitle: "ウェビナー",
      title: "ウェビナー",
    });
  });
});

describe("getPublicDemoMenuItems", () => {
  it("현재 category를 active로 표시한 public demo 메뉴를 반환한다", () => {
    expect(getPublicDemoMenuItems("en", "acp-features")).toEqual([
      { href: "/demo/use-cases", isActive: false, label: "Use Cases" },
      { href: "/demo/aip", isActive: false, label: "AIP Features" },
      { href: "/demo/acp", isActive: true, label: "ACP Features" },
      { href: "/webinars", isActive: false, label: "Webinars" },
    ]);
  });
});

describe("getDemoSidebarMenuItems", () => {
  it("CMS endpoint와 MDX endpoint를 구분한 데모 sidebar 메뉴를 반환한다", () => {
    expect(getDemoSidebarMenuItems("en", "use-cases")).toEqual([
      { kind: "section", label: "CMS" },
      { href: "/features/demo", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/features/demo?category=use-cases",
        isActive: true,
        kind: "link",
        label: "Use Cases",
        slug: "use-cases",
      },
      {
        href: "/features/demo?category=aip-features",
        isActive: false,
        kind: "link",
        label: "AIP Features",
        slug: "aip-features",
      },
      {
        href: "/features/demo?category=acp-features",
        isActive: false,
        kind: "link",
        label: "ACP Features",
        slug: "acp-features",
      },
      {
        href: "/features/demo?category=webinars",
        isActive: false,
        kind: "link",
        label: "Webinars",
        slug: "webinars",
      },
      { kind: "divider" },
      { kind: "section", label: "MDX" },
      { href: "/demo/use-cases", isActive: false, kind: "link", label: "Use Cases", slug: "use-cases" },
      { href: "/demo/aip", isActive: false, kind: "link", label: "AIP Features", slug: "aip-features" },
      { href: "/demo/acp", isActive: false, kind: "link", label: "ACP Features", slug: "acp-features" },
      { href: "/webinars", isActive: false, kind: "link", label: "Webinars", slug: "webinars" },
    ]);
  });
});
