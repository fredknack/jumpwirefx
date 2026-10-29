import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/token";

const SAFE_NEXT = /^\/admin(\/|\?|$)/;

/**
 * Guard /admin/*: anything but the login page needs a valid jw_admin cookie,
 * and a signed-in admin visiting the login page is sent on to the admin.
 * (Done here, not in the page: reading cookies() while the login action is
 * mutating them trips a Next.js invariant.)
 */
export async function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const signedIn = await verifySessionToken(request.cookies.get(COOKIE_NAME)?.value);
  if (pathname === "/admin/login") {
    if (!signedIn) return NextResponse.next();
    const next = searchParams.get("next");
    return NextResponse.redirect(new URL(next && SAFE_NEXT.test(next) ? next : "/admin", request.url));
  }
  if (signedIn) return NextResponse.next();
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*"] };
