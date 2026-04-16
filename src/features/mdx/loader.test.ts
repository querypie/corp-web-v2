import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { loadMdxSource } from "./loader";

describe("loadMdxSource", () => {
  const testDir = path.join(process.cwd(), "src", "content", "mdx", "blog", "test-post");

  beforeAll(async () => {
    // Create test directory and files
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, "en.mdx"), "# English");
    await fs.writeFile(path.join(testDir, "ko.mdx"), "# Korean");
  });

  afterAll(async () => {
    // Clean up
    await fs.rm(path.join(process.cwd(), "src", "content", "mdx", "blog"), {
      recursive: true,
      force: true,
    });
  });

  it("locale 파일이 있으면 해당 파일 내용을 반환한다", async () => {
    const result = await loadMdxSource("blog", "test-post", "ko");
    expect(result).toBe("# Korean");
  });

  it("locale 파일이 없으면 en으로 폴백한다", async () => {
    const result = await loadMdxSource("blog", "test-post", "ja");
    expect(result).toBe("# English");
  });

  it("en 파일도 없으면 null을 반환한다", async () => {
    const result = await loadMdxSource("blog", "missing-post", "en");
    expect(result).toBeNull();
  });
});
