import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fsModule from "fs";
import { loadMdxSource } from "./loader";

describe("loadMdxSource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locale 파일이 있으면 해당 파일 내용을 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("# Hello" as any);
    const result = await loadMdxSource("blog", "8", "ko");
    expect(result).toBe("# Hello");
  });

  it("locale 파일이 없으면 en으로 폴백한다", async () => {
    vi.spyOn(fsModule.promises, "readFile")
      .mockRejectedValueOnce(new Error("ENOENT"))
      .mockResolvedValueOnce("# English" as any);
    const result = await loadMdxSource("blog", "8", "ja");
    expect(result).toBe("# English");
  });

  it("en 파일도 없으면 null을 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readFile").mockRejectedValue(new Error("ENOENT"));
    const result = await loadMdxSource("blog", "missing", "en");
    expect(result).toBeNull();
  });
});
