import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";

describe("root locale redirect", () => {
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
    request.cookies.set("querypie_locale_preference", "ja");
    const response = middleware(request);

    expect(response.headers.get("location")).toBe("https://www.querypie.com/ja");
  });
});
