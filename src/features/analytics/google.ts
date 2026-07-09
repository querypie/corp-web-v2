import { COOKIE_PREFERENCE_KEYS } from "@/features/cookie-preferences/preferences";

export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ||
  process.env.NEXT_PUBLIC_GA_ID ||
  "";

const deniedConsent = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "denied",
} as const;

export function buildGoogleAnalyticsPagePath(pathname: string, search: string) {
  return search ? `${pathname}?${search}` : pathname;
}

export function buildGoogleAnalyticsBootstrapScript(measurementId: string) {
  const escapedMeasurementId = JSON.stringify(measurementId);
  const analysisCookieKey = JSON.stringify(COOKIE_PREFERENCE_KEYS.analysis);
  const marketingCookieKey = JSON.stringify(COOKIE_PREFERENCE_KEYS.marketing);

  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

function getCookieValue(key) {
  var cookies = document.cookie ? document.cookie.split('; ') : [];

  for (var index = 0; index < cookies.length; index += 1) {
    if (cookies[index].indexOf(key + '=') === 0) {
      return decodeURIComponent(cookies[index].slice(key.length + 1));
    }
  }

  return null;
}

var analyticsGranted = getCookieValue(${analysisCookieKey}) === '1';
var marketingGranted = getCookieValue(${marketingCookieKey}) === '1';

gtag('consent', 'default', {
  ad_personalization: marketingGranted ? 'granted' : '${deniedConsent.ad_personalization}',
  ad_storage: marketingGranted ? 'granted' : '${deniedConsent.ad_storage}',
  ad_user_data: marketingGranted ? 'granted' : '${deniedConsent.ad_user_data}',
  analytics_storage: analyticsGranted ? 'granted' : '${deniedConsent.analytics_storage}'
});

gtag('js', new Date());
gtag('config', ${escapedMeasurementId}, { send_page_view: false });
`.trim();
}
