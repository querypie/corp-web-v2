import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("플랫폼 URL 이전", () => {
  it.each([
    ["https://www.querypie.com/en/solutions/aip", "https://www.querypie.com/en/platforms/aip"],
    ["https://www.querypie.com/ko/solutions/acp/integrations", "https://www.querypie.com/ko/platforms/acp/integrations"],
    ["https://querypie.ai/solutions/aip/fde-services?utm_source=test", "https://querypie.ai/platforms/aip/fde-services?utm_source=test"],
  ])("%s → %s", async (url, destination) => {
    const response = await unstable_getResponseFromNextConfig({ url, nextConfig });
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(destination);
  });

  it("일본 도메인의 플랫폼 URL은 prefix 없이 일본어 페이지로 rewrite한다", async () => {
    const response = await unstable_getResponseFromNextConfig({ url: "https://querypie.ai/platforms/aip", nextConfig });
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://querypie.ai/ja/platforms/aip");
  });
});
