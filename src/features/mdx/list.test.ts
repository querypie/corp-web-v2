import { beforeEach, describe, expect, it, vi } from "vitest";
import * as fsModule from "fs";

const unstableCacheStore = new Map<string, unknown>();

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => {
  return {
    unstable_cache: <TArgs extends unknown[], TResult>(
      fn: (...args: TArgs) => Promise<TResult>,
      keyParts?: string[],
    ) => {
      return async (...args: TArgs): Promise<TResult> => {
        const cacheKey = JSON.stringify([keyParts ?? [], args]);

        if (unstableCacheStore.has(cacheKey)) {
          return unstableCacheStore.get(cacheKey) as TResult;
        }

        const result = await fn(...args);
        unstableCacheStore.set(cacheKey, result);
        return result;
      };
    },
  };
});

import { loadMdxListItems } from "./list";
import { loadMdxSource } from "./loader";
import { renderMdx } from "./renderer";

vi.mock("./loader", () => ({
  loadMdxSource: vi.fn(),
}));

vi.mock("./renderer", () => ({
  renderMdx: vi.fn(),
}));

describe("loadMdxListItems", () => {
  beforeEach(() => {
    unstableCacheStore.clear();
    vi.clearAllMocks();
  });

  it("디렉터리 목록을 읽어 MDX 목록 아이템을 날짜 내림차순으로 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readdir").mockResolvedValueOnce([
      { isDirectory: () => true, name: "1" },
      { isDirectory: () => true, name: "2" },
      { isDirectory: () => false, name: "ignore.txt" },
    ] as any);

    vi.mocked(loadMdxSource)
      .mockResolvedValueOnce("source-1")
      .mockResolvedValueOnce("source-2");

    vi.mocked(renderMdx)
      .mockResolvedValueOnce({
        frontmatter: {
          category: "blog",
          date: "2024-01-01",
          description: "Older post",
          ogImage: "public/blog/1/thumbnail.png",
          slug: "older-post-slug",
          title: "Older",
        },
      } as any)
      .mockResolvedValueOnce({
        frontmatter: {
          category: "blog",
          date: "2024-05-01",
          description: "Newer post",
          ogImage: "public/blog/2/thumbnail.png",
          slug: "newer-post-slug",
          title: "Newer",
        },
      } as any);

    const items = await loadMdxListItems("blog", "ko");

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      dateIso: "2024-05-01",
      description: "Newer post",
      href: "/ko/blog/2/newer-post-slug",
      id: "2",
      imageSrc: "/blog/2/thumbnail.png",
      title: "Newer",
    });
    expect(items[1]).toMatchObject({
      dateIso: "2024-01-01",
      href: "/ko/blog/1/older-post-slug",
      id: "1",
      imageSrc: "/blog/1/thumbnail.png",
      title: "Older",
    });
  });

  it("소스를 읽지 못한 항목은 목록에서 제외한다", async () => {
    vi.spyOn(fsModule.promises, "readdir").mockResolvedValueOnce([
      { isDirectory: () => true, name: "1" },
      { isDirectory: () => true, name: "2" },
    ] as any);

    vi.mocked(loadMdxSource)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("source-2");

    vi.mocked(renderMdx).mockResolvedValueOnce({
      frontmatter: {
        category: "whitepaper",
        date: "2024-03-10",
        description: "White paper",
        ogImage: "public/whitepapers/2/thumbnail.png",
        slug: "white-paper-custom-slug",
        title: "Only item",
      },
    } as any);

    const items = await loadMdxListItems("white-paper", "en");

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      href: "/whitepapers/2/white-paper-custom-slug",
      id: "2",
      imageSrc: "/whitepapers/2/thumbnail.png",
      title: "Only item",
    });
  });

  it("같은 category와 locale 조합은 재호출 시 캐시된 목록을 재사용한다", async () => {
    const readdirSpy = vi.spyOn(fsModule.promises, "readdir").mockResolvedValueOnce([
      { isDirectory: () => true, name: "2" },
    ] as any);

    vi.mocked(loadMdxSource).mockResolvedValueOnce("source-2");
    vi.mocked(renderMdx).mockResolvedValueOnce({
      frontmatter: {
        category: "blog",
        date: "2024-05-01",
        description: "Cached post",
        ogImage: "public/blog/2/thumbnail.png",
        title: "Cached",
      },
    } as any);

    const first = await loadMdxListItems("blog", "en");
    const second = await loadMdxListItems("blog", "en");

    expect(first).toEqual(second);
    expect(readdirSpy).toHaveBeenCalledTimes(1);
    expect(loadMdxSource).toHaveBeenCalledTimes(1);
    expect(renderMdx).toHaveBeenCalledTimes(1);
  });
});
