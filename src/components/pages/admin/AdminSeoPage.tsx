import AdminHeader from "../../layout/admin/AdminHeader";

export default function AdminSeoPage() {
  return (
    <section className="flex flex-col gap-8">
      <AdminHeader
        description="Review metadata, keyword targets, indexing health, and page-level search performance."
        title="SEO"
      />

      <div className="rounded-box border border-border bg-bg-content p-5">
        <p className="m-0 type-body-md text-mute-fg">
          SEO management area placeholder.
        </p>
      </div>
    </section>
  );
}
