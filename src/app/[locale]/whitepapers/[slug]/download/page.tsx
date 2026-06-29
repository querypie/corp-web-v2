import { notFound } from "next/navigation";
import DocumentationDownloadRoute, { generateMetadata as generateDocumentationDownloadMetadata } from "@/app/[locale]/features/documentation/[slug]/download/page";
import { readContentItem } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const categorySlug = "white-papers";

async function assertCategory({ params }: Props) {
  const { slug } = await params;
  const currentItem = await readContentItem("documentation", decodeURIComponent(slug), { includeBodies: false });

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    notFound();
  }
}

export default async function WhitepapersDownloadPage(props: Props) {
  await assertCategory(props);
  return DocumentationDownloadRoute(props);
}

export async function generateMetadata(props: Props) {
  await assertCategory(props);
  return generateDocumentationDownloadMetadata(props);
}
