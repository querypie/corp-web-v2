import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";
import { DOCUMENT_LOCALE_HEADER } from "./documentLocale";

describe("최초 HTML에 전달하는 문서 언어", () => {
  it.each([
    ["querypie.ai", "/", "ja"],
    ["stage-v2.querypie.ai", "/contact-us", "ja"],
    ["querypie.ai", "/resources/blogs/example", "ja"],
    ["www.querypie.com", "/en", "en"],
    ["www.querypie.com", "/ko/contact-us", "ko"],
    ["localhost:3000", "/ja", "ja"],
    ["localhost:3000", "/admin", "en"],
    ["localhost:3000", "/unknown", "en"],
  ])("%s%s에서 %s를 서버에 전달한다", (host, pathname, locale) => {
    const request = new NextRequest(`http://localhost:3000${pathname}`);
    request.headers.set("host", host);
    request.headers.set(DOCUMENT_LOCALE_HEADER, "invalid-client-value");
    const response = middleware(request);

    expect(response.headers.get(`x-middleware-request-${DOCUMENT_LOCALE_HEADER}`)).toBe(locale);
  });

  it("공개 페이지로 matcher를 확장해도 원격 Admin 접근은 차단한다", () => {
    for (const pathname of ["/admin", "/api/admin/content/state"]) {
      const response = middleware(new NextRequest(`https://querypie.ai${pathname}`));
      expect(response.status).toBe(404);
    }
  });
});
