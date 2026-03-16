import type { DemoCategorySlug } from "@/features/content/config";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

type AdminDemoPageProps = {
  categorySlug?: DemoCategorySlug;
  description?: string;
  title?: string;
};

export default function AdminDemoPage({
  categorySlug = "all",
  description = "Create, organize, and publish demo pages for product walkthroughs.",
  title = "Demo",
}: AdminDemoPageProps) {
  return (
    <AdminManagedContentListPage
      categorySlug={categorySlug}
      description={description}
      section="demo"
      title={title}
    />
  );
}
