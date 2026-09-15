import "server-only";
import { JSDOM } from "jsdom";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { chatSources, isOfficialChatUrl } from "./sources";
import { makeChunk, retrieveKnowledge, type KnowledgeChunk } from "./knowledge";
import type { ChatTurn } from "./types";

const INDEX_TTL = 60 * 60 * 1000;
const MAX_URLS = 1500;
const indexes = new Map<string, { expires: number; pages: KnowledgeChunk[] }>();
const pending = new Map<string, Promise<KnowledgeChunk[]>>();

// Check every redirect before issuing the next request. Never forward credentials.
export async function readOfficialPage(input: string, signal: AbortSignal): Promise<{ url: string; body: string }> {
  let url = input;
  for (let redirects = 0; redirects <= 4; redirects++) {
    if (!isOfficialChatUrl(url)) throw new Error("Unapproved source");
    const response = await fetch(url, { redirect: "manual", cache: "no-store", signal,
      headers: { "User-Agent": "QueryPie-Website-Chat/1.0", Accept: "text/html,application/xml,text/xml" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await response.body?.cancel();
      const location = response.headers.get("location");
      if (!location) throw new Error("Missing redirect");
      url = new URL(location, url).href;
      continue;
    }
    if (!response.ok || !/text\/(html|xml)|application\/(xml|xhtml\+xml)/i.test(response.headers.get("content-type") ?? "")) {
      await response.body?.cancel();
      throw new Error("Source unavailable");
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Empty source");
    const decoder = new TextDecoder();
    let size = 0;
    let body = "";
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 3_000_000) { await reader.cancel(); throw new Error("Source too large"); }
        body += decoder.decode(part.value, { stream: true });
      }
      return { url, body: body + decoder.decode() };
    } finally { reader.releaseLock(); }
  }
  throw new Error("Too many redirects");
}

export function pageUrl(value: string, base: string, locale: Locale): string | undefined {
  try {
    const url = new URL(value, base);
    if (!isOfficialChatUrl(url.href) || url.origin !== new URL(base).origin || url.search ||
        /\.(pdf|png|jpe?g|webp|svg|zip|mp4|xml|json|css|js)$/i.test(url.pathname) ||
        /\/(api|admin|login|sign-in|auth)(\/|$)/i.test(url.pathname)) return;
    const language = url.pathname.match(/^\/(en|ko|ja)(\/|$)/)?.[1];
    if (language && language !== locale) return;
    url.hash = "";
    return url.href;
  } catch { return; }
}

