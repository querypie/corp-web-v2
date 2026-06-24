import { describe, expect, it } from "vitest";
import {
  collectTranslatableTextRefs,
  hasTranslatableBodyText,
  parseTiptapJson,
} from "./tiptap";

describe("Tiptap translation helpers", () => {
  it("텍스트 노드만 수집하고 코드 블록과 인라인 코드는 제외한다", () => {
    const doc = parseTiptapJson(JSON.stringify({
      content: [
        {
          content: [{ text: "Hello world", type: "text" }],
          type: "paragraph",
        },
        {
          content: [{ text: "npm install querypie", type: "text" }],
          type: "codeBlock",
        },
        {
          content: [{ marks: [{ type: "code" }], text: "const a = 1", type: "text" }],
          type: "paragraph",
        },
      ],
      type: "doc",
    }));

    expect(doc).not.toBeNull();
    expect(collectTranslatableTextRefs(doc!).map((ref) => ref.text)).toEqual(["Hello world"]);
  });

  it("번역 결과를 같은 위치에 적용하면서 바깥 공백을 유지한다", () => {
    const doc = parseTiptapJson(JSON.stringify({
      content: [
        {
          content: [{ text: "  Hello world  ", type: "text" }],
          type: "paragraph",
        },
      ],
      type: "doc",
    }));
    const refs = collectTranslatableTextRefs(doc!);

    refs[0]?.update("안녕하세요");

    expect(doc?.content?.[0]?.content?.[0]?.text).toBe("  안녕하세요  ");
  });

  it("번역 가능한 본문 텍스트가 있는지 확인한다", () => {
    expect(hasTranslatableBodyText(JSON.stringify({
      content: [{ content: [{ text: "Hello", type: "text" }], type: "paragraph" }],
      type: "doc",
    }))).toBe(true);

    expect(hasTranslatableBodyText(JSON.stringify({
      content: [{ content: [{ text: "npm install", type: "text" }], type: "codeBlock" }],
      type: "doc",
    }))).toBe(false);
  });

  it("이미지와 비디오 캡션도 번역 대상으로 수집한다", () => {
    const doc = parseTiptapJson(JSON.stringify({
      content: [
        {
          attrs: { caption: "Image caption", src: "/uploads/image.webp" },
          type: "image",
        },
        {
          attrs: { caption: "Video caption", src: "/uploads/video.mp4" },
          type: "video",
        },
      ],
      type: "doc",
    }));
    const refs = collectTranslatableTextRefs(doc!);

    expect(refs.map((ref) => ref.text)).toEqual(["Image caption", "Video caption"]);

    refs[0]?.update("이미지 캡션");
    refs[1]?.update("비디오 캡션");

    expect(doc?.content?.[0]?.attrs?.caption).toBe("이미지 캡션");
    expect(doc?.content?.[1]?.attrs?.caption).toBe("비디오 캡션");
  });
});
