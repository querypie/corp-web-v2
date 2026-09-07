import { cookies, headers } from "next/headers";
import {
  ADMIN_LOCALE_COOKIE_KEY,
  resolveAdminLocale,
  type AdminLocale,
} from "./preferences";

export async function getAdminRequestLocale(): Promise<AdminLocale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolveAdminLocale(
    cookieStore.get(ADMIN_LOCALE_COOKIE_KEY)?.value,
    headerStore.get("accept-language"),
  );
}
