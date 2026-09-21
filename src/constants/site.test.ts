import { describe, expect, it } from "vitest";

import { getAbsoluteSiteUrl, getSiteOrigin } from "./site";

describe("site URL", () => {
  it("현재 서비스 origin으로 상대 경로의 절대 URL을 만든다", () => {
    expect(
      getAbsoluteSiteUrl(
        "/ja/company/about-us",
        new URL("https://stage-v2.querypie.ai"),
      ),
    ).toBe("https://stage-v2.querypie.ai/ja/company/about-us");
  });

  it("요청 헤더에서 현재 서비스 origin을 구한다", () => {
    expect(getSiteOrigin(new Headers({ host: "www-v2.querypie.ai" })).origin)
      .toBe("https://www-v2.querypie.ai");
  });
});
