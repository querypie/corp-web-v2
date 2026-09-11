import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { locales, getLocalePath } from "../../src/constants/i18n.ts";
import { reviewEvidenceSection } from "../../src/features/ai-chat/evidencePolicy.ts";

// Bounded, manually refreshed public corpus. No browser scripts are executed and
// links found inside a page are never followed implicitly.
const sourceGroups = [
  {
    family: "aip",
    product: "aip",
    origin: "https://aip-docs.app.querypie.com",
    paths: [
      "/user-guide",
      "/user-guide/quickstart",
      "/user-guide/chat",
      "/user-guide/skills",
      "/user-guide/mydrive",
      "/user-guide/agents",
      "/user-guide/automation",
      "/user-guide/apps",
      "/user-guide/mcps",
      "/user-guide/settings",
      "/user-guide/3rd-party",
      "/user-guide/special-features/custom-mcp",
      "/user-guide/special-features/local-mcp-proxy",
      "/user-guide/special-features/remote-preset-mcp",
      "/user-guide/special-features/edge-tunnel",
      "/user-guide/special-features/webapp-builder",
      "/user-guide/mobile-guide",
      "/user-guide/faq",
      "/user-guide/security-policy",
      "/admin-guide/billing",
      "/admin-guide/credit-history",
      "/admin-guide/credit-limits",
      "/admin-guide/usage",
      "/admin-guide/agent-management",
      "/admin-guide/knowledge-management",
      "/admin-guide/llm-models",
      "/admin-guide/mcp-management",
      "/admin-guide/skills",
      "/admin-guide/security",
      "/admin-guide/security/dlp-management",
      "/admin-guide/sandbox",
      "/admin-guide/edge-tunnels-mgmt",
      "/admin-guide/dlp-log",
      "/admin-guide/audit-log",
    ],
  },
  {
    family: "acp",
    product: "acp",
    origin: "https://docs.querypie.com",
    paths: [
      "/",
      "/overview",
      "/overview/system-architecture-overview",
      "/user-manual",
      "/user-manual/workflow",
      "/user-manual/database-access-control",
      "/user-manual/server-access-control",
      "/user-manual/kubernetes-access-control",
      "/user-manual/web-access-control",
      "/user-manual/mcp-access-control",
      "/user-manual/mcp-access-control/using-remote-mcp-servers-through-mac",
      "/user-manual/preferences",
      "/user-manual/user-agent",
      "/user-manual/multi-agent",
      "/user-manual/ai-chat",
      "/administrator-manual",
      "/administrator-manual/general",
      "/administrator-manual/general/company-management/security",
      "/administrator-manual/general/user-management/authentication",
      "/administrator-manual/general/workflow-management",
      "/administrator-manual/general/system/integrations",
      "/administrator-manual/databases",
      "/administrator-manual/databases/policies",
      "/administrator-manual/servers",
      "/administrator-manual/kubernetes",
      "/administrator-manual/web-apps",
      "/administrator-manual/mcp-server",
      "/installation",
      "/installation/prerequisites",
      "/installation/querypie-acp-community-edition",
      "/support",
      "/api-reference",
    ],
  },
  {
    family: "lingo",
    product: "lingo",
    origin: "https://lingo.querypie.ai",
    paths: [
      "/security",
      "/pricing",
      "/resources/help",
    ],
  },
  {
    family: "lingo",
    product: "lingo",
    origin: "https://aip-docs.app.querypie.com",
    paths: [
      "/apps/lingo/getting-started",
      "/apps/lingo/home",
      "/apps/lingo/meetings",
      "/apps/lingo/real-time-interpreter",
      "/apps/lingo/ai-assistant",
      "/apps/lingo/mcp",
      "/apps/lingo/calendar",
      "/apps/lingo/customization",
      "/apps/lingo/settings",
      "/apps/lingo/considerations",
    ],
  },
];

const homeOrigin = process.env.AI_CHAT_HOME_ORIGIN || "http://localhost:3000";
const homePages = [
  { family: "site", product: "aip", path: "/solutions/aip" },
  { family: "site", product: "aip", path: "/solutions/aip/integrations" },
  { family: "site", product: "aip", path: "/plans/aip" },
  { family: "site", product: "acp", path: "/solutions/acp" },
  { family: "site", product: "acp", path: "/plans/acp" },
  { family: "site", product: "site", path: "/company/certifications" },
  { family: "site", product: "notepie", path: "/news/notepie-launch" },
  { family: "site", product: "aip", path: "/solutions/ai-crew" },
  { family: "site", product: "aip", path: "/solutions/ai-dashi" },
];

const documents = [];
const failures = [];
const seen = new Set();

