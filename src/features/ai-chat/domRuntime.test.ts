// @vitest-environment node
import { execFileSync } from "node:child_process";
import { expect, it } from "vitest";

it("require(ESM)이 비활성화된 서버 런타임에서도 공식 문서의 HTML과 XML을 읽는다", () => {
  const output = execFileSync(process.execPath, ["--no-experimental-require-module", "-e", `
    const { JSDOM } = require("jsdom");
    const html = new JSDOM("<main><h1>AIP</h1><p>공식 문서</p></main>");
    const xml = new JSDOM("<urlset><url><loc>https://www.querypie.com/ko</loc></url></urlset>", { contentType: "text/xml" });
    console.log(JSON.stringify([
      html.window.document.querySelector("main p").textContent,
      xml.window.document.querySelector("loc").textContent,
    ]));
    html.window.close();
    xml.window.close();
  `], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

  expect(JSON.parse(output)).toEqual(["공식 문서", "https://www.querypie.com/ko"]);
});
