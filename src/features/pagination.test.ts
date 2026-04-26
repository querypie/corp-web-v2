import { describe, expect, it } from "vitest";
import { buildPaginatedHref, paginateItems, parsePageParam } from "./pagination";

describe("parsePageParam", () => {
  it("양의 정수를 그대로 반환한다", () => {
    expect(parsePageParam("3")).toBe(3);
  });

  it("없거나 잘못된 값이면 1로 정규화한다", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-2")).toBe(1);
    expect(parsePageParam("1.5")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });
});

describe("paginateItems", () => {
  const items = [1, 2, 3, 4, 5];

  it("현재 페이지 구간의 아이템과 이전/다음 페이지 정보를 반환한다", () => {
    const result = paginateItems(items, 2, 2);

    expect(result.items).toEqual([3, 4]);
    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.hasNextPage).toBe(true);
    expect(result.previousPage).toBe(1);
    expect(result.nextPage).toBe(3);
  });

  it("요청 페이지가 마지막 페이지보다 크면 마지막 페이지로 보정한다", () => {
    const result = paginateItems(items, 999, 2);

    expect(result.items).toEqual([5]);
    expect(result.currentPage).toBe(3);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBe(false);
  });

  it("빈 목록이어도 1 페이지 구조를 유지한다", () => {
    const result = paginateItems<string>([], 3, 10);

    expect(result.items).toEqual([]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(false);
    expect(result.previousPage).toBeNull();
    expect(result.nextPage).toBeNull();
  });
});

describe("buildPaginatedHref", () => {
  it("1 페이지는 page 쿼리를 제거한 canonical 경로를 반환한다", () => {
    expect(buildPaginatedHref("/blog", 1)).toBe("/blog");
  });

  it("2 페이지 이상은 page 쿼리를 붙인다", () => {
    expect(buildPaginatedHref("/blog", 2)).toBe("/blog?page=2");
  });

  it("기존 쿼리를 유지하면서 page만 갱신한다", () => {
    const params = new URLSearchParams("category=use-cases&page=4");
    expect(buildPaginatedHref("/features/demo", 3, params)).toBe("/features/demo?category=use-cases&page=3");
    expect(buildPaginatedHref("/features/demo", 1, params)).toBe("/features/demo?category=use-cases");
  });
});
