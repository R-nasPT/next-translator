"use client";

import { useSidebarMenu } from "@/constants";
import { usePathname } from "@/navigation";
import { useCallback, useMemo, useState } from "react";
import { MdMenu } from "@/libs/icons";
import { cn } from "@/utils";
import NavbarButton from "../button/NavbarButton";

interface NavbarProps {
  isScrolled: boolean;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ isScrolled, onMenuClick, isSidebarOpen }: NavbarProps) {
  const pathname = usePathname();
  const { mainMenu, subMenu, dashboardMenu } = useSidebarMenu();

  const findMenuLabel = useCallback(
    (menus: any) => {
      const menu = menus.find((menu: any) => menu.path === pathname);
      if (menu) return menu.labelNav;

      const subMenu = menus
        .flatMap((menu: any) => menu.sub_menu || [])
        .find((sub: any) => sub.path === pathname);
      return subMenu ? subMenu.labelNav : null;
    },
    [pathname]
  );

  const currentPageTitle = useMemo(() => {
    if (dashboardMenu.sub_menu.some(item => item.path === pathname)) {
      return findMenuLabel(dashboardMenu.sub_menu) || dashboardMenu.label;
    }
    return findMenuLabel(mainMenu) || findMenuLabel(subMenu) || "Dashboard";
  }, [findMenuLabel, mainMenu, subMenu, dashboardMenu, pathname]);

  return (
    <nav
      className={`sticky top-0 pt-10 pb-8 z-40 lg:pt-8 lg:pb-6 px-14 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-b-lg ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      }`}
    >
      <button
        onClick={onMenuClick}
        className={cn(
          `absolute bg-white left-0 top-5 p-2 rounded-r-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] focus:outline-none transition-all duration-300`,
          isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <MdMenu className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold text-[#7645d9] lg:text-3xl">
        {currentPageTitle}
      </h1>
      <div className="flex items-center gap-3">
        <NavbarButton />
      </div>
    </nav>
  );
}
