import acceptLanguage from "accept-language";
import { NextResponse, NextRequest } from "next/server";

import { fallbackLng, languages, cookieName } from "./app/i18n/settings";
acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export function middleware(req: NextRequest) {
  if (ฝ
    req.nextUrl.pathname.indexOf("icon") > -1 ||   //<-- เช็คว่าถ้า path เป็น /icon หรือ /chrome ก็จะผ่านได้ปกติ สองอันนี้ไม่จำเป็นต้องใส่ก็ได้ถ้าเราไม่มี path นี้
    req.nextUrl.pathname.indexOf("chrome") > -1
  )
    return NextResponse.next();

  let lng: string | undefined | null;

  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);

  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));

  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") || "");
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();

    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);

    return response;
  }

  return NextResponse.next();
}

//เมื่อเราลองเข้า browser แบบไม่ได้ระบุภาษา (http://localhost:3000) ในส่วนของ middelware จะเช็คว่ามี cookie i18next ไหม 
//ถ้ามีก็เอาค่าจาก cookie มา set ภาษา แต่ถ้าไม่มีก็ให้ดูจาก headers Accept-Language กำหนดภาษาไม่ได้อีก
//ก็จะดูจาก fallbackLng ที่กำหนดไว้

// http://localhost:3000 จะ redirect ไปที่ http://localhost:3000/th ถ้า browser ที่เปิดตั้งค่าภาษาเริ่มต้นเป็น Thai
// แต่ถ้า browser ที่เปิดตั้งค่าภาษาเป็น English เป็นค่าเริ่มต้น จะ redirect ไปที่ http://localhost:3000/en
