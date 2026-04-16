import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getLocalePath, locales } from "@/constants/i18n";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
  updateAuthoredContentMeta,
} from "@/features/content/authored.server";
import {
  CONTENT_STATE_CACHE_TAG,
  readContentState,
} from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import type {
  ManagedContentCategorySlug,
  ManagedContentEntry,
  ManagedContentSection,
  ManagedContentStatus,
} from "@/features/content/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReplaceStateRequest = {
  items?: ManagedContentEntry[];
  preserveExistingBodies?: boolean;
};

type UpsertStateRequest = {
  currentId?: string;
  item?: ManagedContentEntry;
  preserveExistingBodies?: boolean;
};

type DeleteStateRequest = {
  id?: string;
};

type UpdateStatusRequest = {
  id?: string;
  status?: ManagedContentStatus;
};

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function parseSection(url: string) {
  const section = new URL(url).searchParams.get("section");
  return section as ManagedContentSection | null;
}

function parseCategorySlug(url: string) {
  const categorySlug = new URL(url).searchParams.get("categorySlug");
  return categorySlug as ManagedContentCategorySlug | null;
}

function parseItemId(url: string) {
  return new URL(url).searchParams.get("id");
}

function parseView(url: string) {
  return new URL(url).searchParams.get("view");
}

function isSameItem(left: ManagedContentEntry | undefined, right: ManagedContentEntry) {
  return left ? JSON.stringify(left) === JSON.stringify(right) : false;
}

function hasBodyContent(item: Pick<ManagedContentEntry, "bodyHtml" | "bodyRichText"> | undefined) {
  if (!item) return false;

  return Object.values(item.bodyHtml).some((value) => value.trim().length > 0)
    || Object.values(item.bodyRichText).some((value) => value.trim().length > 0);
}

function mergeBodiesFromCurrent(
  item: ManagedContentEntry,
  currentItem: ManagedContentEntry | undefined,
  preserveExistingBodies = false,
) {
  if (!preserveExistingBodies || !currentItem) {
    return item;
  }

  if (hasBodyContent(item) || !hasBodyContent(currentItem)) {
    return item;
  }

  return {
    ...item,
    bodyHtml: currentItem.bodyHtml,
    bodyRichText: currentItem.bodyRichText,
  };
}

function getScopeKey(item: Pick<ManagedContentEntry, "section" | "categorySlug">) {
  return `${item.section}::${item.categorySlug}`;
}

