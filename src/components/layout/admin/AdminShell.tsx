import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    /* 어드민 공통 셸: 좌측 사이드바 + 우측 본문 */
    <div className="flex min-h-screen flex-col bg-bg text-fg md:flex-row">
      <AdminSidebar />
      {/* 실제 각 관리자 페이지가 렌더링되는 본문 영역 */}
      <main className="flex-1 px-5 py-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
