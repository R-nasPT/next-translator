"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "@/navigation";
import { publicRoutes, showHeaderNavPaths, showNavbarPaths } from "@/routes";
import { useVisibility } from "@/hooks";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import HeaderNav from "../header-nav";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isPublicRoute = useVisibility(pathname, publicRoutes);
  const shouldShowNavbar = useVisibility(pathname, showNavbarPaths);
  const shouldShowHeaderNav = useVisibility(pathname, showHeaderNavPaths);
  
  //เพิ่ม Effect ใหม่เพื่อ reset scroll state เมื่อมีการเปลี่ยนหน้า
  //รีเซ็ตสถานะการเลื่อนเมื่อชื่อเส้นทางเปลี่ยนแปลง
  useEffect(() => {
    setIsScrolled(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 0);
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [pathname]); //เพิ่ม pathname เป็น dependency ใน scroll effect

  // ถ้าจอใหญ่ค่าเริ่มต้นเป็น true คือ ให้เปิด sidebar ไว้ เป็นค่าเริ่มต้น
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        ref={mainContentRef}
        className={`flex-1 flex flex-col bg-[#fafafa] overflow-y-auto hide-scrollbar lg:show-scrollbar transition-all duration-500 ease-in-out ${
          isSidebarOpen && "lg:ml-[210px]"
        }`}
      >
        {shouldShowNavbar && (
          <Navbar
            isScrolled={isScrolled}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {shouldShowHeaderNav && (
          <HeaderNav
            isScrolled={isScrolled}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        <main className="flex-1 px-7">{children}</main>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
