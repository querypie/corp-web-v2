import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminDemoUseCaseDetailRoute({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/admin/demo/aip-features/${encodeURIComponent(decodeURIComponent(slug))}`);
}
