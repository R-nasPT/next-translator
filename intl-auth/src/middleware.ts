import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./i18n.config";
import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const publicPages = ["/"];

const intlMiddleware = createMiddleware({
  defaultLocale: "th",
  locales,
  localePrefix,
});

const { auth } = NextAuth(authConfig);

const authMiddleware = auth((req) => {
  const isLoggedIn = !!req?.auth;

  if (!isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  if (isLoggedIn) {
    return intlMiddleware(req);
  }
});

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token");
  const lang = req.nextUrl.pathname.split("/")[1] || "th";
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (token && isPublicPage) {
    return Response.redirect(new URL(`/${lang}/homepage`, req.nextUrl));
  }

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/", "/(th|en)/:path*"],
};
