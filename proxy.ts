import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/token";

/** Guard /admin/*: anything but the login page needs a valid jw_admin cookie. */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (await verifySessionToken(request.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next();
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*"] };
