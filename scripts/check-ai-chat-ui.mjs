import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

// Run against a ready Preview: seed display fixtures; never send a question to Hermes/Slack.
const baseUrl = process.argv[2];
const outputDir = process.argv[3];
if (!baseUrl || !outputDir) throw new Error("Usage: node scripts/check-ai-chat-ui.mjs <site URL> <artifact directory>");
await mkdir(outputDir, { recursive: true });
const labels = { en: "Open AI product chat", ko: "AI 제품 상담 열기", ja: "AI製品相談を開く" };
const browser = await chromium.launch({ channel: "chromium" });
try {
  for (const width of [1280, 390]) {
    for (const locale of ["en", "ko", "ja"]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      let chatRequests = 0;
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/api/ai-chat", async (route) => { chatRequests++; await route.abort(); });
      await page.addInitScript(({ locale }) => {
        document.cookie = "cookie-preference-set=1; path=/";
        const url = "https://www.querypie.com/en/plans/aip";
        sessionStorage.setItem("querypie-ai-chat:v1", JSON.stringify({ draft: "", messages: [
          { id: "fixture-user", role: "user", locale, text: "**比較** / 플랜 비교 / Compare plans" },
          { id: "fixture-answer", role: "assistant", locale, text: [
            "**플랜 비교 · プラン比較 · Plan comparison**",
            "",
            "- 필요한 기능을 확인합니다. / 必要な機能を確認 / Check features",
            "- 요금과 포함량을 확인합니다. / 料金と含有量 / Check allowances",
            "",
            "| 플랜 / Plan | 요금 / Price | 크레딧 / Credits | 조건 / Conditions | 관리 / Admin |",
            "| --- | --- | --- | --- | --- |",
            "| Business | $650/월 | 20,000 | 월간 / Monthly | 기본 / Basic |",
            "| Enterprise | 별도 문의 / お問い合わせ | 맞춤 / Custom | 계약 / Contract | 맞춤 / Custom |",
            "",
            `자세히 보기: [AIP 요금](${url})`,
          ].join("\n"), sources: [{ title: "AIP 요금", url }, { title: "별도 자료", url: "https://docs.querypie.com/" }] },
        ] }));
      }, { locale });
      await page.goto(`${baseUrl.replace(/\/$/, "")}/${locale}/contact-us`, { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: labels[locale], exact: true }).click({ timeout: 30000 });
      const dialog = page.getByRole("dialog");
      await dialog.getByRole("table").waitFor();
      assert.equal(await dialog.getByRole("link").count(), 2, "inline reference must not repeat below the answer");
      assert.equal(await dialog.getByRole("link", { name: "AIP 요금", exact: true }).getAttribute("href"), "https://www.querypie.com/en/plans/aip");
      assert.equal(await dialog.getByRole("listitem").count(), 2);
      const layout = await dialog.evaluate((element) => {
        const tableRegion = element.querySelector("[data-hermes-table]");
        const rect = element.getBoundingClientRect();
        return {
          panelWidth: element.clientWidth, panelScrollWidth: element.scrollWidth,
          tableWidth: tableRegion.clientWidth, tableScrollWidth: tableRegion.scrollWidth,
          tableOverflow: getComputedStyle(tableRegion).overflowX,
          insideViewport: rect.left >= 0 && rect.right <= innerWidth,
          invalidBlockNesting: !!element.querySelector("p table, p ul, p ol"),
        };
      });
      assert.ok(layout.insideViewport && layout.panelScrollWidth <= layout.panelWidth + 1, JSON.stringify(layout));
      assert.ok(layout.tableScrollWidth > layout.tableWidth && layout.tableOverflow === "auto", JSON.stringify(layout));
      assert.equal(layout.invalidBlockNesting, false);
      const region = dialog.locator("[data-hermes-table]");
      await region.focus();
      await region.press("ArrowRight");
      await page.waitForFunction(() => document.querySelector("[data-hermes-table]").scrollLeft > 0);
      await dialog.screenshot({ path: resolve(outputDir, `chat-${locale}-${width}.png`) });
      assert.equal(chatRequests, 0, "UI check must not call the chatbot API");
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ locale, width, ...layout, chatRequests, errors }));
      await page.close();
    }
  }
} finally {
  await browser.close();
}
