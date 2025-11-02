import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookies
  const adminUserId = request.cookies.get('admin_user_id')?.value;
  const adminRole = request.cookies.get('admin_role')?.value;
  
  const isAuthenticated = !!(adminUserId && (adminRole === 'admin' || adminRole === 'superadmin'));

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/session', '/api/auth/logout'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Admin paths that require authentication
  const isAdminPath = pathname.startsWith('/admin');

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If user is not authenticated and trying to access admin pages, redirect to login
  if (!isAuthenticated && isAdminPath) {
    const loginUrl = new URL('/login', request.url);
    // Add redirect parameter to return to original page after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing root path
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
