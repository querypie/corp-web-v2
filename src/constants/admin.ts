import { getAdminSectionMenuItems } from "@/features/content/config";

export type AdminNavItem = {
  href: string;
  label: string;
};

export type AdminNavGroup = {
  items: AdminNavItem[];
  label: string;
};

export const adminPrimaryNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/seo", label: "SEO" },
];

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Demo",
    items: getAdminSectionMenuItems("demo"),
  },
  {
    label: "Documentation",
    items: getAdminSectionMenuItems("documentation"),
  },
];
