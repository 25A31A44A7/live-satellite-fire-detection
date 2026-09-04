import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'live-satellite-super-secure-production-jwt-secret-2026-sih'
);

const COOKIE_NAME = 'live_satellite_token';

// Protected routes requiring authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/map',
  '/historical',
  '/thermal-sources',
  '/alerts',
  '/analytics',
  '/reports',
  '/settings',
  '/admin',
  '/fires',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // If admin route, check role
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/map/:path*',
    '/historical/:path*',
    '/thermal-sources/:path*',
    '/alerts/:path*',
    '/analytics/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/fires/:path*',
  ],
};
