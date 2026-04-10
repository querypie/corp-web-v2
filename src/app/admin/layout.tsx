import type { ReactNode } from "react";
import AdminShell from "../../components/layout/admin/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
