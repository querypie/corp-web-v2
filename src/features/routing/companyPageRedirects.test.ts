import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("인증·문의 페이지 URL 이전", () => {
  for (const page of ["certifications", "contact-us", "about-us"]) {
    it.each(["", "/en", "/ko", "/ja"])(`%s/company/${page}를 새 주소로 이동한다`, async (prefix) => {
      const origin = "https://www.querypie.com";
      const response = await unstable_getResponseFromNextConfig({
        url: `${origin}${prefix}/company/${page}?utm_source=test`, nextConfig,
      });
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${origin}${prefix}/${page}?utm_source=test`);
    });

    it.each(["querypie.ai", "stage-v2.querypie.ai"])(`%s의 ${page}는 접두사 없이 이동하며 순환하지 않는다`, async (host) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://${host}/company/${page}`, nextConfig,
      });
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`https://${host}/${page}`);
      const destination = await unstable_getResponseFromNextConfig({
        url: response.headers.get("location")!, nextConfig,
      });
      expect(destination.headers.get("location")).toBeNull();
      expect(destination.headers.get("x-middleware-rewrite")).toBe(`https://${host}/ja/${page}`);
    });

    it.each(["en", "ko", "ja"])(`/%s/${page}에 역방향 리다이렉트가 없다`, async (locale) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://www.querypie.com/${locale}/${page}`, nextConfig,
      });
      expect(response.headers.get("location")).toBeNull();
    });
  }
});
