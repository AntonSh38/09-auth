import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const cookieStore = request.cookies;
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${origin}/auth/session`, {
        method: 'GET',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
        return NextResponse.next();
      }
    } catch {}
  }

  if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up'],
};