function plain(element) {
  if (element.tagName === "TABLE") {
    return [...element.querySelectorAll("tr")]
      .map((row) => [...row.querySelectorAll(":scope > th, :scope > td")]
        .map((cell) => cell.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" | "))
      .filter(Boolean)
      .join("\n");
  }
  return element.textContent.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

const noiseLines = [
  /^(?:free start!?|무료로 시작!?|無料で始める)$/i,
  /^(?:contact us|contact|문의하기|도입 문의|お問い合わせ)$/i,
  /^(?:learn more|view more|자세히 보기|더 알아보기|詳しく見る)>?$/i,
  /^(?:powered by .+|protected by .+|usage-based pricing)$/i,
  /^(?:cookie preference|terms of use|privacy policy|eula)$/i,
  /^©\s*\d{4}/i,
];

const ignoredSectionHeadings = [
  /^(?:release note|릴리스 노트|リリースノート)$/i,
  /^(?:querypie resources|querypie 리소스|querypie リソース)$/i,
  /^(?:latest news|lastest news|최신 뉴스|最新ニュース)$/i,
  /^(?:voice of the customer|고객의 목소리|お客様の声)$/i,
  /^(?:additional questions|further questions|추가 문의|追加のお問い合わせ|その他のお問い合わせ)$/i,
  /^(?:how to get closer to the world|세계와 가까워지는 방법|世界と近づく方法|言葉の壁を越える会議を、今日から。)$/i,
];
const ignoredSingleSections = [
  /^(?:how can we help you\??|무엇을 도와드릴까요\??|何かお困りですか？)$/i,
];

function cleanFactText(text) {
  return text.split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim()
      .replace(/\s*(?:For (?:more )?details|For the full .+),? see .+$/i, "")
      .replace(/\s*(?:자세한 내용은|플랜 구독에 관한 자세한 내용은) .+(?:참고|확인)해 ?주세요\.?$/u, "")
      .replace(/\s*詳しくは.+(?:確認|参照)してください。?$/u, ""))
    .filter((line) => line && !noiseLines.some((pattern) => pattern.test(line)))
    .join("\n");
}

const lingoVoiceSummary = {
  ko: {
    heading: "Lingo Voice(실시간 통역)",
    text: "Lingo Voice는 지원 언어 사이에서 말한 내용을 번역해 음성으로 출력하는 실시간 통역 기능입니다. 예를 들어 한국어로 말하고 상대 언어를 일본어로 설정하면 일본어 번역 음성이 출력됩니다. 입력 언어, 출력 언어와 출력 목소리를 선택할 수 있어 다국어 발표와 대면 커뮤니케이션에 활용할 수 있습니다. 실시간 통역은 Beta 기능이며 조직의 AIP 크레딧을 사용합니다.",
  },
  en: {
    heading: "Lingo Voice (Real-time Interpreter)",
    text: "Lingo Voice is a real-time interpreting feature that translates speech between supported languages and plays the result aloud. For example, Korean speech can be translated and played in Japanese. Users can select the input language, output language, and output voice for multilingual presentations and in-person communication. Real-time Interpreter is a Beta feature and uses the organization's AIP credits.",
  },
  ja: {
    heading: "Lingo Voice（リアルタイム通訳）",
    text: "Lingo Voiceは、対応言語間で発話を翻訳し、音声で出力するリアルタイム通訳機能です。たとえば韓国語で話し、相手の言語を日本語に設定すると、日本語の翻訳音声が出力されます。入力言語、出力言語、出力音声を選択でき、多言語での発表や対面コミュニケーションに活用できます。リアルタイム通訳はBeta機能で、組織のAIPクレジットを使用します。",
  },
};

