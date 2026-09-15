import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";

describe("root locale redirect", () => {
  it.each(["querypie.ai", "www.querypie.ai"])("일본 루트 %s는 쿠키·브라우저 언어와 관계없이 rewrite로 넘긴다", (host) => {
    const request = new NextRequest("http://localhost:3000/?utm_source=test", {
      headers: { "accept-language": "ko-KR" },
    });
    // happy-dom removes Host/Cookie from Request constructor headers.
    request.headers.set("host", host);
    request.cookies.set("querypie_locale_preference", "en");
    const response = middleware(request);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("최초 루트 진입은 브라우저 언어로 임시 이동한다", () => {
    const request = new NextRequest("https://www.querypie.com/?utm_source=test", {
      headers: { "accept-language": "ko-KR,ko;q=0.9,en;q=0.8" },
    });
    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://www.querypie.com/ko?utm_source=test");
  });

  it("저장된 사용자 선택 언어를 브라우저 언어보다 우선한다", () => {
    const request = new NextRequest("https://www.querypie.com/", {
      headers: {
        "accept-language": "ko-KR,ko;q=0.9",
      },
    });
    request.cookies.set("querypie_locale_preference", "en");
    const response = middleware(request);

    expect(response.headers.get("location")).toBe("https://www.querypie.com/en");
  });
});
