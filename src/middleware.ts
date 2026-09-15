import { NextResponse, type NextRequest } from "next/server";
import { shouldBlockAdminAccess } from "./features/admin/access";
import { LOCALE_PREFERENCE_COOKIE, resolveRootLocale } from "./features/routing/localePreference";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    // next.config rewrites the Japanese root to /ja without changing the URL.
    const hostname = (request.headers.get("host") ?? request.nextUrl.hostname).split(":")[0].toLowerCase();
    if (["querypie.ai", "www.querypie.ai"].includes(hostname)) {
      return NextResponse.next();
    }

    const locale = resolveRootLocale(
      request.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value,
      request.headers.get("accept-language"),
    );
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}`;

    return NextResponse.redirect(destination, 307);
  }

  if (shouldBlockAdminAccess(request.nextUrl.pathname, request.nextUrl.hostname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/api/admin/:path*"],
};
