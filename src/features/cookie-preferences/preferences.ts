export const COOKIE_PREFERENCE_MAX_AGE_DAYS = 730;

export const COOKIE_PREFERENCE_KEYS = {
  set: "cookie-preference-set",
  functional: "cookie-preference-functional",
  performance: "cookie-preference-performance",
  analysis: "cookie-preference-event",
  marketing: "cookie-preference-marketing",
} as const;

export const USER_SELECTED_LOCALE_COOKIE_KEY = "user-selected-locale";
export const COOKIE_PREFERENCE_CHANGE_EVENT = "querypie-cookie-preference-change";

export type CookiePreferenceId =
  | "necessary"
  | "performance"
  | "functional"
  | "analysis"
  | "marketing";

export type OptionalCookiePreferenceId = Exclude<CookiePreferenceId, "necessary">;

const optionalPreferenceIds = ["performance", "functional", "analysis", "marketing"] as const;
const analyticsCookiePrefixes = ["_ga", "_gid", "_gat"];
const marketingCookiePrefixes = ["_gcl", "_fbp", "_fbc"];

export function isOptionalCookiePreferenceId(
  id: CookiePreferenceId,
): id is OptionalCookiePreferenceId {
  return optionalPreferenceIds.includes(id as OptionalCookiePreferenceId);
}

function getExpires(days = COOKIE_PREFERENCE_MAX_AGE_DAYS) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}

function getCookie(key: string): string | null {
  const cookie = document.cookie
    .split(";")
    .find((item) => item.trim().startsWith(`${key}=`));

  return cookie ? cookie.trim().slice(key.length + 1) : null;
}

function setCookie(key: string, value: string, expires = getExpires()) {
  document.cookie = `${key}=${value}; expires=${expires.toUTCString()}; path=/`;
}

function deleteCookie(key: string) {
  setCookie(key, "", getExpires(-1));

  if (window.location.hostname.includes(".")) {
    const rootDomain = window.location.hostname.split(".").slice(-2).join(".");
    document.cookie = `${key}=; expires=${getExpires(-1).toUTCString()}; path=/; domain=.${rootDomain}`;
  }
}

export function readCookiePreference(id: CookiePreferenceId) {
  if (id === "necessary") {
    return true;
  }

  return getCookie(COOKIE_PREFERENCE_KEYS[id]) === "1";
}

export function hasCookiePreferenceSet() {
  return getCookie(COOKIE_PREFERENCE_KEYS.set) === "1";
}

function deleteCookiesByPrefixes(prefixes: string[]) {
  document.cookie
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter((name) => prefixes.some((prefix) => name.startsWith(prefix)))
    .forEach(deleteCookie);
}

function notifyCookiePreferenceChange() {
  window.dispatchEvent(new CustomEvent(COOKIE_PREFERENCE_CHANGE_EVENT));
}

function updateGoogleConsent() {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;

  if (!gtag) {
    return;
  }

  const analyticsGranted = readCookiePreference("analysis");
  const marketingGranted = readCookiePreference("marketing");

  gtag("consent", "update", {
    ad_personalization: marketingGranted ? "granted" : "denied",
    ad_storage: marketingGranted ? "granted" : "denied",
    ad_user_data: marketingGranted ? "granted" : "denied",
    analytics_storage: analyticsGranted ? "granted" : "denied",
  });
}

export function writeCookiePreference(id: OptionalCookiePreferenceId, enabled: boolean) {
  setCookie(COOKIE_PREFERENCE_KEYS[id], enabled ? "1" : "0");
  setCookie(COOKIE_PREFERENCE_KEYS.set, "1");

  if (id === "functional" && !enabled) {
    deleteCookie(USER_SELECTED_LOCALE_COOKIE_KEY);
  }

  if (id === "analysis" && !enabled) {
    deleteCookiesByPrefixes(analyticsCookiePrefixes);
  }

  if (id === "marketing" && !enabled) {
    deleteCookiesByPrefixes(marketingCookiePrefixes);
  }

  updateGoogleConsent();
  notifyCookiePreferenceChange();
}

export function acceptAllCookiePreferences() {
  optionalPreferenceIds.forEach((id) => writeCookiePreference(id, true));
  setCookie(COOKIE_PREFERENCE_KEYS.set, "1");
}

export function declineAllCookiePreferences() {
  optionalPreferenceIds.forEach((id) => writeCookiePreference(id, false));
  setCookie(COOKIE_PREFERENCE_KEYS.set, "1");
}
