import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import * as fsModule from "fs";
import { loadMdxSource } from "./loader";

describe("loadMdxSource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("파일 읽기 성공", () => {
    it("locale 파일이 있으면 해당 파일 내용을 반환한다", async () => {
      vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("# Hello" as any);
      const result = await loadMdxSource("blog", "8", "ko");
      expect(result).toBe("# Hello");
    });

    it("en locale 파일을 직접 읽는다", async () => {
      vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("# English" as any);
      const result = await loadMdxSource("blog", "20", "en");
      expect(result).toBe("# English");
    });

    it("white-paper 카테고리 파일을 읽는다", async () => {
      vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("# Whitepaper" as any);
      const result = await loadMdxSource("white-paper", "1", "en");
      expect(result).toBe("# Whitepaper");
    });
  });

  describe("locale 폴백", () => {
    it("locale 파일이 없으면 en으로 폴백한다", async () => {
      vi.spyOn(fsModule.promises, "readFile")
        .mockRejectedValueOnce(new Error("ENOENT"))
        .mockResolvedValueOnce("# English" as any);
      const result = await loadMdxSource("blog", "8", "ja");
      expect(result).toBe("# English");
    });

    it("ko locale 파일이 없으면 en으로 폴백한다", async () => {
      vi.spyOn(fsModule.promises, "readFile")
        .mockRejectedValueOnce(new Error("ENOENT"))
        .mockResolvedValueOnce("# English Content" as any);
      const result = await loadMdxSource("blog", "20", "ko");
      expect(result).toBe("# English Content");
    });

    it("en locale은 폴백 없이 null을 반환한다", async () => {
      vi.spyOn(fsModule.promises, "readFile").mockRejectedValue(new Error("ENOENT"));
      const result = await loadMdxSource("blog", "missing", "en");
      expect(result).toBeNull();
    });

    it("en 파일도 없으면 null을 반환한다", async () => {
      vi.spyOn(fsModule.promises, "readFile")
        .mockRejectedValueOnce(new Error("ENOENT"))
        .mockRejectedValueOnce(new Error("ENOENT"));
      const result = await loadMdxSource("blog", "missing", "ja");
      expect(result).toBeNull();
    });
  });

  describe("경로 구성", () => {
    it("blog 카테고리와 id로 올바른 경로를 구성한다", async () => {
      const spy = vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("" as any);
      await loadMdxSource("blog", "20", "en");
      const calledPath = spy.mock.calls[0][0] as string;
      expect(calledPath).toContain(path.join("blog", "20", "en.mdx"));
    });

    it("white-paper 카테고리와 id로 올바른 경로를 구성한다", async () => {
      const spy = vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("" as any);
      await loadMdxSource("white-paper", "1", "ko");
      const calledPath = spy.mock.calls[0][0] as string;
      expect(calledPath).toContain(path.join("white-paper", "1", "ko.mdx"));
    });

    it("폴백 시 en.mdx 경로를 사용한다", async () => {
      const spy = vi.spyOn(fsModule.promises, "readFile")
        .mockRejectedValueOnce(new Error("ENOENT"))
        .mockResolvedValueOnce("" as any);
      await loadMdxSource("blog", "20", "ja");
      const fallbackPath = spy.mock.calls[1][0] as string;
      expect(fallbackPath).toContain(path.join("blog", "20", "en.mdx"));
    });
  });
});
