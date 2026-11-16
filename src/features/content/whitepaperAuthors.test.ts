import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve("src/content/resources/white-papers");
const entries = readdirSync(root).map((directory) => JSON.parse(readFileSync(path.join(root, directory, "meta.json"), "utf8")));

describe("화이트페이퍼 작성자 프로필 이관", () => {
  it("30편에 사용 가능한 사진과 언어별 작성자 정보가 있고 DLP 백서도 편집부로 표시된다", () => {
    expect(entries).toHaveLength(30);
    const dlp = entries.find((entry) => entry.id === "ai-security-intelligence-dlp-ueba");
    expect(dlp).toMatchObject({ authorName: "QueryPie Editorial Team", authorNameByLocale: { ko: "QueryPie 편집부" } });

    for (const entry of entries) {
      for (const locale of ["en", "ko", "ja"] as const) {
        expect(entry.authorNameByLocale[locale], `${entry.id} ${locale}`).toBeTruthy();
        expect(entry.authorRoleByLocale).toHaveProperty(locale);
        expect(entry.authorIntroduction).toHaveProperty(locale);
      }
      if (entry.authorNameByLocale.ko === "QueryPie 편집부") {
        expect(entry.authorIntroduction).toEqual({ en: "", ko: "", ja: "" });
        expect(entry.authorProfileImageSrc).toBe("");
      } else {
        expect(entry.authorProfileImageSrc, entry.id).toMatch(/^\/assets\/content\/author-profiles\/[^/]+\.(png|jpg)$/);
        expect(existsSync(path.join("public", entry.authorProfileImageSrc)), entry.id).toBe(true);
      }
    }
  });
});
