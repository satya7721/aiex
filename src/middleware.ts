import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userType = request.cookies.get('userType')?.value;
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  if (
    path === '/' ||
    path === '/login' ||
    path === '/admin/login' ||
    path.includes('/_next') ||
    path.includes('/api/')
  ) {
    return NextResponse.next();
  }

  // Check admin routes
  if (path.startsWith('/admin')) {
    if (userType !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Check student routes
  if (path.startsWith('/dashboard') || path.startsWith('/exam') || path.startsWith('/report')) {
    if (!userType) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 