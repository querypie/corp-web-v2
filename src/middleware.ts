import { NextResponse, type NextRequest } from "next/server";
import { shouldBlockAdminAccess } from "./features/admin/access";
import { LOCALE_PREFERENCE_COOKIE, resolveRootLocale } from "./features/routing/localePreference";
import { resolveRootSiteRouting } from "./features/routing/siteDomainRouting";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const hostname = request.headers.get("host") ?? request.nextUrl.hostname;
    const routing = resolveRootSiteRouting(
      hostname,
      () => resolveRootLocale(
        request.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value,
        request.headers.get("accept-language"),
      ),
    );
    if (routing.kind === "japanese") {
      return NextResponse.next();
    }

    const destination = request.nextUrl.clone();
    destination.pathname = `/${routing.locale}`;

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
