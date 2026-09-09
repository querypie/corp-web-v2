import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/constants/i18n";
import { getRecommendedLocale } from "@/features/routing/localePreference";

const LANGUAGE_BANNER_COOKIE = "querypie_language_banner_dismissed";

export async function GET(request: NextRequest) {
  const currentLocale = request.nextUrl.searchParams.get("locale");

  if (!currentLocale || !isLocale(currentLocale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);
  const recommendedLocale = getRecommendedLocale(headerStore.get("accept-language"));

  return NextResponse.json({
    recommendedLocale,
    visible:
      !cookieStore.has(LANGUAGE_BANNER_COOKIE) &&
      currentLocale !== recommendedLocale,
  });
}
