"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { translateAdminCopy } from "@/features/admin/i18n";
import {
  ADMIN_LOCALE_COOKIE_KEY,
  type AdminLocale,
} from "@/features/admin/preferences";

type AdminLocaleContextValue = {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (copy: string) => string;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export default function AdminLocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: AdminLocale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AdminLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: AdminLocale) => {
    document.cookie = `${ADMIN_LOCALE_COOKIE_KEY}=${nextLocale}; Path=/admin; Max-Age=31536000; SameSite=Lax`;
    setLocaleState(nextLocale);
    router.refresh();
  }, [router]);

  const value = useMemo<AdminLocaleContextValue>(() => ({
    locale,
    setLocale,
    t: (copy) => translateAdminCopy(locale, copy),
  }), [locale, setLocale]);

  return (
    <AdminLocaleContext.Provider value={value}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const value = useContext(AdminLocaleContext);

  if (!value) {
    throw new Error("useAdminLocale must be used inside AdminLocaleProvider");
  }

  return value;
}
