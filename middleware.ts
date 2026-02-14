import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  const isPublic =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api");
  if (isPublic) return NextResponse.next();

  const adminAuth = req.cookies.get("admin_auth")?.value;
  const adminRole = req.cookies.get("admin_role")?.value;

  // Handle root path: send to login if not authed, otherwise to admin dashboard
  if (pathname === "/") {
    const isAuthed = adminAuth === "1";
    const isAdminLevel = adminRole === "admin" || adminRole === "superadmin";
    const url = req.nextUrl.clone();
    if (isAuthed && isAdminLevel) {
      url.pathname = "/admin/dashboard";
    } else {
      url.pathname = "/login";
    }
    return NextResponse.redirect(url);
  }

  const isAdminRoute = pathname.startsWith("/admin");

  // If visiting admin routes, require auth + role admin
  if (isAdminRoute) {
    const isAuthed = adminAuth === "1";
    if (!isAuthed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const isAdminLevel = adminRole === "admin" || adminRole === "superadmin";
    if (!isAdminLevel) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|images|public|sw.js|manifest.json|offline.html).*)"],
};
