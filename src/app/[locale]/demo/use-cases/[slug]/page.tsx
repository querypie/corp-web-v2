import { notFound, permanentRedirect } from "next/navigation";
import DemoDetailRoute, { generateMetadata as generateDemoMetadata } from "@/app/[locale]/features/demo/[slug]/page";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import { isPublishedContentAccessible } from "@/features/content/data";
import { isContentGatingEnabled } from "@/features/content/gating";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const categorySlug = "use-cases";

async function getCurrentItem({ params }: Props) {
  const { slug } = await params;
  return readContentItem("demo", decodeURIComponent(slug), { includeBodies: false });
}

export async function generateStaticParams() {
  const demoItems = await readContentState("demo", { includeBodies: false });

  return demoItems
    .filter((item) => item.categorySlug === categorySlug)
    .filter((item) => isPublishedContentAccessible(item) && item.contentType !== "outlink")
    .filter((item) => !isContentGatingEnabled(item))
    .map((item) => ({ slug: item.id }));
}

export default async function UseCasesDetailPage(props: Props) {
  const { locale, slug } = await props.params;

  if (decodeURIComponent(slug) === "lovo-ai-tom-lee") {
    permanentRedirect(`/${locale}/voc/lovo-ai-tom-lee`);
  }

  const currentItem = await getCurrentItem(props);

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    notFound();
  }

  return DemoDetailRoute(props);
}

export async function generateMetadata(props: Props) {
  const currentItem = await getCurrentItem(props);

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    return {};
  }

  return generateDemoMetadata(props);
}
