// One-time, reproducible import. Existing output is never overwritten.
import { promises as fs } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import { generateJSON, generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { getLabNoteThumbnailSrc } from "./lib/acp-lab-note-images.mjs";

const entries = [
  ["why-access-control", "접근 제어의 시작", "도입 가이드"],
  ["community-edition-installation", "커뮤니티 에디션 설치", "도입 가이드"],
  ["first-database-connection", "첫 DB 연결", "도입 가이드,DB 접근 제어"],
  ["read-only-permissions", "읽기 전용 권한", "DB 접근 제어"],
  ["database-access-request", "DB 권한 요청", "DB 접근 제어,운영 관리"],
  ["sql-approval", "SQL 승인", "DB 접근 제어,운영 관리"],
  ["data-masking", "데이터 마스킹", "DB 접근 제어"],
  ["database-audit-logs", "DB 감사 로그", "DB 접근 제어,운영 관리"],
  ["table-access-control", "테이블 접근 제한", "DB 접근 제어"],
  ["query-rules", "SQL 사용 규칙", "DB 접근 제어"],
  ["unmasking-approval", "마스킹 해제 승인", "DB 접근 제어,운영 관리"],
  ["sql-export", "SQL 내보내기", "DB 접근 제어,운영 관리"],
  ["restricted-data-approval", "제한 데이터 접근 승인", "DB 접근 제어,운영 관리"],
  ["query-monitoring", "실행 중인 SQL 중단", "DB 접근 제어,운영 관리"],
  ["group-permissions", "그룹과 DB 권한", "DB 접근 제어,운영 관리"],
  ["administrator-audit", "관리자 변경 이력", "운영 관리"],
  ["user-timeline", "사용자 타임라인", "운영 관리"],
  ["temporary-policy-exceptions", "임시 권한과 만료", "DB 접근 제어,운영 관리"],
  ["dml-snapshot", "변경 전후 데이터", "DB 접근 제어,운영 관리"],
  ["audit-log-export", "감사 로그 내보내기", "운영 관리"],
  ["administrator-roles", "관리자 역할 분리", "운영 관리"],
  ["web-terminal", "웹 터미널 접속", "서버 접근 제어"],
  ["command-control", "서버 명령어 통제", "서버 접근 제어"],
  ["session-recording", "서버 세션 녹화", "운영 관리,서버 접근 제어"],
  ["community-mcp", "MCP와 DB 권한", "DB 접근 제어"],
  ["kubernetes-policies", "Kubernetes 접근 정책", "Kubernetes 접근 제어"],
  ["database-connection-path", "DB 접속 경로", "DB 접근 제어"],
  ["command-approval", "명령어 예외 승인", "운영 관리,서버 접근 제어"],
  ["pod-shell-access", "컨테이너 셸 접근", "Kubernetes 접근 제어"],
  ["terminate-server-session", "서버 세션 종료", "운영 관리,서버 접근 제어"],
  ["server-file-transfer", "서버 파일 전송", "서버 접근 제어"],
  ["sql-execution-reason", "SQL 조회 사유", "DB 접근 제어,운영 관리"],
  ["database-audit-reports", "DB 권한과 접속 보고서", "DB 접근 제어,운영 관리"],
  ["database-permissions-by-task", "업무별 DB 권한", "DB 접근 제어"],
  ["prevent-unsafe-sql", "위험한 SQL 차단", "DB 접근 제어"],
  ["export-permissions", "파일 내보내기 권한", "DB 접근 제어"],
  ["sql-execution-plan", "SQL 실행 계획 검토", "DB 접근 제어,운영 관리"],
  ["server-tag-groups", "서버 태그와 그룹", "운영 관리,서버 접근 제어"],
  ["approval-rules", "담당자와 결재 규칙", "DB 접근 제어,운영 관리"],
  ["database-ip-restrictions", "DB 허용 IP", "DB 접근 제어"],
  ["database-account-mapping", "권한별 DB 계정", "DB 접근 제어"],
  ["multi-step-approval", "두 단계 SQL 승인", "DB 접근 제어,운영 관리"],
  ["native-ssh-terminal", "Mac 터미널 접속", "서버 접근 제어"],
  ["kubectl-access-control", "kubectl 접근 제어", "Kubernetes 접근 제어"],
  ["pod-session-recording", "Pod 세션 녹화", "운영 관리,Kubernetes 접근 제어"],
  ["password-provisioning", "서버 비밀번호 변경", "운영 관리,서버 접근 제어"],
  ["blocked-sql-alerts", "차단된 SQL 알림", "DB 접근 제어,운영 관리"],
  ["external-maintenance-access", "외부 담당자 권한", "DB 접근 제어,운영 관리"],
  ["order-change-audit", "주문 변경과 감사 기록", "DB 접근 제어,운영 관리"],
  ["lab-notes-retrospective", "50편의 실습을 마치며", "도입 가이드"],
];
const sourceNumber = (episode) => episode === 44 ? 46 : episode === 45 ? 45 : episode >= 33 ? episode + 1 : episode;
const sources = new Map(entries.map(([slug], index) => [sourceNumber(index + 1), `/ko/acp-lab-notes/${slug}`]));
const root = path.resolve("src/content/resources/acp-lab-notes");
const assetRoot = path.resolve("public/assets/content/acp-lab-notes");
try { await fs.access(root); throw new Error("Import already exists; refusing to overwrite CMS edits."); } catch (error) { if (error.code !== "ENOENT") throw error; }

const window = new JSDOM("").window;
globalThis.window = window;
globalThis.document = window.document;
globalThis.DOMParser = window.DOMParser;
globalThis.HTMLElement = window.HTMLElement;
const CaptionImage = Image.extend({
  addAttributes() { return { ...this.parent?.(), caption: { default: "" }, width: { default: "100%" } }; },
  parseHTML() { return [{ tag: "figure[data-qp-image]", getAttrs: (element) => ({ src: element.querySelector("img").getAttribute("src"), alt: element.querySelector("img").getAttribute("alt") ?? "", caption: element.querySelector("figcaption")?.textContent ?? "", width: "100%" }) }, { tag: "img[src]" }]; },
  renderHTML({ HTMLAttributes: a }) { return ["figure", { "data-qp-image": "true", "data-width": "100%", style: "width:100%;" }, ["img", { src: a.src, alt: a.alt, style: "width:100%;" }], ...(a.caption ? [["figcaption", {}, a.caption]] : [])]; },
});
const extensions = [StarterKit, CaptionImage, TableKit];
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const localized = (ko) => ({ en: "", ko, ja: "" });
async function readMetas(dir) {
  const result = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) result.push(...await readMetas(path.join(dir, e.name)));
    else if (e.name === "meta.json") result.push(JSON.parse(await fs.readFile(path.join(dir, e.name), "utf8")));
  }
  return result;
}
const metas = await readMetas("src/content");
const maxId = Math.max(...metas.map((m) => Number(m.storageId?.replace("cnt_", "")) || 0));
for (const [slug] of entries) if (metas.some((m) => m.id === slug)) throw new Error(`Duplicate id: ${slug}`);
await fs.mkdir(root, { recursive: true });
await fs.mkdir(assetRoot, { recursive: true });
const report = [];
for (const [index, [slug, coverTitle, topics]] of entries.entries()) {
  const episode = index + 1;
  const url = `https://acp-lab-notes.tistory.com/${sourceNumber(episode)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const doc = new JSDOM(await response.text()).window.document;
  const body = doc.querySelector(".tt_article_useless_p_margin");
  if (!body) throw new Error(`No article: ${url}`);
  const title = doc.querySelector('meta[property="og:title"]').content.replace(/^\[\d+편\]\s*/, "");
  const originalText = body.textContent.replace(/\s/g, "");
  const images = [...body.querySelectorAll("img")];
  const imageDir = path.join(assetRoot, slug);
  await fs.mkdir(imageDir, { recursive: true });
  let captions = 0;
  for (const [imageIndex, image] of images.entries()) {
    const figure = image.closest("figure") ?? image;
    let caption = figure.querySelector("figcaption")?.textContent.trim() ?? "";
    let next = figure.nextElementSibling;
    while (next && !next.textContent.trim() && !next.querySelector("img")) next = next.nextElementSibling;
    if (!caption && next?.tagName === "P" && (next.dataset.keSize === "size14" || /^화면\s*\d+\./.test(next.textContent.trim()))) {
      caption = next.textContent.trim();
      next.remove();
    }
    if (caption) captions++;
    const imageUrl = image.closest("[data-url]")?.getAttribute("data-url") || image.src;
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Image ${imageResponse.status}: ${imageUrl}`);
    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    const filename = `${String(imageIndex + 1).padStart(2, "0")}.webp`;
    await sharp(bytes).webp({ lossless: true, effort: 6 }).toFile(path.join(imageDir, filename));
    const replacement = doc.createElement("figure");
    replacement.setAttribute("data-qp-image", "true");
    replacement.innerHTML = `<img src="/assets/content/acp-lab-notes/${slug}/${filename}" alt="${escape(image.alt || caption || `${coverTitle} 실습 화면 ${imageIndex + 1}`)}">${caption ? `<figcaption>${escape(caption)}</figcaption>` : ""}`;
    figure.replaceWith(replacement);
  }
  for (const anchor of body.querySelectorAll("a[href]")) {
    const target = new URL(anchor.getAttribute("href"), url);
    if (target.hostname === "acp-lab-notes.tistory.com") {
      const number = Number(target.pathname.slice(1));
      anchor.setAttribute("href", sources.get(number) ?? "/ko/acp-lab-notes");
    }
  }
  const json = generateJSON(body.innerHTML, extensions);
  const html = generateHTML(json, extensions);
  const imported = new JSDOM(html).window.document;
  if (originalText !== imported.body.textContent.replace(/\s/g, "")) throw new Error(`Text changed during conversion: ${episode}`);
  if (imported.querySelectorAll("img").length !== images.length) throw new Error(`Image count changed: ${episode}`);
  const storageId = `cnt_${String(maxId + episode).padStart(6, "0")}`;
  const dir = path.join(root, storageId);
  await fs.mkdir(dir);
  const summary = [...body.querySelectorAll("p")].map((p) => p.textContent.trim()).filter(Boolean).slice(0, 2).join(" ").slice(0, 180);
  const meta = {
    authorName: topics.split(",").map((topic) => topic.trim()).filter(Boolean).join(" · "),
    authorRole: "",
    categorySlug: "acp-lab-notes", contentType: "content",
    dateIso: doc.querySelector('meta[property="article:published_time"]')?.content.slice(0, 10) || "2026-11-13",
    enableDownloadButton: false, externalUrl: "", gatingLevel: "none", hideHeroImage: true,
    id: slug, imageSrc: getLabNoteThumbnailSrc(slug, episode), relatedIds: [], section: "resources",
    sortOrder: episode, status: "published", storageId, summary: localized(summary), title: localized(`[${episode}편] ${title}`), visibleLocales: ["ko"],
    locales: { ko: { htmlPath: `src/content/resources/acp-lab-notes/${storageId}/ko.html`, jsonPath: `src/content/resources/acp-lab-notes/${storageId}/ko.tiptap.json` } },
  };
  await fs.writeFile(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n", { flag: "wx" });
  await fs.writeFile(path.join(dir, "ko.html"), html + "\n", { flag: "wx" });
  await fs.writeFile(path.join(dir, "ko.tiptap.json"), JSON.stringify(json, null, 2) + "\n", { flag: "wx" });
  report.push({ episode, slug, images: images.length, captions });
  console.log(`Imported ${episode}/50: ${images.length} images, ${captions} captions`);
}
console.log(JSON.stringify({ articles: report.length, images: report.reduce((n, r) => n + r.images, 0), captions: report.reduce((n, r) => n + r.captions, 0) }));
