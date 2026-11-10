import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/demo') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/api/demo');

  if (isPublic) {
    return NextResponse.next();
  }

  // App routes allow seamless demo sessions
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
