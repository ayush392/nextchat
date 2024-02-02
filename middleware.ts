import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get("nextChat");

  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    if (cookie) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
