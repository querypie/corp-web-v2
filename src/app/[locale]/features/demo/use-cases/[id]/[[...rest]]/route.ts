import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/constants/i18n";
import { getUseCaseDemoHref } from "@/features/demo/useCase";

type RouteContext = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    return new NextResponse(null, { status: 404 });
  }

  const href = getUseCaseDemoHref(locale as Locale, id);

  if (!href) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.redirect(new URL(href, request.url));
}
