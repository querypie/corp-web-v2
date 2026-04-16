"use client";

import { createContext, useContext } from "react";

type AdminNavigationGuardValue = {
  allowNextNavigation: () => void;
  requestNavigation: (href: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
};

export const AdminNavigationGuardContext = createContext<AdminNavigationGuardValue | null>(null);

export function useAdminNavigationGuard() {
  const context = useContext(AdminNavigationGuardContext);

  if (!context) {
    throw new Error("useAdminNavigationGuard must be used within AdminShell");
  }

  return context;
}
