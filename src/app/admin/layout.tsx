import type { ReactNode } from "react";
import AdminShell from "../../components/layout/admin/AdminShell";
import RevealObserver from "../../components/common/RevealObserver";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminShell>
      <RevealObserver />
      {children}
    </AdminShell>
  );
}
