import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function LegacyUseCasesDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (resolvedSlug === "lovo-ai-tom-lee") {
    permanentRedirect(`/${locale}/voc/lovo-ai-tom-lee`);
  }

  permanentRedirect(`/${locale}/demo/aip/${encodeURIComponent(resolvedSlug)}`);
}
