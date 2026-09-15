import { describe, expect, it } from "vitest";
import {
  getDemoSubItems,
  getCompanySubItems,
  getFeaturesSubItems,
  getFooterHref,
  getPlansSubItems,
  getPlatformSubItems,
  getPrimaryNavHref,
  getResourcesSubItems,
  getShellMenuCopy,
  getSolutionsSubItems,
} from "./navigation";

describe("플랫폼과 일본 전용 솔루션", () => {
  it.each(["en", "ko", "ja"])("%s 플랫폼은 AIP, ACP, FDE 순서로 연결한다", (locale) => {
    expect(getPlatformSubItems(locale).map((item) => item.href)).toEqual([
      `/${locale}/platforms/aip`,
      `/${locale}/platforms/acp`,
      `/${locale}/platforms/aip/fde-services`,
    ]);
    for (const item of getPlatformSubItems(locale)) {
      expect(getFooterHref(item.label, locale)).toBe(item.href);
    }
  });

  it("솔루션은 일본어에만 세 메뉴를 표시한다", () => {
    expect(getSolutionsSubItems("en")).toEqual([]);
    expect(getSolutionsSubItems("ko")).toEqual([]);
    expect(getSolutionsSubItems("ja")).toEqual([
      { label: "社内業務効率化｜AI Crew", href: "/ja/solutions/ai-crew" },
      { label: "自社サービスAI化｜AI Dashi", href: "/ja/solutions/ai-dashi" },
      { label: "AS/400・COBOLモダナイゼーション", href: "/ja/solutions/as400-cobol" },
    ]);
  });
});

describe("getDemoSubItems", () => {
  it("Demo 메뉴를 CMS demo 경로로 연결한다", () => {
    expect(getDemoSubItems("en")).toEqual([
      { label: "AIP Use Cases", href: "/en/demo/aip" },
      { label: "ACP Use Cases", href: "/en/demo/acp" },
    ]);
  });

  it("locale별 prefix를 붙인다", () => {
    expect(getDemoSubItems("ko")).toEqual([
      { label: "AIP 활용", href: "/ko/demo/aip" },
      { label: "ACP 활용", href: "/ko/demo/acp" },
    ]);
  });
});

describe("getFeaturesSubItems", () => {
  it("Features 메뉴를 Demo / Documentation 목록 경로로 연결한다", () => {
    expect(getFeaturesSubItems("en")).toEqual([
      { label: "Demo", href: "/en/demo" },
      { label: "Documentation", href: "/en/documentation" },
    ]);
  });

  it("locale별 prefix를 붙인다", () => {
    expect(getFeaturesSubItems("ko")).toEqual([
      { label: "데모", href: "/ko/demo" },
      { label: "문서", href: "/ko/documentation" },
    ]);
  });
});

describe("getResourcesSubItems", () => {
  it("Resources 메뉴를 CMS documentation 경로로 연결한다", () => {
    expect(getResourcesSubItems("en")).toEqual([
      { label: "Introduction Decks", href: "/en/introduction-deck" },
      { label: "Glossary", href: "/en/glossary" },
      { label: "Manuals", href: "/en/manuals" },
      { label: "White Papers", href: "/en/whitepapers" },
      { label: "Blog", href: "/en/blog" },
      { label: "VOC", href: "/en/voc" },
      { label: "Events", href: "/en/events" },
    ]);
  });

  it("locale별 prefix를 붙인다", () => {
    expect(getResourcesSubItems("ko")).toEqual([
      { label: "제품 소개", href: "/ko/introduction-deck" },
      { label: "용어집", href: "/ko/glossary" },
      { label: "매뉴얼", href: "/ko/manuals" },
      { label: "화이트페이퍼", href: "/ko/whitepapers" },
      { label: "블로그", href: "/ko/blog" },
      { label: "고객의 목소리", href: "/ko/voc" },
      { label: "이벤트", href: "/ko/events" },
    ]);
  });
});

describe("getCompanySubItems", () => {
  it("News 메뉴를 public news 경로로 연결한다", () => {
    expect(getCompanySubItems("ko")).toContainEqual({ label: "뉴스", href: "/ko/news" });
  });
});

