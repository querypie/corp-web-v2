import { notFound } from "next/navigation";
import ResourcesDetailRoute, { generateMetadata as generateResourcesMetadata } from "@/app/[locale]/features/resources/[slug]/page";
import { readContentItem } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const categorySlug = "events";

async function getCurrentItem({ params }: Props) {
  const { slug } = await params;
  return readContentItem("resources", decodeURIComponent(slug), { includeBodies: false });
}

export default async function EventsDetailPage(props: Props) {
  const currentItem = await getCurrentItem(props);

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    notFound();
  }

  return ResourcesDetailRoute(props);
}

export async function generateMetadata(props: Props) {
  const currentItem = await getCurrentItem(props);

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    return {};
  }

  return generateResourcesMetadata(props);
}
