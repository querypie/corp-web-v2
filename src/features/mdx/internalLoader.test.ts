import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import * as fsModule from "fs";
import { loadInternalMdxSource } from "./internalLoader";

describe("loadInternalMdxSource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locale 파일이 있으면 해당 internal MDX를 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("# Mermaid" as any);

    const result = await loadInternalMdxSource(["mdx-guide", "mermaid-diagrams"], "en");

    expect(result).toBe("# Mermaid");
  });

  it("locale 파일이 없으면 en으로 폴백한다", async () => {
    vi.spyOn(fsModule.promises, "readFile")
      .mockRejectedValueOnce(new Error("ENOENT"))
      .mockResolvedValueOnce("# Mermaid English" as any);

    const result = await loadInternalMdxSource(["mdx-guide", "mermaid-diagrams"], "ko");

    expect(result).toBe("# Mermaid English");
  });

  it("internal 경로와 locale로 올바른 파일 경로를 구성한다", async () => {
    const spy = vi.spyOn(fsModule.promises, "readFile").mockResolvedValueOnce("" as any);

    await loadInternalMdxSource(["mdx-guide", "mermaid-diagrams"], "ja");

    const calledPath = spy.mock.calls[0][0] as string;
    expect(calledPath).toContain(
      path.join("src", "content", "internal", "mdx-guide", "mermaid-diagrams", "ja.mdx"),
    );
  });
});
