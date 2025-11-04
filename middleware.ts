import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes', '/notes/filter'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const res = await checkServerSession();

      if (res.data?.success) {
        const newAccess = res.data?.tokens?.accessToken;
        const newRefresh = res.data?.tokens?.refreshToken;

        const response = NextResponse.next();

        if (newAccess) {
          response.cookies.set('accessToken', newAccess, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'lax',
          });
        }

        if (newRefresh) {
          response.cookies.set('refreshToken', newRefresh, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'lax',
          });
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
        return response;
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
    }
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
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/notes/filter/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
