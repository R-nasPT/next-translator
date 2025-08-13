import type { NextRequest } from 'next/server';
import { publicRoutes } from './routes';
import { getAuthToken } from './lib/auth-token';
import createMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

const publicPages = ["/"];

const intlMiddleware = createMiddleware({
  defaultLocale: "th",
  locales,
  localePrefix,
});

const { auth } = NextAuth(authConfig);

const authMiddleware = auth(req => {
  const isLoggedIn = !!req?.auth;

  if (!isLoggedIn) {
    const fullPath = req.nextUrl.pathname;
    const searchParams = req.nextUrl.search;
    const currentPath = fullPath.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    
    const callbackUrl = encodeURIComponent(`${currentPath}${searchParams}`);
    const loginUrl = new URL(`/`, req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);

    return Response.redirect(loginUrl);
  }

  if (isLoggedIn) {
    return handleI18nRouting(req);
  }
}) as NextAuthMiddleware;

export default async function middleware(req: NextRequest) {
  const token = await getAuthToken(req);
  const locale = req.nextUrl.pathname.split('/')[1] || 'th';
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicRoutes
      .flatMap(p => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (token && isPublicPage) {
    return Response.redirect(new URL(`/${locale}/dashboard`, req.nextUrl));
  }

  if (isPublicPage) {
    return handleI18nRouting(req);
  } else {
    return authMiddleware(req);
  }
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
