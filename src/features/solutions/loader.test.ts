import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "path";
import * as fsModule from "fs";
import { loadSolutionMeta, loadSolutionMdxSource } from "./loader";

describe("loadSolutionMdxSource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locale content.mdx가 있으면 해당 내용을 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("# AIP" as any);

    const result = await loadSolutionMdxSource("aip", "ko");

    expect(result).toBe("# AIP");
  });

  it("locale 파일이 없으면 en content.mdx로 폴백한다", async () => {
    vi.spyOn(fsModule.promises, "readFile")
      .mockRejectedValueOnce(Object.assign(new Error("ENOENT"), { code: "ENOENT" }))
      .mockResolvedValueOnce("# English" as any);

    const result = await loadSolutionMdxSource("aip/integrations", "ko");

    expect(result).toBe("# English");
  });

  it("en도 없으면 null을 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readFile")
      .mockRejectedValueOnce(Object.assign(new Error("ENOENT"), { code: "ENOENT" }))
      .mockRejectedValueOnce(Object.assign(new Error("ENOENT"), { code: "ENOENT" }));

    const result = await loadSolutionMdxSource("missing", "ja");

    expect(result).toBeNull();
  });

  it("ENOENT가 아닌 파일 시스템 오류는 그대로 throw한다", async () => {
    vi.spyOn(fsModule.promises, "readFile").mockRejectedValueOnce(
      Object.assign(new Error("EACCES"), { code: "EACCES" }),
    );

    await expect(loadSolutionMdxSource("aip", "ko")).rejects.toThrow("EACCES");
  });

  it("content.mdx 경로를 올바르게 구성한다", async () => {
    const spy = vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("" as any);

    await loadSolutionMdxSource("acp/database-access-controller", "en");

    expect(spy.mock.calls[0]?.[0]).toContain(
      path.join("src", "content", "solutions", "acp", "database-access-controller", "en", "content.mdx"),
    );
  });
});

describe("loadSolutionMeta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locale meta.json이 있으면 파싱해서 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce(
      JSON.stringify({ title: "AIP", description: "desc", keywords: ["a"] }) as any,
    );

    const result = await loadSolutionMeta("aip", "ja");

    expect(result).toEqual({ title: "AIP", description: "desc", keywords: ["a"] });
  });

  it("locale meta.json이 없으면 en meta.json으로 폴백한다", async () => {
    vi.spyOn(fsModule.promises, "readFile")
      .mockRejectedValueOnce(Object.assign(new Error("ENOENT"), { code: "ENOENT" }))
      .mockResolvedValueOnce(
        JSON.stringify({ title: "AIP EN", description: "desc", keywords: ["a"] }) as any,
      );

    const result = await loadSolutionMeta("aip/integrations", "ko");

    expect(result?.title).toBe("AIP EN");
  });

  it("meta.json 경로를 올바르게 구성한다", async () => {
    const spy = vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce(
      JSON.stringify({ title: "ACP", description: "desc", keywords: [] }) as any,
    );

    await loadSolutionMeta("acp/integrations", "en");

    expect(spy.mock.calls[0]?.[0]).toContain(
      path.join("src", "content", "solutions", "acp", "integrations", "en", "meta.json"),
    );
  });
});
