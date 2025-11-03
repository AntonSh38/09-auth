import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (accessToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (refreshToken) {
      try {
        const cookieHeader = `refreshToken=${refreshToken}`;
        const apiRes = await api.get('/auth/session', {
          headers: {
            Cookie: cookieHeader,
          },
        });

        const setCookie = apiRes.headers['set-cookie'];
        const res = NextResponse.json({ success: true }, { status: 200 });

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];
          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || '/',
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
            };

            if (parsed.accessToken) {
              res.cookies.set('accessToken', parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              res.cookies.set('refreshToken', parsed.refreshToken, options);
            }
          }
        }

        return res;
      } catch (error) {
        if (isAxiosError(error)) {
          logErrorResponse(error.response?.data);
        } else {
          logErrorResponse({ message: (error as Error).message });
        }
        return NextResponse.json({ success: false }, { status: 401 });
      }
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
