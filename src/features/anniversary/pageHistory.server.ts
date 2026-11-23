import "server-only";

import type { Locale } from "@/constants/i18n";
import { getAnniversaryHistory } from "@/copy/anniversaryHistory";
import { readContentState } from "@/features/content/contentState.server";
import { getLocalizedContent, isPublishedContentAccessible } from "@/features/content/data";

export async function getAnniversaryPageHistory(locale: Locale) {
  const news = await readContentState("news", { includeBodies: false });
  const thumbnails = new Map(
    news
      .filter((item) => isPublishedContentAccessible(item) && item.imageSrc.trim())
      .map(({ id, imageSrc, title }) => [id, { src: imageSrc, alt: getLocalizedContent(title, locale) }] as const),
  );
  return getAnniversaryHistory(locale, thumbnails);
}
