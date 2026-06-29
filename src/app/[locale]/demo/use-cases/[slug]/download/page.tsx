import { notFound } from "next/navigation";
import DemoDownloadRoute, { generateMetadata as generateDemoDownloadMetadata } from "@/app/[locale]/features/demo/[slug]/download/page";
import { readContentItem } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const categorySlug = "use-cases";

async function assertCategory({ params }: Props) {
  const { slug } = await params;
  const currentItem = await readContentItem("demo", decodeURIComponent(slug), { includeBodies: false });

  if (!currentItem || currentItem.categorySlug !== categorySlug) {
    notFound();
  }
}

export default async function UseCasesDownloadPage(props: Props) {
  await assertCategory(props);
  return DemoDownloadRoute(props);
}

export async function generateMetadata(props: Props) {
  await assertCategory(props);
  return generateDemoDownloadMetadata(props);
}
