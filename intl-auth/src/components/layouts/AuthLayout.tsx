"use client";

import { usePathname, useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { data: session, status } = useSession();
  console.log(session);
  console.log("status", status);
  const router = useRouter();
  const pathname = usePathname();
  const currentTime = Math.floor(Date.now() / 1000);

  const [lastCheckedDay, setLastCheckedDay] = useState(0);

  const userAuth = {
    user: session?.user,
    expires: (session?.user as any)?.exp,
    issuedAt: (session?.user as any)?.iat,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };

  useEffect(() => {
    if (!userAuth.isAuthenticated || !userAuth.issuedAt) return;

    // คำนวณวันที่ Login
    const daysSinceLogin = Math.floor((currentTime - userAuth.issuedAt) / (24 * 3600));
    
     // ตรวจสอบและอัพเดทจำนวนวัน
     if (daysSinceLogin > lastCheckedDay) {
      setLastCheckedDay(daysSinceLogin);

      // แสดงข้อความแจ้งเตือนเมื่อครบวัน
      if (daysSinceLogin > 0) {
        console.log(`คุณได้ Login มาแล้ว ${daysSinceLogin} วัน`);
      }
    }
  }, [currentTime, lastCheckedDay, userAuth.isAuthenticated, userAuth.issuedAt]);

  useEffect(() => {
    // สำหรับคำนวณเวลาที่เหลือก่อน token หมดอายุ (ในหน่วยวินาที)
    const timeUntilExpiry = userAuth.expires - currentTime;

    console.log("Current Time:", currentTime);
    console.log("Token Expires:", userAuth.expires);
    console.log("Time Until Expiry:", timeUntilExpiry);

    // ถ้าเหลือเวลาน้อยกว่า 5 นาที ให้รีเฟรช token
    if (timeUntilExpiry < 300) {
      // 300 วินาที = 5 นาที
      // ทำการ refresh token ที่นี่
      // อาจจะเรียก API เพื่อขอ token ใหม่
      console.log("Token ใกล้หมดอายุ กำลังรีเฟรช...");
      // เพิ่มโลจิกรีเฟรช token ที่นี่
      // Example:
      // await refreshToken()
      //   .then(newSession => updateSession(newSession))
      //   .catch(() => router.push("/"))
    }
  }, [currentTime, userAuth.expires]);

  // เพิ่ม routes ที่ไม่ต้องการ protect
  const publicRoutes = ["/"];
  const isPublicPage = publicRoutes.some((route) => pathname === route);
  console.log("isPublicPage", isPublicPage);

  useEffect(() => {
    if (userAuth.isLoading) return;

    if (
      (userAuth.isAuthenticated || currentTime < userAuth.expires) &&
      isPublicPage
    ) {
      // ถ้า login แล้วและอยู่หน้า public ให้ไปหน้า products
      router.push(`/products`);
    } else if (
      (!userAuth.isAuthenticated || currentTime >= userAuth.expires) &&
      !isPublicPage
    ) {
      // ถ้าไม่ได้ login และไม่ใช่หน้า public ให้ไปหน้าแรก
      router.push("/");
    }
  }, [
    isPublicPage,
    pathname,
    router,
    currentTime,
    userAuth.isLoading,
    userAuth.isAuthenticated,
    userAuth.expires,
  ]);

  if (userAuth.isLoading) {
    return <div>Loading...</div>; // หรือใส่ loading component ที่สวยงาม
  }

  return children;
}
