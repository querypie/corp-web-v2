import path from "path";
import { promises as fs } from "fs";
import { describe, expect, it } from "vitest";

const WORKTREE_ROOT = process.cwd();
const WHITE_PAPERS_MDX_ROOT = path.join(WORKTREE_ROOT, "src", "content", "mdx", "white-papers");
const WHITE_PAPERS_PUBLIC_ROOT = path.join(WORKTREE_ROOT, "public", "white-papers");

async function collectFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(root, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(entryPath);
      }
      return [entryPath];
    }),
  );

  return nested.flat();
}

describe("white paper path consistency", () => {
  it("MDX white paper source 디렉터리는 white-papers 복수형을 사용한다", async () => {
    await expect(fs.access(path.join(WORKTREE_ROOT, "src", "content", "mdx", "white-papers"))).resolves.toBeUndefined();
  });

  it("white paper public 자산 디렉터리는 white-papers 복수형을 사용한다", async () => {
    await expect(fs.access(WHITE_PAPERS_PUBLIC_ROOT)).resolves.toBeUndefined();
  });

  it("white paper MDX 파일 안에는 단수형 local 경로가 남아있지 않다", async () => {
    const files = await collectFiles(WHITE_PAPERS_MDX_ROOT);

    for (const file of files.filter((candidate) => candidate.endsWith(".mdx") || candidate.endsWith(".ts"))) {
      const content = await fs.readFile(file, "utf-8");
      expect(content).not.toContain("public/white-paper/");
      expect(content).not.toContain("/white-paper/");
      expect(content).not.toContain("/resources/discover/white-paper/");
    }
  });
});
