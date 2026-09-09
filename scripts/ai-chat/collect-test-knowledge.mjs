import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { locales, getLocalePath } from "../../src/constants/i18n.ts";

// Bounded, manually refreshed test corpus. No browser scripts are executed.
const sites = [
  { product: "aip", origin: "https://aip-docs.app.querypie.com", related: /\/(quickstart|faq|security-policy|billing|aip-apps|knowledge-management)$/ },
  { product: "acp", origin: "https://docs.querypie.com", related: /\/(overview|user-manual|querypie-acp-community-edition)$/ },
  { product: "lingo", origin: "https://lingo.querypie.ai", related: /\/(ai-note|transcription|integrations|security|pricing|help)$/ },
];
const homeOrigin = process.env.AI_CHAT_HOME_ORIGIN || "http://localhost:3000";
const documents = [];
const failures = [];
const seen = new Set();

function plain(element) {
  return element.textContent.replace(/\s+/g, " ").trim();
}

async function collect({ product, origin, locale, path = getLocalePath(locale), discover = false, related }) {
  const url = new URL(path, origin);
  if (seen.has(url.href)) return [];
  seen.add(url.href);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "QueryPie-Knowledge-Test/1.0" } });
    if (!response.ok || new URL(response.url).origin !== url.origin) throw new Error(`HTTP ${response.status} or unexpected redirect`);
    const html = await response.text();
    if (html.length > 5_000_000) throw new Error("Page exceeds size limit");
    const dom = new JSDOM(html, { url: response.url });
    const document = dom.window.document;
    const links = discover ? [...document.querySelectorAll("a[href]")].flatMap((anchor) => {
      const target = new URL(anchor.getAttribute("href"), response.url);
      target.hash = "";
      if (target.origin !== origin || target.search || !related.test(target.pathname)) return [];
      target.pathname = getLocalePath(locale, target.pathname);
      return [{ product, origin, locale, path: target.pathname }];
    }).filter((item, index, all) => all.findIndex((other) => other.path === item.path) === index).slice(0, 6) : [];

    document.querySelectorAll("script,style,nav,aside,footer,form,.homepage-aip-mockup,[aria-hidden=true]").forEach((element) => element.remove());
    const main = product === "site" || product === "lingo"
      ? document.querySelector("main") || document.querySelector("article")
      : document.querySelector("article") || document.querySelector("main");
    if (!main) throw new Error("No article/main content");
    const title = main.querySelector("h1")?.textContent.trim() || document.title;
    const blocks = [...main.querySelectorAll("h1,h2,h3,h4,p,li,pre,table,button")]
      .filter((element) => !element.parentElement?.closest("li,pre,table,button,p"))
      .map((element) => ({ heading: /^H[1-4]$/.test(element.tagName), text: plain(element) }))
      .filter((block) => block.text.length > 2);
    const chunks = [];
    let section = title;
    let buffer = "";
    const flush = () => {
      if (buffer.length >= 35) chunks.push({ heading: section, text: buffer.trim() });
      buffer = "";
    };
    for (const block of blocks) {
      if (block.heading) { flush(); section = block.text; continue; }
      for (let index = 0; index < block.text.length; index += 1400) {
        const text = block.text.slice(index, index + 1400);
        if (buffer.length + text.length > 1600) flush();
        buffer += `${text}\n`;
      }
    }
    flush();
    if (!chunks.length) throw new Error("No readable body text");
    const sourceUrl = product === "site" ? getLocalePath(locale) : response.url;
    const id = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 12);
    documents.push({ id, product, locale, title, url: sourceUrl, chunks });
    dom.window.close();
    console.log(`${product}/${locale}: ${chunks.length} sections — ${url.pathname}`);
    return links;
  } catch (error) {
    failures.push({ url: url.href, error: error.message });
    console.warn(`Skipped ${url.href}: ${error.message}`);
    return [];
  }
}

async function batch(jobs) {
  const discovered = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < jobs.length) discovered.push(...await collect(jobs[cursor++]));
  }));
  return discovered;
}

const discovered = await batch(sites.flatMap((site) => locales.map((locale) => ({ ...site, locale, discover: true }))));
await batch(discovered);
await batch(locales.map((locale) => ({ product: "site", origin: homeOrigin, locale })));

// Do not replace a usable snapshot with an incomplete set of source families.
for (const product of ["aip", "acp", "lingo", "site"]) {
  if (!documents.some((document) => document.product === product)) throw new Error(`No documents for ${product}; snapshot not written.`);
}
documents.sort((a, b) => a.url.localeCompare(b.url));
const output = fileURLToPath(new URL("../../src/features/ai-chat/knowledge.snapshot.json", import.meta.url));
await mkdir(fileURLToPath(new URL("../../src/features/ai-chat/", import.meta.url)), { recursive: true });
await writeFile(output, JSON.stringify({ collectedAt: new Date().toISOString(), documents, failures }, null, 2) + "\n");
console.log(`Saved ${documents.length} documents; ${failures.length} failed. Only this selected test subset is indexed.`);
