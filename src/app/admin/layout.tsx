import type { ReactNode } from "react";
import AdminShell from "@/components/layout/admin/AdminShell";
import { getAdminRequestLocale } from "@/features/admin/locale.server";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const initialLocale = await getAdminRequestLocale();

  return (
    <AdminShell initialLocale={initialLocale}>
      {children}
    </AdminShell>
  );
}
