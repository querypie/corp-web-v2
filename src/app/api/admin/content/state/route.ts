import { NextResponse } from "next/server";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
  updateAuthoredContentMeta,
} from "@/features/content/authored.server";
import {
  deleteContentState,
  readContentState,
  replaceContentState,
  updateContentStateStatus,
  upsertContentState,
} from "@/features/content/contentState.server";
import type { ManagedContentEntry, ManagedContentSection, ManagedContentStatus } from "@/features/content/data";

type ReplaceStateRequest = {
  items?: ManagedContentEntry[];
};

type UpsertStateRequest = {
  currentId?: string;
  item?: ManagedContentEntry;
};

type DeleteStateRequest = {
  id?: string;
};

type UpdateStatusRequest = {
  id?: string;
  status?: ManagedContentStatus;
};

function parseSection(url: string) {
  const section = new URL(url).searchParams.get("section");
  return section as ManagedContentSection | null;
}

export async function GET(request: Request) {
  const section = parseSection(request.url) ?? undefined;
  const items = await readContentState(section);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ReplaceStateRequest;

  if (!payload.items || !Array.isArray(payload.items)) {
    return NextResponse.json({ error: "items is required" }, { status: 400 });
  }

  const currentItems = await readContentState();
  const currentMap = new Map(currentItems.map((item) => [item.id, item]));
  const payloadSections = new Set(payload.items.map((item) => item.section));
  const nextItems: ManagedContentEntry[] = [];

  for (const item of payload.items) {
    if (item.contentFormat === "tiptap" || item.contentType === "outlink" || item.section === "news") {
      const currentItem = currentMap.get(item.id);
      const savedItem =
        item.storageId || currentItem?.storageId
          ? await saveAuthoredContent({
              ...item,
              storageId: item.storageId ?? currentItem?.storageId,
            })
          : await saveAuthoredContent(item);
      nextItems.push(savedItem);
      continue;
    }

    nextItems.push(item);
  }

  const itemsToPersist =
    payloadSections.size === 1
      ? [
          ...nextItems,
          ...currentItems.filter((item) => !payloadSections.has(item.section)),
        ]
      : nextItems;

  const items = await replaceContentState(itemsToPersist);
  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as UpsertStateRequest;
  const item = payload.item;

  if (!item) {
    return NextResponse.json({ error: "item is required" }, { status: 400 });
  }

  const savedItem =
    item.contentFormat === "tiptap" || item.contentType === "outlink" || item.section === "news"
      ? await saveAuthoredContent(item)
      : item;

  await upsertContentState(savedItem, payload.currentId);
  return NextResponse.json({ item: savedItem });
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as UpdateStatusRequest & { item?: ManagedContentEntry };

  if (!payload.id || !payload.status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  if (payload.item && (payload.item.contentFormat === "tiptap" || payload.item.contentType === "outlink" || payload.item.section === "news")) {
    await updateAuthoredContentMeta({
      categorySlug: payload.item.categorySlug,
      id: payload.item.id,
      section: payload.item.section,
      storageId: payload.item.storageId,
      updates: { status: payload.status },
    });
  }

  await updateContentStateStatus(payload.id, payload.status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as DeleteStateRequest & { item?: ManagedContentEntry };

  if (!payload.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (payload.item && (payload.item.contentFormat === "tiptap" || payload.item.contentType === "outlink" || payload.item.section === "news")) {
    await deleteAuthoredContent({
      categorySlug: payload.item.categorySlug,
      id: payload.item.id,
      section: payload.item.section,
      storageId: payload.item.storageId,
    });
  }

  await deleteContentState(payload.id);
  return NextResponse.json({ ok: true });
}
