import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminDemoUseCaseDetailRoute({ params }: Props) {
  const { slug } = await params;

  return <AdminManagedContentDetailPage categorySlug="use-cases" itemId={slug} section="demo" />;
}
