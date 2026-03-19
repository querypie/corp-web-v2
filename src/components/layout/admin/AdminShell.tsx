"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import Button from "../../common/Button";
import { AdminNavigationGuardContext } from "./AdminNavigationGuard";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  function requestNavigation(href: string) {
    if (!hasUnsavedChanges) {
      router.push(href);
      return;
    }

    setPendingHref(href);
  }

  return (
    <AdminNavigationGuardContext.Provider
      value={{
        requestNavigation,
        setHasUnsavedChanges,
      }}
    >
      {/* 어드민 공통 셸: 좌측 사이드바 + 우측 본문 */}
      <div className="flex min-h-screen flex-col bg-bg text-fg md:flex-row">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        />
        {/* 실제 각 관리자 페이지가 렌더링되는 본문 영역 */}
        <main className="flex-1 px-5 pb-6 pt-0 md:px-10 md:pb-8 md:pt-0">{children}</main>
      </div>

      {pendingHref ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,10,0.6)] px-5" onClick={() => setPendingHref(null)}>
          <div className="w-full max-w-[300px] rounded-modal bg-bg-content px-5 py-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="m-0 type-h3 text-fg">페이지를 벗어나시겠습니까?</h2>
                <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">
                  저장하지 않은 내용은 사라집니다.
                </p>
              </div>
              <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => setPendingHref(null)} variant="outline">
                  계속 작성
                </Button>
                <Button
                  arrow={false}
                  className="w-full justify-center sm:w-auto"
                  onClick={() => {
                    const href = pendingHref;
                    setPendingHref(null);
                    setHasUnsavedChanges(false);
                    router.push(href);
                  }}
                  variant="secondary"
                >
                  나가기
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminNavigationGuardContext.Provider>
  );
}
