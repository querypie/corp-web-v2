import { NextResponse, type NextRequest } from "next/server";
import { shouldBlockAdminAccess } from "./src/features/admin/access";
import { LOCALE_PREFERENCE_COOKIE, resolveRootLocale } from "./src/features/routing/localePreference";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
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
