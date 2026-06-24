import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { isLocale, type Locale } from "../../../constants/i18n";

const LANGUAGE_BANNER_COOKIE = "querypie_language_banner_dismissed";

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale | null {
  const languageRanges = acceptLanguage?.split(",") ?? [];

  for (const range of languageRanges) {
    const language = range.trim().split(";")[0]?.toLowerCase();

    if (!language) {
      continue;
    }

    if (language === "ko" || language.startsWith("ko-")) {
      return "ko";
    }

    if (language === "ja" || language.startsWith("ja-")) {
      return "ja";
    }

    if (language === "en" || language.startsWith("en-")) {
      return "en";
    }
  }

  return null;
}

function getRecommendedLocale(acceptLanguage: string | null): Locale {
  return getLocaleFromAcceptLanguage(acceptLanguage) ?? "en";
}

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
