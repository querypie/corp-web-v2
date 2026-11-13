import { notFound } from "next/navigation";
import AcpLabNotesPage from "@/components/pages/resources/AcpLabNotesPage";
import { getAcpLabNotesCopy } from "@/copy/acpLabNotes";
import { isLocale } from "@/constants/i18n";
import { readContentState } from "@/features/content/contentState.server";
import { formatPublicDate, getLocalizedContent, getPublicDetailHref, getPublicListHref, isPublishedContentVisible } from "@/features/content/data";
import type { DocsCategorySlug } from "@/features/content/config";
import { getLocalizedLabNote, sortLabNotes } from "@/features/content/acpLabNotes";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function AcpLabNotesRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const publicItems = (await readContentState("resources", { includeBodies: false }))
    .filter((item) => isPublishedContentVisible(item, locale));
  const visibleCategorySlugs = Array.from(new Set(publicItems.map((item) => item.categorySlug as DocsCategorySlug)));
  const items = sortLabNotes(publicItems.filter((item) => item.categorySlug === "acp-lab-notes"));
  return <AcpLabNotesPage locale={locale} visibleCategorySlugs={visibleCategorySlugs} items={items.map((item) => ({ href: getPublicDetailHref("resources", locale, item.id, item.categorySlug), title: getLocalizedContent(item.title, locale), summary: getLocalizedContent(item.summary, locale), imageSrc: item.imageSrc, date: formatPublicDate(locale, item.dateIso), topics: getLocalizedLabNote(item, locale)?.topics ?? [] }))} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getAcpLabNotesCopy(locale);
  return withDynamicOgImage({ title: copy.title, description: copy.description, alternates: { canonical: getPublicListHref("resources", locale, "acp-lab-notes") } }, { locale, supportedLocales: ["en", "ko", "ja"], title: copy.title, description: copy.description });
}
