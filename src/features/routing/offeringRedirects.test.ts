import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { offeringEntries } from "@/constants/offerings";

describe("제품·서비스의 이전 URL", () => {
  it.each(offeringEntries.flatMap(entry => entry.legacyPaths.map(source => ({ source, path: entry.path }))))("$source는 $path로 직접 이동한다", async ({ source, path }) => {
    for (const prefix of ["", "/en", "/ko", "/ja"]) {
      const origin = "https://preview.vercel.app";
      const response = await unstable_getResponseFromNextConfig({ url: `${origin}${prefix}${source}?utm_source=test`, nextConfig });
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${origin}${prefix}${path}?utm_source=test`);
    }
  });
  it("일본어 도메인에서도 이전 URL을 새 주소로 연결하고 새 주소는 rewrite한다", async () => {
    const legacy = await unstable_getResponseFromNextConfig({ url: "https://querypie.ai/solutions/ai-gateway", nextConfig });
    expect(legacy.headers.get("location")).toBe("https://querypie.ai/ai-gateway");
    const current = await unstable_getResponseFromNextConfig({ url: "https://querypie.ai/ai-gateway", nextConfig });
    expect(current.headers.get("location")).toBeNull();
    expect(current.headers.get("x-middleware-rewrite")).toBe("https://querypie.ai/ja/ai-gateway");
  });
});
