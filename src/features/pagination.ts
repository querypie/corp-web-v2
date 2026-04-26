export function parsePageParam(value?: string) {
  if (!value) {
    return 1;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function paginateItems<T>(items: T[], requestedPage: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    items: items.slice(startIndex, startIndex + pageSize),
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    totalItems: items.length,
    totalPages,
  };
}

export function buildPaginatedHref(
  pathname: string,
  page: number,
  searchParams?: URLSearchParams,
) {
  const params = new URLSearchParams(searchParams?.toString() ?? "");
  const normalizedPage = parsePageParam(String(page));

  if (normalizedPage <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(normalizedPage));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