async function collect({ family, product, origin, locale, path }) {
  const url = new URL(getLocalePath(locale, path), origin);
  if (seen.has(url.href)) return;
  seen.add(url.href);
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": "QueryPie-Knowledge-Collector/1.0" },
    });
    if (!response.ok || new URL(response.url).origin !== url.origin) {
      throw new Error(`HTTP ${response.status} or unexpected redirect`);
    }
    const html = await response.text();
    if (html.length > 5_000_000) throw new Error("Page exceeds size limit");
    const dom = new JSDOM(html, { url: response.url });
    const document = dom.window.document;
    document.querySelectorAll("script,style,nav,aside,footer,form,header,dialog,noscript,template,svg,.homepage-aip-mockup,[aria-hidden=true],[role=navigation],[role=banner],[role=dialog]").forEach((element) => element.remove());
    const main = family === "site" || family === "lingo"
      ? document.querySelector("main") || document.querySelector("article")
      : document.querySelector("article") || document.querySelector("main");
    if (!main) throw new Error("No article/main content");
    const title = main.querySelector("h1")?.textContent.trim() || document.title;
    const blocks = [...main.querySelectorAll("h1,h2,h3,h4,p,li,pre,table")]
      .filter((element) => !element.parentElement?.closest("li,pre,table,p"))
      .map((element) => ({
        heading: /^H[1-4]$/.test(element.tagName),
        level: /^H[1-4]$/.test(element.tagName) ? Number(element.tagName.slice(1)) : null,
        text: cleanFactText(plain(element)),
      }))
      .filter((block) => block.text.length > 2);
    const chunks = [];
    let section = title;
    let buffer = "";
    let skipSection = false;
    let skippedHeadingLevel = null;
    const flush = () => {
      const minimumLength = /[?？]$/.test(section) ? 8 : 35;
      if (!skipSection && buffer.length >= minimumLength) chunks.push({ heading: section, text: buffer.trim() });
      buffer = "";
    };
    for (const block of blocks) {
      if (block.heading) {
        flush();
        section = block.text;
        if (skippedHeadingLevel !== null && block.level > skippedHeadingLevel) {
          skipSection = true;
          continue;
        }
        skippedHeadingLevel = null;
        if (ignoredSectionHeadings.some((pattern) => pattern.test(section))) {
          skippedHeadingLevel = block.level;
          skipSection = true;
        } else {
          skipSection = ignoredSingleSections.some((pattern) => pattern.test(section));
        }
        continue;
      }
      if (skipSection) continue;
      for (let index = 0; index < block.text.length; index += 1400) {
        const text = block.text.slice(index, index + 1400);
        if (buffer.length + text.length > 1600) flush();
        buffer += `${text}\n`;
      }
    }
    flush();
    if (family === "lingo" && path === "/apps/lingo/real-time-interpreter") {
      chunks.unshift(lingoVoiceSummary[locale]);
    }
    if (!chunks.length) throw new Error("No readable body text");
    const sourceUrl = response.url;
    const id = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 12);
    documents.push({ id, product, locale, title, url: sourceUrl, chunks });
    dom.window.close();
    console.log(`${family}/${product}/${locale}: ${chunks.length} sections — ${url.pathname}`);
  } catch (error) {
    failures.push({ family, url: url.href, error: error.message });
    console.warn(`Skipped ${url.href}: ${error.message}`);
  }
}

async function batch(jobs) {
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < jobs.length) await collect(jobs[cursor++]);
  }));
}

const documentationJobs = sourceGroups.flatMap((group) => locales.flatMap((locale) =>
  group.paths.map((path) => ({ ...group, locale, path })),
));
const homepageJobs = locales.flatMap((locale) => homePages.map((page) => ({ ...page, origin: homeOrigin, locale })));
await batch([...documentationJobs, ...homepageJobs]);

// Do not replace a usable snapshot with an incomplete set of source families.
for (const family of ["aip", "acp", "lingo", "site"]) {
  const origin = family === "site" ? homeOrigin : sourceGroups.find((group) => group.family === family).origin;
  if (!documents.some((document) => document.url.startsWith(origin))) {
    throw new Error(`No documents for ${family}; snapshot not written.`);
  }
}
for (const locale of locales) {
  for (const requiredPath of ["/resources/help", "/apps/lingo/real-time-interpreter"]) {
    if (!documents.some((document) => document.locale === locale && document.url.includes(`/${locale}${requiredPath}`))) {
      throw new Error(`Required Lingo source is missing: /${locale}${requiredPath}; snapshot not written.`);
    }
  }
}
const sourcePriority = (document) => document.url.includes("/resources/help") ? 0
  : document.url.includes("/apps/lingo/") ? 1
    : 2;
documents.sort((a, b) => sourcePriority(a) - sourcePriority(b) || a.url.localeCompare(b.url));
const seenFacts = new Set();
for (const document of documents) {
  document.chunks = document.chunks.filter((chunk) => {
    const factKey = `${document.product}\0${document.locale}\0${chunk.text.toLocaleLowerCase().replace(/\s+/g, " ")}`;
    if (seenFacts.has(factKey)) return false;
    seenFacts.add(factKey);
    return true;
  });
}
documents.sort((a, b) => a.url.localeCompare(b.url));
const output = fileURLToPath(new URL("../../src/features/ai-chat/knowledge.snapshot.json", import.meta.url));
await mkdir(fileURLToPath(new URL("../../src/features/ai-chat/", import.meta.url)), { recursive: true });
await writeFile(output, JSON.stringify({ collectedAt: new Date().toISOString(), documents, failures }, null, 2) + "\n");
// Preserve raw source sections, including qualifiers and held material. Both
// keyword retrieval and the embedding index apply this same policy on every run.
const eligibleSections = documents.reduce((count, document) => count + document.chunks.filter((chunk) => reviewEvidenceSection(document, chunk).text).length, 0);
console.log(`Saved ${documents.length} source documents; ${failures.length} failed. ${eligibleSections} sections are eligible under the answer-evidence policy.`);
