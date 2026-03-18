"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../../common/Button";
import { adminNavGroups, adminPrimaryNavItems } from "../../../constants/admin";
import { useAdminNavigationGuard } from "./AdminNavigationGuard";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const { requestNavigation } = useAdminNavigationGuard();
  const [hoverY, setHoverY] = useState(24);

  return (
    /* 어드민 전용 좌측 네비게이션 */
    <aside
      className={cx(
        "group relative flex w-full flex-col border-b border-border bg-bg-deep px-4 py-4 transition-[width,padding] duration-200 md:border-b-0 md:border-r md:px-4 md:py-6",
        isCollapsed ? "md:w-[64px] md:px-2" : "md:w-[240px] md:px-4",
      )}
      onMouseMove={(event) => {
        if (!isCollapsed) return;

        const rect = event.currentTarget.getBoundingClientRect();
        setHoverY(event.clientY - rect.top);
      }}
    >
      {isCollapsed ? (
        <button
          aria-label="사이드바 펼치기"
          className="absolute inset-0 z-10 hidden cursor-pointer md:block"
          onClick={onToggleCollapse}
          title="펼침"
          type="button"
        >
          <span
            className="absolute left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ top: `${hoverY}px` }}
          >
            <img alt="" aria-hidden="true" className="h-4 w-4 object-contain" src="/icons/arrow-right.svg" />
          </span>
        </button>
      ) : null}

      {/* 상단 브랜드 영역 */}
      <div className={cx("relative z-20 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <button
          className={cx(
            "group relative flex h-8 items-center gap-2 rounded-button transition-opacity",
            isCollapsed ? "w-8 justify-center gap-0" : "justify-start",
          )}
          onClick={() => {
            if (isCollapsed) {
              onToggleCollapse();
              return;
            }

            requestNavigation("/admin");
          }}
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className={cx(
              "h-5 w-5 object-contain transition-opacity duration-200",
              isCollapsed ? "opacity-100 group-hover:opacity-0" : "opacity-100",
            )}
            src="/icons/querypie-symbol.svg"
          />
          {isCollapsed ? null : (
            <div className="type-h3 text-fg">CMS</div>
          )}
        </button>

        <button
          aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          className={cx(
            "inline-flex h-8 w-8 items-center justify-center rounded-button opacity-60 transition-opacity hover:opacity-100 md:mr-[-4px]",
            isCollapsed && "md:hidden",
          )}
          onClick={onToggleCollapse}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-4 w-4 object-contain" src="/icons/panel-left.svg" />
        </button>
      </div>

      {/* 현재 경로를 기준으로 활성 메뉴를 표시 */}
      <nav
        className={cx(
          "mt-5 flex flex-col gap-5 transition-[opacity,transform,max-height] duration-200 md:origin-top",
          isCollapsed
            ? "pointer-events-none md:max-h-0 md:-translate-y-1 md:overflow-hidden md:opacity-0"
            : "md:max-h-[1200px] md:translate-y-0 md:opacity-100",
        )}
      >
        <div className="flex flex-wrap gap-2 md:flex-col md:gap-px">
          {adminPrimaryNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <a
                key={item.href}
                className={cx(
                  "inline-flex items-center rounded-button px-3 py-2 type-body-md transition-colors",
                  isActive ? "bg-secondary text-fg" : "text-mute-fg hover:bg-bg-content hover:text-fg",
                )}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  requestNavigation(item.href);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {adminNavGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <p className="m-0 type-body-sm text-fg">{group.label}</p>
            <div className="flex flex-col gap-px">
              {group.items
                .filter(
                  (item) =>
                    item.href !== "/admin/demo" &&
                    item.href !== "/admin/documentation",
                )
                .map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/demo" &&
                    item.href !== "/admin/documentation" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <a
                    key={item.href}
                    className={cx(
                      "inline-flex items-center rounded-button px-3 py-2 type-body-md transition-colors",
                      isActive ? "bg-secondary text-fg" : "text-mute-fg hover:bg-bg-content hover:text-fg",
                    )}
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      requestNavigation(item.href);
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!isCollapsed ? (
        <div className="mt-5 pt-5 md:mt-auto md:block">
          <Button
            arrow={false}
            className="w-full justify-center"
            onClick={() => window.open("/en", "_blank", "noopener,noreferrer")}
            variant="secondary"
          >
            Go Homepage
          </Button>
        </div>
      ) : null}

    </aside>
  );
}
