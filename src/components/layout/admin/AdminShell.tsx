"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import Button from "../../common/Button";
import { AdminNavigationGuardContext } from "./AdminNavigationGuard";
import { adminNavGroups, adminPrimaryNavItems } from "@/constants/admin";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingBackNavigation, setPendingBackNavigation] = useState(false);
  const allowBrowserNavigationRef = useRef(false);

  function requestNavigation(href: string) {
    if (!hasUnsavedChanges) {
      router.push(href);
      return;
    }

    setPendingHref(href);
  }

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      if (allowBrowserNavigationRef.current) {
        return;
      }

      setPendingBackNavigation(true);
      window.history.go(1);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <AdminNavigationGuardContext.Provider
      value={{
        requestNavigation,
        setHasUnsavedChanges,
      }}
    >
      {/* 어드민 공통 셸: 좌측 사이드바 + 우측 본문 */}
      <div className="flex min-h-screen flex-col bg-bg text-fg md:flex-row">
        <header className="fixed inset-x-0 top-0 z-40 flex h-[60px] items-center justify-center bg-[rgba(8,9,10,0.9)] px-5 backdrop-blur-[10px] md:hidden">
          <div className="flex w-full items-center justify-between">
            <button
              className="inline-flex items-center gap-2"
              onClick={() => requestNavigation("/admin")}
              type="button"
            >
              <img alt="" aria-hidden="true" className="h-5 w-5 object-contain" src="/icons/querypie-symbol.svg" />
              <span className="type-h3 text-fg">CMS</span>
            </button>
            <button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              className="inline-flex h-10 w-10 items-center justify-center"
              onClick={() => setMobileMenuOpen((current) => !current)}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className="h-10 w-10 object-contain"
                src={mobileMenuOpen ? "/icons/m-Close.svg" : "/icons/m-Menu.svg"}
              />
            </button>
          </div>
        </header>
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        />
        {/* 실제 각 관리자 페이지가 렌더링되는 본문 영역 */}
        <main className="flex-1 px-5 pb-6 pt-[60px] md:px-10 md:pb-8 md:pt-0">{children}</main>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[60px] z-30 overflow-y-auto bg-[rgba(8,9,10,0.9)] backdrop-blur-[10px] md:hidden">
          <nav className="flex w-full flex-col gap-[30px] px-5 py-[30px]" aria-label="Mobile admin">
            <div className="flex flex-col gap-[10px]">
              {adminPrimaryNavItems.map((item) => (
                <button
                  key={item.href}
                  className="text-left type-body-lg text-fg"
                  onClick={() => requestNavigation(item.href)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {adminNavGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-[10px]">
                <div className="flex flex-col gap-[10px]">
                  {group.items
                    .filter(
                      (item) =>
                        item.href !== "/admin/demo" &&
                        item.href !== "/admin/documentation",
                    )
                    .map((item) => (
                      <button
                        key={item.href}
                        className="text-left type-body-lg text-fg"
                        onClick={() => requestNavigation(item.href)}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      ) : null}

      {pendingHref || pendingBackNavigation ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,10,0.6)] px-5"
          onClick={() => {
            setPendingHref(null);
            setPendingBackNavigation(false);
          }}
        >
          <div className="w-full max-w-[300px] rounded-modal bg-bg-content px-5 py-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="m-0 type-h3 text-fg">페이지를 벗어나시겠습니까?</h2>
                <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">
                  저장하지 않은 내용은 사라집니다.
                </p>
              </div>
              <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                <Button
                  arrow={false}
                  className="w-full justify-center sm:w-auto"
                  onClick={() => {
                    setPendingHref(null);
                    setPendingBackNavigation(false);
                  }}
                  style="round"
                  variant="outline"
                >
                  계속 작성
                </Button>
                <Button
                  arrow={false}
                  className="w-full justify-center sm:w-auto"
                  onClick={() => {
                    const href = pendingHref;
                    setPendingHref(null);
                    setPendingBackNavigation(false);
                    setHasUnsavedChanges(false);

                    if (href) {
                      router.push(href);
                      return;
                    }

                    allowBrowserNavigationRef.current = true;
                    window.history.back();
                    window.setTimeout(() => {
                      allowBrowserNavigationRef.current = false;
                    }, 0);
                  }}
                  style="round"
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
