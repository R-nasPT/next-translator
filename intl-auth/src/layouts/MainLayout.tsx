"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "@/navigation";
import { hiddenLayoutRoutes, showHeaderNavPaths, showNavbarPaths } from "@/routes";
import { useVisibility } from "@/hooks";
import { MdMenu } from "@/lib/icons";
import { cn } from "@/utils";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import HeaderNav from "./header-nav";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const hiddenLayoutRoute = useVisibility(pathname, hiddenLayoutRoutes);
  const shouldShowNavbar = useVisibility(pathname, showNavbarPaths);
  const shouldShowHeaderNav = useVisibility(pathname, showHeaderNavPaths);

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
  }, [pathname]);

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

  if (hiddenLayoutRoute) {
    return children;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn(
          `absolute bg-white left-0 top-5 p-2 rounded-r-lg focus:outline-none transition-smooth z-50`,
          isSidebarOpen ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100 shadow-[0_0_5px_rgba(0,0,0,0.3)]"
        )}
      >
        <MdMenu className="w-6 h-6" />
      </button>
      <div
        ref={mainContentRef}
        className={`flex-1 flex flex-col bg-[#fafafa] overflow-y-auto hide-scrollbar lg:show-scrollbar transition-all duration-500 ease-in-out ${
          isSidebarOpen && "lg:ml-[210px]"
        }`}
      >
        {shouldShowNavbar && <Navbar isScrolled={isScrolled} />}
        {shouldShowHeaderNav && <HeaderNav isScrolled={isScrolled} />}
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
