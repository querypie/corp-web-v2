import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { renderTiptapHtml } from "./tiptapHtml";
import { getLabNote, getLocalizedLabNote, getLabNoteWriterLabel, sortLabNotes } from "./acpLabNotes";
import { getPublicDetailHref } from "./data";
import { acpLabNoteTopics } from "@/copy/acpLabNotes";

const root = path.resolve("src/content/resources/acp-lab-notes");
const notes = readdirSync(root).map((directory) => ({ directory, ...JSON.parse(readFileSync(path.join(root, directory, "meta.json"), "utf8")) }));
describe("ACP 실습 노트 이관", () => {
  it("모든 글은 번역 가능한 주제를 가지며 서로 다른 태그가 같은 목록을 중복 노출하지 않는다", () => {
    const memberships = new Map<string, string[]>();
    for (const note of sortLabNotes(notes)) {
      const topics = getLabNote(note)!.topics;
      expect(topics.length, note.id).toBeGreaterThan(0);
      expect(new Set(topics).size, note.id).toBe(topics.length);
      for (const topic of topics) {
        expect(acpLabNoteTopics, note.id).toHaveProperty(topic);
        memberships.set(topic, [...(memberships.get(topic) ?? []), note.id]);
      }
      for (const locale of ["en", "ko", "ja"] as const) {
        const localized = getLocalizedLabNote(note, locale)!.topics;
        expect(new Set(localized).size).toBe(topics.length);
        if (locale !== "ko") expect(localized.join(" ")).not.toMatch(/[가-힣]/);
      }
    }
    expect([...memberships.keys()].sort()).toEqual(Object.keys(acpLabNoteTopics).sort());
    expect(memberships.size).toBe(5);
    expect(new Set([...memberships.values()].map((ids) => ids.join(","))).size).toBe(memberships.size);
  });
  it.each([
    [8, ["DB 접근 제어", "운영 관리"]],
    [18, ["DB 접근 제어", "운영 관리"]],
    [24, ["운영 관리", "서버 접근 제어"]],
    [25, ["DB 접근 제어"]],
    [32, ["DB 접근 제어", "운영 관리"]],
    [42, ["DB 접근 제어", "운영 관리"]],
    [45, ["운영 관리", "Kubernetes 접근 제어"]],
    [47, ["DB 접근 제어", "운영 관리"]],
    [49, ["DB 접근 제어", "운영 관리"]],
    [50, ["도입 가이드"]],
  ])("%i편은 본문의 주요 실습에 해당하는 주제만 갖는다", (episode, topics) => {
    expect(getLabNote(notes.find((note) => note.sortOrder === episode))?.topics).toEqual(topics);
  });
  it("1~50편이 중복 없이 존재하고 회차 기준으로 정렬된다", () => {
    expect(sortLabNotes(notes).map((note) => getLabNote(note)?.episode)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
    expect(new Set(notes.map((note) => note.id)).size).toBe(50);
  });
  it("썸네일은 기존 본문 WebP를 재사용하며 별도 표지 파일을 남기지 않는다", () => {
    for (const note of notes) {
      expect(note.imageSrc).toMatch(/^\/assets\/content\/acp-lab-notes\/[\w-]+\/\d+\.webp$/);
      const files = readdirSync(path.dirname(path.join("public", note.imageSrc)));
      expect(files.every((file) => file.endsWith(".webp"))).toBe(true);
      expect(files).not.toContain("cover.png");
      expect(files).not.toContain("thumbnail.webp");
    }
  });
  it.each(["ko", "en", "ja"] as const)("%s 50편의 본문과 캡션이 CMS 저장용 렌더러를 거쳐도 보존된다", (locale) => {
    let images = 0;
    let captions = 0;
    for (const note of notes) {
      const html = readFileSync(path.join(root, note.directory, `${locale}.html`), "utf8");
      const richText = readFileSync(path.join(root, note.directory, `${locale}.tiptap.json`), "utf8");
      const saved = renderTiptapHtml(richText);
      const before = document.createElement("div"); before.innerHTML = html;
      const after = document.createElement("div"); after.innerHTML = saved;
      expect(after.textContent?.replace(/\s/g, ""), note.id).toBe(before.textContent?.replace(/\s/g, ""));
      expect([...after.querySelectorAll("figcaption")].map((el) => el.textContent)).toEqual([...before.querySelectorAll("figcaption")].map((el) => el.textContent));
      const originalImages = [...before.querySelectorAll("img")].map((el) => el.getAttribute("src"));
      if (getLabNote(note)?.episode !== 1) expect(originalImages).toContain(note.imageSrc);
      expect([...after.querySelectorAll("img")].map((el) => el.getAttribute("src"))).toEqual(originalImages);
      for (const src of [...originalImages, note.imageSrc]) {
        expect(src).toMatch(/^\/assets\/content\/acp-lab-notes\//);
        expect(src).toMatch(/\.webp$/);
        expect(existsSync(path.join("public", src!)), src!).toBe(true);
      }
      for (const anchor of before.querySelectorAll("a[href]")) {
        const href = anchor.getAttribute("href")!;
        expect(href).not.toContain("acp-lab-notes.tistory.com");
        if (/^\/(ko|en|ja)\/acp-lab-notes\//.test(href)) expect(notes.some((target) => getPublicDetailHref("resources", locale, target.id, "acp-lab-notes") === href)).toBe(true);
      }
      expect(note.authorName).not.toMatch(/\d+편|ACP Community/);
      expect(note.authorRole).toBe("");
      const prefix = { ko: `[${note.sortOrder}편] `, en: `[Part ${note.sortOrder}] `, ja: `[第${note.sortOrder}回] ` }[locale];
      expect(note.title[locale].startsWith(prefix)).toBe(true);
      expect(note).not.toHaveProperty("labNote");
      expect(note.visibleLocales).toEqual(["en", "ko", "ja"]);
      expect(note.title[locale]).toBeTruthy();
      expect(note.summary[locale]).toBeTruthy();
      if (locale !== "ko") {
        const source = document.createElement("div");
        source.innerHTML = readFileSync(path.join(root, note.directory, "ko.html"), "utf8");
        expect(originalImages).toEqual([...source.querySelectorAll("img")].map((el) => el.getAttribute("src")));
        expect([...before.querySelectorAll("pre")].map((el) => el.textContent)).toEqual([...source.querySelectorAll("pre")].map((el) => el.textContent));
        expect([...before.querySelectorAll("*")].map((el) => el.tagName)).toEqual([...source.querySelectorAll("*")].map((el) => el.tagName));
        before.querySelectorAll("pre, code").forEach((el) => el.remove());
        expect(before.textContent, note.id).not.toMatch(/[가-힣]/);
        expect(note.title[locale]).not.toMatch(/[가-힣]/);
        expect(note.summary[locale]).not.toMatch(/[가-힣]/);
        for (const image of before.querySelectorAll("img")) expect(image.alt).not.toMatch(/[가-힣]/);
      }
      images += originalImages.length;
      captions += before.querySelectorAll("figcaption").length;
    }
    expect(images).toBe(396);
    expect(captions).toBe(396);
  });
});

describe("기존 작성자·직책 필드로 연재 정보 읽기", () => {
  const entry = { categorySlug: "acp-lab-notes" as const, authorName: "도입 가이드 · DB 접근 제어", authorRole: "", sortOrder: 3 };
  it("공용 작성자 UI와 필터에 언어별 연재 정보를 제공한다", () => {
    expect(getLocalizedLabNote(entry, "en")?.topics).toEqual(["Adoption guide", "Database access control"]);
    expect(getLabNoteWriterLabel(entry, "en")).toBe("Adoption guide · Database access control");
    expect(getLabNoteWriterLabel(entry, "ko")).toBe("도입 가이드 · DB 접근 제어");
    expect(getLabNoteWriterLabel(entry, "ja")).toBe("導入ガイド · DBアクセス制御");
    expect(getLabNoteWriterLabel(entry, "ja")).not.toMatch(/[가-힣]/);
  });
  it("정렬 순서의 회차와 작성자의 주제를 읽고 쉼표로 구분한 주제도 처리한다", () => {
    expect(getLabNote(entry)).toEqual({ episode: 3, topics: ["도입 가이드", "DB 접근 제어"] });
    expect(getLabNote({ ...entry, authorName: " 도입 가이드, DB 접근 제어 " })?.topics).toEqual(["도입 가이드", "DB 접근 제어"]);
  });
  it("작성자 없이도 회차를 유지하고 다른 카테고리는 처리하지 않는다", () => {
    expect(getLabNote({ ...entry, authorName: "" })).toEqual({ episode: 3, topics: [] });
    expect(getLabNote({ ...entry, categorySlug: "blogs" })).toBeUndefined();
  });
  it("CMS 정렬 순서로 연재 순서를 유지한다", () => {
    expect(sortLabNotes([{ ...entry, sortOrder: 10 }, entry]).map((item) => getLabNote(item)?.episode)).toEqual([3, 10]);
  });
});
