// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { extractChunks, pageUrl, readOfficialPage, retrieveLiveKnowledge } from "./liveKnowledge.server";
import { makeChunk } from "./knowledge";
import { isChatSourceUrl } from "./types";

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });
const html = (body: string) => new Response(`<html><main>${body}</main></html>`, { headers: { "content-type": "text/html" } });
describe("공식 사이트 실시간 지식", () => {
  it("공식 절대 URL만 허용하고 다른 언어·관리 경로는 제외한다", () => {
    expect(isChatSourceUrl("https://www.querypie.com/ko")).toBe(true);
    for (const url of ["/ko", "http://www.querypie.com/ko", "https://www.querypie.com.evil.test/", "https://user@www.querypie.com/", "https://127.0.0.1/"]) expect(isChatSourceUrl(url)).toBe(false);
    expect(pageUrl("/ko/new", "https://www.querypie.com", "ko")).toBe("https://www.querypie.com/ko/new");
    expect(pageUrl("/ja/new", "https://www.querypie.com", "ko")).toBeUndefined();
    expect(pageUrl("/admin", "https://www.querypie.com", "ko")).toBeUndefined();
  });
  it("허용하지 않은 도메인으로 리다이렉트되면 요청 전에 차단한다", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 302, headers: { location: "http://127.0.0.1/private" } }));
    vi.stubGlobal("fetch", fetcher);
    await expect(readOfficialPage("https://www.querypie.com/ko", AbortSignal.timeout(1000))).rejects.toThrow("Unapproved source");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("본문만 추출하고 스크립트·폼·내비게이션은 근거에서 제외한다", () => {
    const page = makeChunk("site", "ko", "https://www.querypie.com/ko", "홈", "");
    const chunks = extractChunks('<main><h1>AIP</h1><nav><p>메뉴</p></nav><script>bad()</script><form><p>개인정보</p></form><h2>보안</h2><p>최신 보안 정책</p></main>', page, page.url);
    expect(chunks.map((chunk) => chunk.text)).toEqual(["최신 보안 정책"]);
    expect(chunks[0].title).toContain("보안");
  });
  it("새 사이트맵 페이지와 내부 링크를 발견하고 URL 캐시 중에도 본문을 다시 읽는다", async () => {
    let version = "첫 번째";
    let sitemapVersion = "new-security";
    const fetcher = vi.fn(async (input: string) => {
      const url = new URL(input);
      if (url.pathname === "/sitemap.xml") return new Response(`<sitemapindex><sitemap><loc>${url.origin}/pages.xml</loc></sitemap></sitemapindex>`, { headers: { "content-type": "application/xml" } });
      if (url.pathname === "/pages.xml") return new Response(`<urlset><url><loc>${url.origin}/ko/${sitemapVersion}</loc></url></urlset>`, { headers: { "content-type": "text/xml" } });
      if (url.pathname === "/ko") return html('<h1>제품</h1><a href="/ko/security-policy">보안 정책</a>');
      return html(`<h1>AIP 보안</h1><p>${version} 보안 정책입니다.</p>`);
    });
    vi.stubGlobal("fetch", fetcher);
    const messages = [{ role: "user" as const, content: "AIP 보안 정책" }];
    const first = await retrieveLiveKnowledge(messages, "ko", AbortSignal.timeout(5000));
    expect(first.some((chunk) => chunk.url.includes("new-security"))).toBe(true);
    expect(first.some((chunk) => chunk.url.includes("security-policy"))).toBe(true);
    const sitemapCalls = () => fetcher.mock.calls.filter(([url]) => url.endsWith("sitemap.xml")).length;
    const count = sitemapCalls();
    version = "변경된";
    const second = await retrieveLiveKnowledge(messages, "ko", AbortSignal.timeout(5000));
    expect(second.every((chunk) => chunk.text.includes("변경된"))).toBe(true);
    expect(sitemapCalls()).toBe(count);
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3600001);
    sitemapVersion = "latest-security";
    const third = await retrieveLiveKnowledge(messages, "ko", AbortSignal.timeout(5000));
    expect(third.some((chunk) => chunk.url.includes("latest-security"))).toBe(true);
    expect(sitemapCalls()).toBeGreaterThan(count);
  });
  it("공식 사이트 접근 실패 시 저장된 본문으로 대체하지 않는다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network unavailable")));
    expect(await retrieveLiveKnowledge([{ role: "user", content: "AIP 보안" }], "ko", AbortSignal.timeout(1000))).toEqual([]);
  });
});
