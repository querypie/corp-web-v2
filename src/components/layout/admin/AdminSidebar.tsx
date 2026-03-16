"use client";

import { usePathname } from "next/navigation";
import { adminNavGroups, adminPrimaryNavItems } from "../../../constants/admin";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    /* 어드민 전용 좌측 네비게이션 */
    <aside className="flex w-full flex-col border-b border-border bg-bg-deep px-5 py-5 md:w-[240px] md:border-b-0 md:border-r md:px-4 md:py-6">
      {/* 상단 브랜드 영역 */}
      <div className="flex items-center justify-between md:block">
        <div className="flex items-center gap-2">
          <img
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
            src="/icons/querypie-symbol.svg"
          />
          <div className="type-h3 text-fg">CMS</div>
        </div>
      </div>

      {/* 현재 경로를 기준으로 활성 메뉴를 표시 */}
      <nav className="mt-5 flex flex-col gap-5">
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
              {group.items.map((item) => {
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
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}
