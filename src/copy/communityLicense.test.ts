import { describe, it, expect } from "vitest";
import {
  getCommunityLicenseApplyPageCopy,
  getCommunityLicensePageCopy,
} from "./communityLicense";

describe("getCommunityLicensePageCopy", () => {
  describe("필드 순서", () => {
    it("EN: FirstName이 LastName보다 앞에 온다", () => {
      const copy = getCommunityLicensePageCopy("en");
      const firstIdx = copy.fields.findIndex((f) => f.name === "FirstName");
      const lastIdx = copy.fields.findIndex((f) => f.name === "LastName");
      expect(firstIdx).toBeLessThan(lastIdx);
    });

    it("KO: LastName이 FirstName보다 앞에 온다 (성이 먼저)", () => {
      const copy = getCommunityLicensePageCopy("ko");
      const firstIdx = copy.fields.findIndex((f) => f.name === "FirstName");
      const lastIdx = copy.fields.findIndex((f) => f.name === "LastName");
      expect(lastIdx).toBeLessThan(firstIdx);
    });

    it("JA: LastName이 FirstName보다 앞에 온다 (姓이 먼저)", () => {
      const copy = getCommunityLicensePageCopy("ja");
      const firstIdx = copy.fields.findIndex((f) => f.name === "FirstName");
      const lastIdx = copy.fields.findIndex((f) => f.name === "LastName");
      expect(lastIdx).toBeLessThan(firstIdx);
    });
  });

  describe("필수 필드", () => {
    it.each(["en", "ko", "ja"] as const)(
      "%s: FirstName, LastName, Email, Company는 required=true",
      (locale) => {
        const copy = getCommunityLicensePageCopy(locale);
        for (const name of ["FirstName", "LastName", "Email", "Company"]) {
          const field = copy.fields.find((f) => f.name === name);
          expect(field?.required, `${locale}.${name} should be required`).toBe(true);
        }
      },
    );

    it.each(["en", "ko", "ja"] as const)(
      "%s: Title, Website는 optional",
      (locale) => {
        const copy = getCommunityLicensePageCopy(locale);
        for (const name of ["Title", "Website"]) {
          const field = copy.fields.find((f) => f.name === name);
          expect(field?.required, `${locale}.${name} should be optional`).toBeFalsy();
        }
      },
    );
  });

  describe("필드 타입", () => {
    it.each(["en", "ko", "ja"] as const)("%s: Email 필드 type은 'email'", (locale) => {
      const copy = getCommunityLicensePageCopy(locale);
      expect(copy.fields.find((f) => f.name === "Email")?.type).toBe("email");
    });

    it.each(["en", "ko", "ja"] as const)("%s: Website 필드 type은 'url'", (locale) => {
      const copy = getCommunityLicensePageCopy(locale);
      expect(copy.fields.find((f) => f.name === "Website")?.type).toBe("url");
    });
  });

  describe("성공/에러 메시지", () => {
    it("모든 locale에 successTitle, successDescription, successButton이 있다", () => {
      for (const locale of ["en", "ko", "ja"] as const) {
        const copy = getCommunityLicensePageCopy(locale);
        expect(copy.successTitle).toBeTruthy();
        expect(copy.successDescription).toBeTruthy();
        expect(copy.successButton).toBeTruthy();
      }
    });

    it("모든 locale에 errorGeneral이 있다", () => {
      for (const locale of ["en", "ko", "ja"] as const) {
        const copy = getCommunityLicensePageCopy(locale);
        expect(copy.errorGeneral).toBeTruthy();
      }
    });
  });
});

describe("getCommunityLicenseApplyPageCopy", () => {
  it("locale별 title과 homeHref를 반환한다", () => {
    expect(getCommunityLicenseApplyPageCopy("en").titleLines.join(" ")).toContain("Request");
    expect(getCommunityLicenseApplyPageCopy("ko").titleLines.join(" ")).toContain("신청");
    expect(getCommunityLicenseApplyPageCopy("ja").titleLines.join(" ")).toContain("申請");

    expect(getCommunityLicenseApplyPageCopy("en").homeHref).toBe("/en");
    expect(getCommunityLicenseApplyPageCopy("ko").homeHref).toBe("/ko");
    expect(getCommunityLicenseApplyPageCopy("ja").homeHref).toBe("/ja");
  });

  it("locale별 필드 순서를 기존 Community License copy와 맞춘다", () => {
    for (const locale of ["en", "ko", "ja"] as const) {
      expect(getCommunityLicenseApplyPageCopy(locale).fields.map((field) => field.name)).toEqual(
        getCommunityLicensePageCopy(locale).fields.map((field) => field.name),
      );
    }
  });

  it("locale별 legal link를 반환한다", () => {
    expect(getCommunityLicenseApplyPageCopy("en").privacyPolicyHref).toBe("/en/privacy-policy");
    expect(getCommunityLicenseApplyPageCopy("ko").privacyPolicyHref).toBe("/ko/privacy-policy");
    expect(getCommunityLicenseApplyPageCopy("ja").privacyPolicyHref).toBe("/ja/privacy-policy");
  });
});
