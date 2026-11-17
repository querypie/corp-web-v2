// Apply manually reviewed, bilingual text data to the existing CMS documents.
// No translation API is used. Each row corresponds to one unique Korean text value.
import { promises as fs } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";

const root = path.resolve("src/content/resources/acp-lab-notes");
const episode = Number(process.argv[2]);
const apply = process.argv.includes("--apply");
const directories = await fs.readdir(root);
for (const directory of directories) {
  const dir = path.join(root, directory);
  const metaPath = path.join(dir, "meta.json");
  const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
  if (meta.sortOrder !== episode) continue;
  const source = JSON.parse(await fs.readFile(path.join(dir, "ko.tiptap.json"), "utf8"));
  const values = [];
  function add(value) { if (typeof value === "string" && /[가-힣]/.test(value) && !values.includes(value.trim())) values.push(value.trim()); }
  const sourceTitle = meta.title.ko.replace(/^\[\d+편\]\s*/, "");
  add(sourceTitle); add(meta.summary.ko);
  function walk(node, visit, code = false) { visit(node, code || node.type === "codeBlock"); for (const child of node.content ?? []) walk(child, visit, code || node.type === "codeBlock"); }
  walk(source, (node, code) => {
    if (!code && !node.marks?.some((mark) => mark.type === "code")) add(node.text);
    if (node.type === "image") { add(node.attrs?.caption); add(node.attrs?.alt); }
  });
  if (!apply) { console.log(JSON.stringify({ episode, slug: meta.id, texts: values.map((text, index) => [index, text]) }, null, 2)); continue; }
  const translations = JSON.parse(await fs.readFile(`scripts/acp-translations/${String(episode).padStart(2, "0")}.json`, "utf8"));
  if (translations.length !== values.length || translations.some((row) => row.length !== 2 || row.some((text) => typeof text !== "string" || !text.trim() || /[가-힣]/.test(text)))) throw new Error(`Invalid translations for ${episode}: expected ${values.length}, received ${translations.length}`);
  const window = new JSDOM("").window;
  globalThis.window = window; globalThis.document = window.document;
  const CaptionImage = Image.extend({
    addAttributes() { return { ...this.parent?.(), caption: { default: "" }, width: { default: "100%" } }; },
    renderHTML({ HTMLAttributes: a }) { return ["figure", { "data-qp-image": "true", "data-width": a.width || "100%", style: `width:${a.width || "100%"};` }, ["img", { src: a.src, alt: a.alt, style: "width:100%;" }], ...(a.caption ? [["figcaption", {}, a.caption]] : [])]; },
  });
  for (const [index, locale] of ["en", "ja"].entries()) {
    function translate(value) {
      if (typeof value !== "string" || !/[가-힣]/.test(value)) return value;
      const id = values.indexOf(value.trim());
      if (id < 0) return value;
      return value.replace(value.trim(), translations[id][index]);
    }
    const document = structuredClone(source);
    walk(document, (node, code) => {
      if (!code && !node.marks?.some((mark) => mark.type === "code")) node.text && (node.text = translate(node.text));
      if (node.type === "image") { node.attrs.caption = translate(node.attrs.caption); node.attrs.alt = translate(node.attrs.alt); }
      for (const mark of node.marks ?? []) {
        if (typeof mark.attrs?.href === "string" && /^\/ko\/acp-lab-notes(?:\/|$)/.test(mark.attrs.href)) mark.attrs.href = mark.attrs.href.replace(/^\/ko\//, `/${locale}/`);
      }
    });
    // Korean particles may directly follow a bold or code span. English words
    // require a separating space at those same formatting boundaries.
    if (locale === "en") walk(document, (node, code) => {
      if (code) return;
      for (let i = 1; i < (node.content?.length ?? 0); i++) {
        const previous = node.content[i - 1];
        const current = node.content[i];
        if (/[A-Za-z0-9)]$/.test(previous.text ?? "") && /^[A-Za-z0-9]/.test(current.text ?? "")) {
          current.text = ` ${current.text}`;
        }
      }
    });
    await fs.writeFile(path.join(dir, `${locale}.tiptap.json`), JSON.stringify(document, null, 2) + "\n");
    await fs.writeFile(path.join(dir, `${locale}.html`), generateHTML(document, [StarterKit, CaptionImage, TableKit]) + "\n");
    meta.title[locale] = `[${locale === "en" ? `Part ${episode}` : `第${episode}回`}] ${translate(sourceTitle).trim()}`;
    meta.summary[locale] = translate(meta.summary.ko).trim();
    meta.locales[locale] = { htmlPath: `src/content/resources/acp-lab-notes/${directory}/${locale}.html`, jsonPath: `src/content/resources/acp-lab-notes/${directory}/${locale}.tiptap.json` };
  }
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n");
  console.log(`Applied manual translations for ${episode}: ${values.length} bilingual segments`);
}
