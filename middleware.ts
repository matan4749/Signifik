import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/builder', '/account', '/sites'];
const AUTH_PATHS = ['/login', '/signup', '/reset-password'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('session')?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // No session → redirect to login (no ?from param to avoid redirect loops)
  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Has session on auth page → go to dashboard
  if (isAuthPath && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
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