async function discover(source: typeof chatSources[number], locale: Locale): Promise<KnowledgeChunk[]> {
  const key = `${source.url}/${locale}`;
  const cached = indexes.get(key);
  if (cached && cached.expires > Date.now()) return cached.pages;
  const running = pending.get(key);
  if (running) return running;
  const job = (async () => {
    const signal = AbortSignal.timeout(12000);
    const pages = new Map<string, KnowledgeChunk>();
    const add = (value: string, base: string, title = "") => {
      const url = pageUrl(value, base, locale);
      if (url && pages.size < MAX_URLS) {
        const previous = pages.get(url);
        pages.set(url, makeChunk(source.product, locale, url, title || previous?.title || decodeURI(new URL(url).pathname), ""));
      }
      return url;
    };
    const root = new URL(getLocalePath(locale), source.url).href;
    // Root remains usable even when a site's sitemap is absent.
    add(root, source.url, `${source.product} overview`);
    const xmlQueue = [new URL("/sitemap.xml", source.url).href];
    const xmlSeen = new Set<string>();
    const crawlQueue = [root];
    const crawled = new Set<string>();
    let successes = 0;
    const sitemapJob = async () => {
      while (xmlQueue.length && xmlSeen.size < 8 && !signal.aborted) {
        const url = xmlQueue.shift()!;
        if (xmlSeen.has(url)) continue;
        xmlSeen.add(url);
        try {
          const response = await readOfficialPage(url, signal);
          const dom = new JSDOM(response.body, { contentType: "text/xml" });
          try {
            for (const loc of dom.window.document.querySelectorAll("loc")) {
              const target = new URL(loc.textContent?.trim() || "", response.url);
              if (!isOfficialChatUrl(target.href) || target.origin !== new URL(source.url).origin) continue;
              if (loc.parentElement?.localName === "sitemap") xmlQueue.push(target.href);
              else add(target.href, source.url);
            }
            successes++;
          } finally { dom.window.close(); }
        } catch { /* Fall back to public navigation links. */ }
      }
    };
    const crawlJob = async () => {
      while (crawlQueue.length && crawled.size < 10 && !signal.aborted) {
        const batch = crawlQueue.splice(0, Math.min(3, 10 - crawled.size)).filter((url) => !crawled.has(url));
        batch.forEach((url) => crawled.add(url));
        await Promise.all(batch.map(async (url) => {
          try {
            const response = await readOfficialPage(url, signal);
            const dom = new JSDOM(response.body);
            try {
              const document = dom.window.document;
              add(response.url, source.url, document.querySelector("h1")?.textContent?.trim() || document.title);
              for (const anchor of document.querySelectorAll("a[href]")) {
                const target = add(anchor.getAttribute("href")!, response.url, anchor.textContent?.trim().slice(0, 200));
                if (target && !crawled.has(target) && !crawlQueue.includes(target) && crawlQueue.length < 100) crawlQueue.push(target);
              }
              successes++;
            } finally { dom.window.close(); }
          } catch { /* One unavailable page must not discard other sources. */ }
        }));
      }
    };
    await Promise.all([sitemapJob(), crawlJob()]);
    if (!successes && cached) return cached.pages;
    const result = [...pages.values()];
    indexes.set(key, { pages: result, expires: Date.now() + (successes ? INDEX_TTL : 30000) });
    return result;
  })().finally(() => pending.delete(key));
  pending.set(key, job);
  return job;
}

export function extractChunks(body: string, page: KnowledgeChunk, url: string): KnowledgeChunk[] {
  const dom = new JSDOM(body);
  try {
    const document = dom.window.document;
    document.querySelectorAll("script,style,nav,aside,footer,form,.homepage-aip-mockup,[aria-hidden=true]").forEach((node) => node.remove());
    const main = document.querySelector("article") || document.querySelector("main");
    if (!main) return [];
    const title = main.querySelector("h1")?.textContent?.trim() || document.title || page.title;
    const chunks: KnowledgeChunk[] = [];
    let heading = title;
    for (const block of main.querySelectorAll("h1,h2,h3,h4,p,li,pre,table")) {
      if (block.parentElement?.closest("li,pre,table,p")) continue;
      const text = block.textContent?.replace(/\s+/g, " ").trim() || "";
      if (/^H[1-4]$/.test(block.tagName)) { heading = text; continue; }
      for (let offset = 0; offset < text.length && chunks.length < 150; offset += 1600) {
        chunks.push(makeChunk(page.product, page.locale, url, `${title} — ${heading}`, text.slice(offset, offset + 1600), chunks.length));
      }
    }
    return chunks;
  } finally { dom.window.close(); }
}

export async function retrieveLiveKnowledge(messages: ChatTurn[], locale: Locale, signal: AbortSignal): Promise<KnowledgeChunk[]> {
  const lists = await Promise.all(chatSources.map((source) => discover(source, locale)));
  signal.throwIfAborted();
  const candidates = retrieveKnowledge(messages, locale, lists.flat(), 8);
  const results = await Promise.all(candidates.map(async (page) => {
    try {
      const response = await readOfficialPage(page.url, AbortSignal.any([signal, AbortSignal.timeout(7000)]));
      return extractChunks(response.body, page, response.url);
    } catch { return []; }
  }));
  signal.throwIfAborted();
  return retrieveKnowledge(messages, locale, results.flat());
}
