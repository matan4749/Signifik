import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/builder', '/account', '/sites'];
const AUTH_PATHS = ['/login', '/signup', '/reset-password'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('session')?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Redirect authenticated users away from auth pages
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // For protected paths: if no session cookie at all, redirect to login.
  // If there IS a session cookie (even if potentially expired), let the page load —
  // the page-level useAuth() will catch an invalid session and redirect.
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/builder/:path*',
    '/account/:path*',
    '/sites/:path*',
    '/login',
    '/signup',
    '/reset-password',
  ],
};
