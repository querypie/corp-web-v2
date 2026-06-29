import { notFound } from "next/navigation";
import DocumentationDetailRoute, { generateMetadata as generateDocumentationMetadata } from "@/app/[locale]/features/documentation/[slug]/page";
import { readContentItem } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const categorySlug = "introduction";

async function getCurrentItem({ params }: Props) {
  const { slug } = await params;
  return readContentItem("documentation", decodeURIComponent(slug), { includeBodies: false });
}

export default async function IntroductionDeckDetailPage(props: Props) {
  const currentItem = await getCurrentItem(props);

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    notFound();
  }

  return DocumentationDetailRoute(props);
}

export async function generateMetadata(props: Props) {
  const currentItem = await getCurrentItem(props);

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    return {};
  }

  return generateDocumentationMetadata(props);
}
