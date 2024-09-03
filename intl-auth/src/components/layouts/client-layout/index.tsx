"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import { usePathname } from "@/navigation";
import { publicRoutes, showNavbarPaths } from "@/routes";
import { useVisibility } from "@/hooks";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isPublicRoute = useVisibility(pathname, publicRoutes);
  const shouldShowNavbar = useVisibility(pathname, showNavbarPaths);

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
  }, []);

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
