import type { DocsCategorySlug } from "@/features/content/config";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

type AdminDocumentationPageProps = {
  categorySlug?: DocsCategorySlug;
  description?: string;
  title?: string;
};

export default function AdminDocumentationPage({
  categorySlug = "all",
  description = "Manage documentation lists, detail pages, and related content recommendations.",
  title = "Documentation",
}: AdminDocumentationPageProps) {
  return (
    <AdminManagedContentListPage
      categorySlug={categorySlug}
      description={description}
      section="documentation"
      title={title}
    />
  );
}
