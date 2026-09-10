import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function LegacyUseCasesDownloadPage({ params }: Props) {
  const { locale, slug } = await params;
  permanentRedirect(`/${locale}/demo/aip/${encodeURIComponent(decodeURIComponent(slug))}/download`);
}
