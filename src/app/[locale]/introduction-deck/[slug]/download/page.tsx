import { notFound } from "next/navigation";
import ResourcesDownloadRoute, { generateMetadata as generateResourcesDownloadMetadata } from "@/app/[locale]/features/resources/[slug]/download/page";
import { readContentItem } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const categorySlug = "introduction";

async function assertCategory({ params }: Props) {
  const { slug } = await params;
  const currentItem = await readContentItem("resources", decodeURIComponent(slug), { includeBodies: false });

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    notFound();
  }
}

export default async function IntroductionDeckDownloadPage(props: Props) {
  await assertCategory(props);
  return ResourcesDownloadRoute(props);
}

export async function generateMetadata(props: Props) {
  await assertCategory(props);
  return generateResourcesDownloadMetadata(props);
}
