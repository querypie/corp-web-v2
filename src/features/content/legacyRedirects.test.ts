import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { publicCategoryPaths } from "./publicPathConfig";

const categoryPaths = [
  ...Object.entries(publicCategoryPaths.demo).filter(([key]) => key !== "all").map(([, path]) => path),
  ...Object.entries(publicCategoryPaths.resources).filter(([key]) => key !== "all").map(([, path]) => path),
  ...Object.values(publicCategoryPaths.news),
];
const categories = [
  ...categoryPaths.map((path) => [path, path]),
  ["/demo/use-cases", "/demo/aip"],
];

async function responseFor(host: string, path: string) {
  return unstable_getResponseFromNextConfig({ url: `https://${host}${path}`, nextConfig });
}

describe("콘텐츠 레거시 폴더 URL", () => {
  for (const host of ["querypie.ai", "stage-v2.querypie.ai", "www.querypie.com"]) {
    for (const prefix of ["", "/en", "/ko", "/ja"]) {
      it.each(categories)(`${host}${prefix}%s의 상세·다운로드·PDF 폴더를 제거한다`, async (source, destination) => {
        for (const [tail, targetTail] of [["", ""], ["/download", "/download"], ["/pdf", "/download"]]) {
          const response = await responseFor(host, `${prefix}${source}/27/shadow-ai-risk-cxo-countermeasures${tail}?utm_source=test`);
          expect(response.status).toBe(308);
          expect(response.headers.get("location")).toBe(
            `https://${host}${prefix}${destination}/shadow-ai-risk-cxo-countermeasures${targetTail}?utm_source=test`,
          );
        }
      });
    }
  }

  it.each(categoryPaths)("정상 %s 상세·다운로드 URL은 폴더 제거 대상이 아니다", async (basePath) => {
    for (const suffix of ["/guide", "/guide/download", "/guide/download/"]) {
      const path = `${basePath}${suffix}`;
      const response = await responseFor("querypie.ai", path);
      // A trailing slash may be normalized by Next.js independently.
      const location = response.headers.get("location");
      if (location) expect(location).toBe(`https://querypie.ai${path.replace(/\/$/, "")}`);
      else expect(response.headers.get("x-middleware-rewrite")).toBe(`https://querypie.ai/ja${path}`);
    }
  });

  it.each(["/demo/aip/assets/image.webp", "/demo/acp/assets/guide.pdf", "/resources/blogs/image.webp"])(
    "정적 파일 %s는 이동하지 않는다", async (path) => {
      const response = await responseFor("querypie.ai", path);
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    },
  );

  it("정상 demo 카테고리 상세 URL은 유지한다", async () => {
    const response = await responseFor("querypie.ai", "/demo/aip/guide");
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://querypie.ai/ja/demo/aip/guide");
  });
});
