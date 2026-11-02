import { NextResponse, type NextRequest } from "next/server";
import { shouldBlockAdminAccess } from "./features/admin/access";
import { LOCALE_PREFERENCE_COOKIE, resolveRootLocale } from "./features/routing/localePreference";
import { resolveRootSiteRouting } from "./features/routing/siteDomainRouting";
import { DOCUMENT_LOCALE_HEADER, getDocumentLocale } from "./features/routing/documentLocale";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? request.nextUrl.hostname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(DOCUMENT_LOCALE_HEADER, getDocumentLocale(hostname, request.nextUrl.pathname));

  if (request.nextUrl.pathname === "/") {
    const routing = resolveRootSiteRouting(
      hostname,
      () => resolveRootLocale(
        request.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value,
        request.headers.get("accept-language"),
      ),
    );
    if (routing.kind === "japanese") {
      return NextResponse.next({ request: { headers: requestHeaders } });
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

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\..*).*)", "/admin/:path*", "/api/admin/:path*"],
};
