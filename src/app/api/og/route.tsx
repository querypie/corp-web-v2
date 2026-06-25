import { NextResponse } from "next/server";

import { isLocale, type Locale } from "@/constants/i18n";
import { siteTitle } from "@/constants/site";
import { createOgImage } from "@/features/seo/ogImage";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = isLocale(localeParam ?? "") ? localeParam as Locale : "en";
  const title = searchParams.get("title") || siteTitle;
  const description = searchParams.get("description") || "";

  try {
    return await createOgImage({
      locale,
      title,
      description,
    });
  } catch (error) {
    console.error("Failed to generate OG image.", error);
    return NextResponse.json({ message: "Failed to generate OG image." }, { status: 500 });
  }
}
