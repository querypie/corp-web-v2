import { notFound } from "next/navigation";
import ResourcesDetailRoute, { generateMetadata as generateResourcesMetadata } from "@/app/[locale]/features/resources/[slug]/page";
import { readContentItem } from "@/features/content/contentState.server";
import { isLocale } from "@/constants/i18n";

type Props = { params: Promise<{ locale: string; slug: string }> };
async function isLabNote({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return false;
  return (await readContentItem("resources", decodeURIComponent(slug), { includeBodies: false }))?.categorySlug === "acp-lab-notes";
}
export default async function AcpLabNoteRoute(props: Props) {
  if (!(await isLabNote(props))) notFound();
  return ResourcesDetailRoute(props);
}
export async function generateMetadata(props: Props) {
  if (!(await isLabNote(props))) return {};
  return generateResourcesMetadata(props);
}
