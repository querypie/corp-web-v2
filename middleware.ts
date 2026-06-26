import { NextResponse, type NextRequest } from "next/server";
import { shouldBlockAdminAccess } from "./src/features/admin/access";

export function middleware(request: NextRequest) {
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