describe("getShellMenuCopy", () => {
  it("GNB 상위 메뉴를 Platform / 일본 전용 Solutions / Demo / Resource / Company / Plans 순서로 반환한다", () => {
    expect(getShellMenuCopy("en").navItems).toEqual(["Platform", "Demo", "Resource", "Company", "Plans"]);
    expect(getShellMenuCopy("ko").navItems).toEqual(["플랫폼", "데모", "리소스", "회사", "가격 · 플랜"]);
    expect(getShellMenuCopy("ja").navItems).toEqual(["プラットフォーム", "ソリューション", "デモ", "リソース", "会社"]);
  });

  it("GNB CTA 라벨을 locale별로 반환한다", () => {
    expect(getShellMenuCopy("en").navActionLabel).toBe("Free start!");
    expect(getShellMenuCopy("ko").navActionLabel).toBe("무료로 시작하기");
    expect(getShellMenuCopy("ja").navActionLabel).toBe("無料で始める");
  });

  it("푸터 메뉴를 locale별로 반환한다", () => {
    expect(getShellMenuCopy("ko").footerSections).toEqual([
      { title: "플랫폼", items: ["AI 플랫폼 (AIP)", "접근 제어 플랫폼 (ACP)", "FDE 서비스"] },
      { title: "데모", items: ["AIP 활용", "ACP 활용"] },
      { title: "리소스", items: ["제품 소개", "용어집", "매뉴얼", "화이트페이퍼", "블로그", "고객의 목소리", "이벤트", "AIP 시작하기", "AIP 문서", "ACP 커뮤니티 에디션", "ACP 문서"] },
      { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기"] },
      { title: "가격 · 플랜", items: ["AIP", "ACP"] },
    ]);
    expect(getShellMenuCopy("ja").footerSections).toEqual([
      { title: "プラットフォーム", items: ["AIプラットフォーム (AIP)", "アクセス制御プラットフォーム (ACP)", "FDEサービス"] },
      { title: "ソリューション", items: ["社内業務効率化｜AI Crew", "自社サービスAI化｜AI Dashi", "AS/400・COBOLモダナイゼーション"] },
      { title: "デモ", items: ["AIP機能", "ACP機能"] },
      { title: "リソース", items: ["製品紹介", "用語集", "マニュアル", "ホワイトペーパー", "ブログ", "お客様の声", "イベント", "AIPを始める", "AIP ドキュメント", "ACP コミュニティエディション", "ACP ドキュメント"] },
      { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ"] },
    ]);
  });
});

describe("plans navigation", () => {
  it("Plans 메뉴는 AIP/ACP 경로를 사용한다", () => {
    expect(getPlansSubItems("en")).toEqual([
      { label: "AIP", href: "/en/plans/aip" },
      { label: "ACP", href: "/en/plans/acp" },
    ]);
    expect(getPlansSubItems("ko")).toEqual([
      { label: "AIP", href: "/ko/plans/aip" },
      { label: "ACP", href: "/ko/plans/acp" },
    ]);
  });

  it("상위 Plans 링크는 기본 AIP 경로로 연결한다", () => {
    expect(getPrimaryNavHref("Plans", "en")).toBe("/en/plans/aip");
    expect(getPrimaryNavHref("가격 · 플랜", "ko")).toBe("/ko/plans/aip");
    expect(getPrimaryNavHref("AIP", "ja")).toBe("/ja/plans/aip");
    expect(getPrimaryNavHref("ACP", "ja")).toBe("/ja/plans/acp");
  });
});

describe("getFooterHref", () => {
  it("footer solutions 링크도 canonical solutions 경로를 사용한다", () => {
    expect(getFooterHref("AI Platform (AIP)", "en")).toBe("/en/platforms/aip");
    expect(getFooterHref("접근 제어 플랫폼 (ACP)", "ko")).toBe("/ko/platforms/acp");
    expect(getFooterHref("AIプラットフォーム (AIP)", "ja")).toBe("/ja/platforms/aip");
    expect(getFooterHref("社内業務効率化｜AI Crew", "ja")).toBe("/ja/solutions/ai-crew");
    expect(getFooterHref("自社サービスAI化｜AI Dashi", "ja")).toBe("/ja/solutions/ai-dashi");
    expect(getFooterHref("AS/400・COBOLモダナイゼーション", "ja")).toBe("/ja/solutions/as400-cobol");
    expect(getFooterHref("Workplace Productivity | AI Crew", "en")).toBe("/en/solutions/ai-crew");
    expect(getFooterHref("AI for Your Service | AI Dashi", "en")).toBe("/en/solutions/ai-dashi");
    expect(getFooterHref("사내 업무 효율화 | AI Crew", "ko")).toBe("/ko/solutions/ai-crew");
    expect(getFooterHref("자사 서비스 AI화 | AI Dashi", "ko")).toBe("/ko/solutions/ai-dashi");
  });

  it("다국어 footer Demo / Resource 링크를 올바른 대상에 연결한다", () => {
    expect(getFooterHref("AIP 활용", "ko")).toBe("/ko/demo/aip");
    expect(getFooterHref("ACP機能", "ja")).toBe("/ja/demo/acp");
    expect(getFooterHref("제품 소개", "ko")).toBe("/ko/introduction-deck");
    expect(getFooterHref("お客様の声", "ja")).toBe("/ja/voc");
    expect(getFooterHref("Events", "en")).toBe("/en/events");
  });

  it("다국어 footer 기능 링크를 올바른 대상에 연결한다", () => {
    expect(getFooterHref("AIP 시작하기", "ko")).toBe("https://app.querypie.com/");
    expect(getFooterHref("AIPを始める", "ja")).toBe("https://app.querypie.com/");
    expect(getFooterHref("ACP 커뮤니티 에디션", "ko")).toBe(
      "https://docs.querypie.com/ko/installation/querypie-acp-community-edition",
    );
    expect(getFooterHref("ACP ドキュメント", "ja")).toBe("https://docs.querypie.com/ko");
  });

  it("footer plans 링크는 AIP/ACP 경로를 사용한다", () => {
    expect(getFooterHref("AIP", "en")).toBe("/en/plans/aip");
    expect(getFooterHref("ACP", "ko")).toBe("/ko/plans/acp");
    expect(getFooterHref("価格・プラン", "ja")).toBe("/ja/plans/aip");
  });

  it("footer news 링크는 public news 경로를 사용한다", () => {
    expect(getFooterHref("뉴스", "ko")).toBe("/ko/news");
  });
});