export async function GET(request: Request) {
  const section = parseSection(request.url) ?? undefined;
  const categorySlug = parseCategorySlug(request.url) ?? undefined;
  const itemId = parseItemId(request.url);
  const view = parseView(request.url);
  const items = await readContentState(section, {
    categorySlug,
    includeBodies: view !== "list",
  });

  if (itemId) {
    return NextResponse.json(
      { item: items.find((entry) => entry.id === itemId) ?? null },
      { headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json({
    items: view === "list" ? items.map(stripManagedContentBodies) : items,
  }, {
    headers: NO_STORE_HEADERS,
  });
}

function revalidateAdminPaths(item: Pick<ManagedContentEntry, "section" | "categorySlug" | "id">) {
  revalidatePath("/admin");
  revalidatePath(`/admin/${item.section}`);

  if (item.section === "news") {
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${item.id}`);
    return;
  }

  revalidatePath(`/admin/${item.section}/${item.categorySlug}`);
  revalidatePath(`/admin/${item.section}/${item.categorySlug}/${item.id}`);
}

function revalidatePublicPaths(item: Pick<ManagedContentEntry, "section" | "id">) {
  for (const locale of locales) {
    if (item.section === "documentation") {
      revalidatePath(getLocalePath(locale, "/features/documentation"));
      revalidatePath(getLocalePath(locale, `/features/documentation/${item.id}`));
      revalidatePath(getLocalePath(locale, `/features/documentation/${item.id}/download`));
      continue;
    }

    if (item.section === "demo") {
      revalidatePath(getLocalePath(locale, "/features/demo"));
      revalidatePath(getLocalePath(locale, `/features/demo/${item.id}`));
      revalidatePath(getLocalePath(locale, `/features/demo/${item.id}/download`));
      continue;
    }

    revalidatePath(getLocalePath(locale, "/company/news"));
    revalidatePath(getLocalePath(locale, `/company/news/${item.id}`));
  }
}

function revalidateContentStateCache() {
  revalidateTag(CONTENT_STATE_CACHE_TAG);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ReplaceStateRequest;

    if (!payload.items || !Array.isArray(payload.items)) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }

    const currentItems = await readContentState();
    const currentMap = new Map(currentItems.map((item) => [item.id, item]));
    const payloadScopes = new Set(payload.items.map((item) => getScopeKey(item)));
    const nextItems: ManagedContentEntry[] = [];
    for (const item of payload.items) {
      const normalizedItem = mergeBodiesFromCurrent(
        item,
        currentMap.get(item.id),
        payload.preserveExistingBodies,
      );
      const currentItem = currentMap.get(normalizedItem.id);

      if (isSameItem(currentItem, normalizedItem)) {
        nextItems.push(normalizedItem);
        continue;
      }

      const savedItem = await saveAuthoredContent(
        normalizedItem.storageId || currentItem?.storageId
          ? {
              ...normalizedItem,
              storageId: normalizedItem.storageId ?? currentItem?.storageId,
            }
          : normalizedItem,
      );

      nextItems.push(savedItem);
    }

    const nextItemIds = new Set(nextItems.map((item) => item.id));
    const removedItems = currentItems.filter((item) =>
      payloadScopes.has(getScopeKey(item)) && !nextItemIds.has(item.id),
    );

    await Promise.all(
      removedItems.map((item) =>
        deleteAuthoredContent({
          categorySlug: item.categorySlug,
          id: item.id,
          section: item.section,
          storageId: item.storageId,
        }),
      ),
    );

    nextItems.forEach((item) => {
      revalidateAdminPaths(item);
      revalidatePublicPaths(item);
    });
    removedItems.forEach((item) => {
      revalidateAdminPaths(item);
      revalidatePublicPaths(item);
    });
    revalidateContentStateCache();

    const items = await readContentState();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to persist content state." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as UpsertStateRequest;
  const item = payload.item;

  if (!item) {
    return NextResponse.json({ error: "item is required" }, { status: 400 });
  }

  const currentItems = await readContentState();
  const currentItem = currentItems.find(
    (entry) => entry.id === (payload.currentId ?? item.id),
  ) ?? currentItems.find((entry) => entry.id === item.id);
  const normalizedItem = mergeBodiesFromCurrent(
    item,
    currentItem,
    payload.preserveExistingBodies,
  );
  const savedItem = await saveAuthoredContent(normalizedItem);
  revalidateAdminPaths(savedItem);
  revalidatePublicPaths(savedItem);
  revalidateContentStateCache();

  return NextResponse.json({ item: savedItem });
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as UpdateStatusRequest & { item?: ManagedContentEntry };

  if (!payload.id || !payload.status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  const currentItem = payload.item ?? (await readContentState()).find((item) => item.id === payload.id);

  if (currentItem) {
    await updateAuthoredContentMeta({
      categorySlug: currentItem.categorySlug,
      id: currentItem.id,
      section: currentItem.section,
      storageId: currentItem.storageId,
      updates: { status: payload.status },
    });
    revalidateAdminPaths(currentItem);
    revalidatePublicPaths(currentItem);
    revalidateContentStateCache();
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as DeleteStateRequest & { item?: ManagedContentEntry };

  if (!payload.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const currentItem = payload.item ?? (await readContentState()).find((item) => item.id === payload.id);

  if (currentItem) {
    await deleteAuthoredContent({
      categorySlug: currentItem.categorySlug,
      id: currentItem.id,
      section: currentItem.section,
      storageId: currentItem.storageId,
    });
    revalidateAdminPaths(currentItem);
    revalidatePublicPaths(currentItem);
    revalidateContentStateCache();
  }

  return NextResponse.json({ ok: true });
}
